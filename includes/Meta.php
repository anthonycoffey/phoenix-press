<?php

namespace Phoenix\Press;

class Meta
{
    private const TOKEN_CACHE_DURATION = 300; // 5 minutes
    private const TOKEN_CACHE_GROUP = 'phoenix_tokens';

    public static function init()
    {
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
        add_action('rest_api_init', [__CLASS__, 'register_rest_routes']);
        add_action('wp_footer', [__CLASS__, 'lead_form']);
        add_shortcode('phoenix_form', [__CLASS__, 'lead_form_shortcode']);
        add_action('admin_menu', [__CLASS__, 'add_settings_page']);
        add_action('admin_init', [__CLASS__, 'register_settings']);
        add_action('rest_api_init', function () {
            add_filter('rest_pre_serve_request', function ($value) {
                header('Access-Control-Allow-Headers: Content-Type, x-turnstile-token');
                return $value;
            });
        }, 15);
    }

    public static function enqueue_scripts()
    {
        $gmaps_api_key = get_option('phoenix_gmaps_api_key', '');
        $phoenix_sms_consent_message = get_option('phoenix_sms_consent_message', '');
        $phoenix_disclaimer_message = get_option('phoenix_disclaimer_message', '');
        $phoenix_submission_message = get_option('phoenix_submission_message', '');
        $turnstile_site_key = get_option('phoenix_turnstile_site_key', '');

        wp_enqueue_script(
            'phoenix-press-js',
            plugins_url('build/phoenix-press.js', __DIR__),
            ['wp-element'],
            PHOENIX_PRESS_VERSION,
            true
        );

        wp_localize_script('phoenix-press-js', 'LOCALIZED', [
            'NONCE' => wp_create_nonce('wp_rest'),
            'API_URL' => rest_url('phoenix-press/v1'),
            'ASSETS_URL' => plugins_url('assets', __DIR__),
            'GMAPS_API_KEY' => $gmaps_api_key,
            'SMS_CONSENT_MESSAGE' => $phoenix_sms_consent_message,
            'DISCLAIMER_MESSAGE' => $phoenix_disclaimer_message,
            'SUBMISSION_MESSAGE' => $phoenix_submission_message,
            'TURNSTILE_SITE_KEY' => $turnstile_site_key,
        ]);

        wp_enqueue_script(
            'turnstile-api',
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
            [],
            array(
                'in_footer' => true,
                'strategy'  => 'async',
            ),
            true
        );
    }

    public static function register_rest_routes()
    {
        register_rest_route('phoenix-press/v1', '/submit-lead-form', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'submit_lead'],
            'permission_callback' => [__CLASS__, 'verify_turnstile_token']
        ]);

        register_rest_route('phoenix-press/v1', '/submit-lead-form/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [__CLASS__, 'update_lead'],
            'permission_callback' => [__CLASS__, 'verify_turnstile_token']
        ]);
    }

    public static function submit_lead($request)
    {
        $api_url = get_option('phoenix_api_url');

        if (empty($api_url)) {
            return new \WP_REST_Response(['error' => 'API URL is not configured'], 500);
        }

        $data = $request->get_json_params();

        if (empty($data)) {
            return new \WP_REST_Response(['error' => 'Invalid JSON data'], 400);
        }

        $response = wp_remote_post($api_url . '/form-submission', [
            'body' => wp_json_encode($data),
            'headers' => ['Content-Type' => 'application/json'],
        ]);

        if (is_wp_error($response)) {
            return new \WP_REST_Response(['error' => 'Failed to submit'], 500);
        }

        return new \WP_REST_Response(
            json_decode(wp_remote_retrieve_body($response)),
            200
        );
    }

    public static function update_lead($request)
    {
        $api_url = get_option('phoenix_api_url');
        if (empty($api_url)) {
            return new \WP_REST_Response(['error' => 'API URL is not configured'], 500);
        }

        $id = $request->get_param('id');
        if (empty($id)) {
            return new \WP_REST_Response(['error' => 'Missing lead ID'], 400);
        }

        $data = $request->get_json_params();
        if (empty($data)) {
            return new \WP_REST_Response(['error' => 'Invalid or missing JSON data'], 400);
        }

        $endpoint_url = trailingslashit($api_url) . "form-submission/{$id}";

        $response = wp_remote_request($endpoint_url, [
            'method'  => 'PUT',
            'body'    => wp_json_encode($data),
            'headers' => [
                'Content-Type' => 'application/json',
            ],
        ]);

        if (is_wp_error($response)) {
            return new \WP_REST_Response([
                'error'   => 'Failed to update submission',
                'details' => $response->get_error_message(),
            ], 500);
        }

        $response_body = wp_remote_retrieve_body($response);
        $decoded_body = json_decode($response_body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new \WP_REST_Response(['error' => 'Invalid response from API'], 500);
        }

        return new \WP_REST_Response($decoded_body, 200);
    }

    public static function verify_turnstile_token($request)
    {
      $headers = $request->get_headers();
      $token = $headers['x_turnstile_token'][0] ?? '';

      error_log(self::is_token_processed($token) );

        if (self::is_token_processed($token)) {
            error_log('Turnstile token has already been processed.');
            return true;
        }

        if (empty($token)) {
          error_log('Turnstile token is empty.');
          return false;
      }

        $turnstile_secret = get_option('phoenix_turnstile_secret_key');
        if (empty($turnstile_secret)) {
            error_log('Turnstile secret key is empty.');
            return false;
        }

        $response = wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'body' => [
                'secret' => $turnstile_secret,
                'response' => $token,
            ]
        ]);

        if (is_wp_error($response)) {
            error_log('Error in Cloudflare verification: ' . $response->get_error_message());
            return false;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);
        error_log('Cloudflare response: ' . print_r($data, true));

        $is_valid = isset($data['success']) && $data['success'] === true;

        if ($is_valid) {
            self::mark_token_processed($token);
            error_log('Turnstile token is valid and marked as processed.');
        } else {
            error_log('Turnstile token is invalid.');
        }

        return $is_valid;
    }

    private static function is_token_processed($token)
    {
        self::cleanup_token_cache();
    
        $cached_token = wp_cache_get($token, self::TOKEN_CACHE_GROUP);

        error_log('Cached token: ' . print_r($cached_token, true));
    
        if ($cached_token) {
            return true;
        }
    
        return false;
    }

    private static function mark_token_processed($token)
    {
        wp_cache_set($token, time(), self::TOKEN_CACHE_GROUP, self::TOKEN_CACHE_DURATION);
    }

    private static function cleanup_token_cache()
    {
        $now = time();
        $tokens = wp_cache_get('processed_tokens', self::TOKEN_CACHE_GROUP);
        error_log(print_r($tokens,true));

        if ($tokens) {
            foreach ($tokens as $token => $timestamp) {
                if ($now - $timestamp > self::TOKEN_CACHE_DURATION) {
                    wp_cache_delete($token, self::TOKEN_CACHE_GROUP);
                }
            }
        }
    }

    public static function lead_form()
    {
        echo '<div id="phoenix-form-root"></div>';
    }

    public static function lead_form_shortcode($attr)
    {
        ob_start();
        echo '<div class="phoenix-form-embed-root"></div>';
        return ob_get_clean();
    }

    public static function add_settings_page()
    {
        add_options_page(
            'Phoenix Press Settings',
            'Phoenix Press',
            'manage_options',
            'phoenix-press',
            [__CLASS__, 'render_settings_page']
        );
    }

    public static function render_settings_page()
    {
        echo '<div class="wrap">';
        echo '<h1>Phoenix Press Settings</h1>';
        echo '<form method="post" action="options.php">';
        settings_fields('phoenix_press_options');
        do_settings_sections('phoenix-press');
        submit_button();
        echo '</form>';
        echo '</div>';
    }

    public static function register_settings()
    {
        $settings = [
            'phoenix_turnstile_site_key' => [
                'label' => 'Turnstile Site Key',
                'type'  => 'text',
            ],
            'phoenix_turnstile_secret_key' => [
                'label' => 'Turnstile Secret Key',
                'type'  => 'text',
            ],
            'phoenix_gmaps_api_key' => [
                'label' => 'Google Maps API Key',
                'type'  => 'text',
            ],
            'phoenix_sms_consent_message' => [
                'label' => 'SMS Consent Message',
                'type'  => 'textarea',
            ],
            'phoenix_disclaimer_message' => [
                'label' => 'Disclaimer Message',
                'type'  => 'textarea',
            ],
            'phoenix_submission_message' => [
                'label' => 'Submission Confirmation Message',
                'type'  => 'textarea',
            ],
        ];

        foreach ($settings as $key => $setting) {
            register_setting('phoenix_press_options', $key);
            add_settings_section('phoenix_press_section', '', null, 'phoenix-press');
            add_settings_field(
                $key,
                $setting['label'],
                [__CLASS__, 'render_field'],
                'phoenix-press',
                'phoenix_press_section',
                [
                    'name' => $key,
                    'type' => $setting['type'],
                ]
            );
        }
    }

    public static function render_field($args)
    {
        $name = $args['name'];
        $type = $args['type'];
        $value = get_option($name);

        if ($type === 'text') {
            echo "<input type='text' name='$name' value='" . esc_attr($value) . "' />";
        } elseif ($type === 'textarea') {
            echo "<textarea name='$name'>" . esc_textarea($value) . "</textarea>";
        }
    }
}
