<?php

namespace Phoenix\Press;

class Meta
{
    private const TOKEN_CACHE_DURATION = 300; // 5 minutes
    private const TOKEN_CACHE_GROUP = "phoenix_tokens";

    public static function deactivate()
    {
        add_action("wp_enqueue_scripts", [__CLASS__, "dequeue_scripts"]);
    }

    public static function init()
    {
        add_action("wp_enqueue_scripts", [__CLASS__, "enqueue_scripts"]);
        add_action("rest_api_init", [__CLASS__, "register_rest_routes"]);
        add_action("wp_footer", [__CLASS__, "lead_form"]);
        add_shortcode("phoenix_form", [__CLASS__, "lead_form_shortcode"]);
        add_action("admin_menu", [__CLASS__, "add_settings_page"]);
        add_action("admin_init", [__CLASS__, "register_settings"]);
        add_action(
            "rest_api_init",
            function () {
                add_filter("rest_pre_serve_request", function ($value) {
                    header(
                        "Access-Control-Allow-Headers: Content-Type, x-turnstile-token"
                    );
                    return $value;
                });
            },
            15
        );
    }

    public static function verify_turnstile_token($request)
    {
        $headers = $request->get_headers();
        $token = $headers["x_turnstile_token"][0] ?? "";

        if (empty($token)) {
            return false;
        }

        $is_processed = self::is_token_processed($token);

        if ($is_processed) {
            return true;
        }

        $turnstile_secret = get_option("phoenix_turnstile_secret_key");
        if (empty($turnstile_secret)) {
            return false;
        }

        $response = wp_remote_post(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            [
                "body" => [
                    "secret" => $turnstile_secret,
                    "response" => $token,
                ],
            ]
        );

        if (is_wp_error($response)) {
            return false;
        }

        $data = json_decode(wp_remote_retrieve_body($response), true);

        $is_valid = isset($data["success"]) && $data["success"] === true;

        if ($is_valid) {
            self::mark_token_processed($token);
            return true;
        }

        return false;
    }

    private static function is_token_processed($token)
    {
        $cache_key = "phoenix_processed_turnstile_tokens";
        $processed_tokens = get_transient($cache_key);

        if (empty($processed_tokens) || !is_array($processed_tokens)) {
            return false;
        }

        $is_processed =
            isset($processed_tokens[$token]) &&
            time() - $processed_tokens[$token] < self::TOKEN_CACHE_DURATION;

        return $is_processed;
    }

    private static function mark_token_processed($token)
    {
        $cache_key = "phoenix_processed_turnstile_tokens";
        $processed_tokens = get_transient($cache_key) ?: [];
        $processed_tokens[$token] = time();
        $current_time = time();
        $processed_tokens = array_filter($processed_tokens, function (
            $timestamp
        ) use ($current_time) {
            $is_valid = $current_time - $timestamp < self::TOKEN_CACHE_DURATION;
            return $is_valid;
        });

        set_transient(
            $cache_key,
            $processed_tokens,
            self::TOKEN_CACHE_DURATION
        );
    }

    public static function register_rest_routes()
    {
        register_rest_route("phoenix-press/v1", "/submit-lead-form", [
            "methods" => "POST",
            "callback" => [__CLASS__, "submit_lead"],
            "permission_callback" => [__CLASS__, "verify_turnstile_token"],
        ]);

        register_rest_route(
            "phoenix-press/v1",
            "/submit-lead-form/(?P<id>\d+)",
            [
                "methods" => "PUT",
                "callback" => [__CLASS__, "update_lead"],
                "permission_callback" => [__CLASS__, "verify_turnstile_token"],
            ]
        );
    }

    public static function enqueue_scripts()
    {
        $gmaps_api_key = get_option("phoenix_gmaps_api_key", "");
        $phoenix_sms_consent_message = get_option(
            "phoenix_sms_consent_message",
            ""
        );
        $phoenix_disclaimer_message = get_option(
            "phoenix_disclaimer_message",
            ""
        );
        $phoenix_submission_message = get_option(
            "phoenix_submission_message",
            ""
        );
        $turnstile_site_key = get_option("phoenix_turnstile_site_key", "");

        $phoenix_form_title = get_option("phoenix_form_title", "");

        $phoenix_form_subtitle = get_option("phoenix_form_subtitle", "");

        $plugin_dir = plugin_dir_path(dirname(__FILE__));
        $build_dir = $plugin_dir . 'build/';
        $build_url = plugins_url('build/', dirname(__FILE__));

        $main_asset_files = glob($build_dir . 'main.*.asset.php');
        if (!empty($main_asset_files)) {
            $main_asset_file = $main_asset_files[0];
            $main_asset = include $main_asset_file;
            $main_js_file = basename($main_asset_file, '.asset.php') . '.js';
            wp_enqueue_script(
                 "phoenix-press-js-{$main_js_file}",
                $build_url . $main_js_file,
                $main_asset['dependencies'],
                $main_asset['version'],
                true
            );

            wp_localize_script("phoenix-press-js-{$main_js_file}", "LOCALIZED", [
                "NONCE" => wp_create_nonce("wp_rest"),
                "API_URL" => rest_url("phoenix-press/v1"),
                "ASSETS_URL" => plugins_url("assets", __DIR__),
                "GMAPS_API_KEY" => $gmaps_api_key,
                "SMS_CONSENT_MESSAGE" => $phoenix_sms_consent_message,
                "DISCLAIMER_MESSAGE" => $phoenix_disclaimer_message,
                "SUBMISSION_MESSAGE" => $phoenix_submission_message,
                "TURNSTILE_SITE_KEY" => $turnstile_site_key,
            ]);
        }



        foreach (glob($build_dir . '*.asset.php') as $chunk_asset_file) {
            $chunk_name = basename($chunk_asset_file, '.asset.php');
            if (strpos($chunk_name, 'main') === false) {
                $chunk_asset = include $chunk_asset_file;
                wp_enqueue_script(
                    "phoenix-press-js-chunk-{$chunk_name}",
                    $build_url . "{$chunk_name}.js",
                    $chunk_asset['dependencies'],
                    $chunk_asset['version'],
                    true
                );
            }
        }

        // Enqueue the main CSS file
        $main_css_file = $build_dir . 'main.css';
        if (file_exists($main_css_file)) {
            wp_enqueue_style(
                'phoenix-press-main',
                $build_url . 'main.css',
                array(),
                filemtime($main_css_file)
            );
        }

        wp_enqueue_script(
            "turnstile-api",
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
            [],
            null,
            true
        );
    }

public static function dequeue_phoenix_scripts() {
   $plugin_dir = plugin_dir_path(dirname(__FILE__));
   $build_dir = $plugin_dir . 'build/';
   $build_url = plugins_url('build/', dirname(__FILE__));

   // Dequeue main JavaScript file
   $main_asset_files = glob($build_dir . 'main.*.asset.php');
   if (!empty($main_asset_files)) {
       $main_asset_file = $main_asset_files[0];
       $main_asset = include $main_asset_file;
       $main_js_file = basename($main_asset_file, '.asset.php') . '.js';
       wp_dequeue_script("phoenix-press-js-{$main_js_file}");
       wp_deregister_script("phoenix-press-js-{$main_js_file}");
   }

   // Dequeue dynamic chunk files
   foreach (glob($build_dir . '*.asset.php') as $chunk_asset_file) {
       $chunk_name = basename($chunk_asset_file, '.asset.php');
       if ($chunk_name !== 'main') {
           wp_dequeue_script("phoenix-press-js-chunk-{$chunk_name}");
           wp_deregister_script("phoenix-press-js-chunk-{$chunk_name}");
       }
   }

   // Dequeue main CSS file
   wp_dequeue_style('phoenix-press-main');
   wp_deregister_style('phoenix-press-main');

   // Dequeue Turnstile API script
   wp_dequeue_script('turnstile-api');
   wp_deregister_script('turnstile-api');
}


public static function submit_lead($request)
{
    $api_url = get_option("phoenix_api_url");

    if (empty($api_url)) {
        return new \WP_REST_Response(
            ["error" => "API URL is not configured"],
            500
        );
    }

    $data = $request->get_json_params();

    if (empty($data)) {
        return new \WP_REST_Response(["error" => "Invalid JSON data"], 400);
    }

    // Sanitize text fields
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $data[$key] = sanitize_text_field($value);
        }
    }

    $response = wp_remote_post($api_url . "/form-submission", [
        "body" => wp_json_encode($data),
        "headers" => ["Content-Type" => "application/json"],
    ]);

    if (is_wp_error($response)) {
        return new \WP_REST_Response(["error" => "Failed to submit"], 500);
    }

    return new \WP_REST_Response(
        json_decode(wp_remote_retrieve_body($response)),
        200
    );
}

public static function update_lead($request)
{
    $api_url = get_option("phoenix_api_url");
    if (empty($api_url)) {
        return new \WP_REST_Response(
            ["error" => "API URL is not configured"],
            500
        );
    }

    $id = $request->get_param("id");
    if (empty($id)) {
        return new \WP_REST_Response(["error" => "Missing lead ID"], 400);
    }

    $data = $request->get_json_params();
    if (empty($data)) {
        return new \WP_REST_Response(
            ["error" => "Invalid or missing JSON data"],
            400
        );
    }

    // Sanitize text fields
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $data[$key] = sanitize_text_field($value);
        }
    }

    $endpoint_url = trailingslashit($api_url) . "form-submission/{$id}";

    $response = wp_remote_request($endpoint_url, [
        "method" => "PUT",
        "body" => wp_json_encode($data),
        "headers" => [
            "Content-Type" => "application/json",
        ],
    ]);

    if (is_wp_error($response)) {
        return new \WP_REST_Response(
            [
                "error" => "Failed to update submission",
                "details" => $response->get_error_message(),
            ],
            500
        );
    }

    $response_body = wp_remote_retrieve_body($response);
    $decoded_body = json_decode($response_body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return new \WP_REST_Response(
            ["error" => "Invalid response from API"],
            500
        );
    }

    return new \WP_REST_Response($decoded_body, 200);
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
            "Phoenix Press Settings",
            "Phoenix Press",
            "manage_options",
            "phoenix-press",
            [__CLASS__, "render_settings_page"]
        );
    }

    public static function render_settings_page()
    {
        echo '<div class="wrap">';
        echo "<h1>Phoenix Press Settings</h1>";
        echo '<form method="post" action="options.php">';
        settings_fields("phoenix_press_options");
        do_settings_sections("phoenix-press");
        submit_button();
        echo "</form>";
        echo "</div>";
    }

    public static function register_settings()
    {
        $settings = [
            "phoenix_form_title" => [
                "label" => "Form Title",
                "type" => "text",
            ],
            "phoenix_form_subtitle" => [
                "label" => "Form Subtitle",
                "type" => "text",
            ],
            "phoenix_api_url" => [
                "label" => "Phoenix API Base URL",
                "type" => "text",
            ],
            "phoenix_turnstile_site_key" => [
                "label" => "Turnstile Site Key",
                "type" => "text",
            ],
            "phoenix_turnstile_secret_key" => [
                "label" => "Turnstile Secret Key",
                "type" => "text",
            ],
            "phoenix_gmaps_api_key" => [
                "label" => "Google Maps API Key",
                "type" => "text",
            ],
            "phoenix_sms_consent_message" => [
                "label" => "SMS Consent Message",
                "type" => "textarea",
            ],
            "phoenix_disclaimer_message" => [
                "label" => "Disclaimer Message",
                "type" => "textarea",
            ],
            "phoenix_submission_message" => [
                "label" => "Submission Confirmation Message",
                "type" => "textarea",
            ],
        ];

        foreach ($settings as $key => $setting) {
            register_setting("phoenix_press_options", $key);
            add_settings_section(
                "phoenix_press_section",
                "",
                null,
                "phoenix-press"
            );
            add_settings_field(
                $key,
                $setting["label"],
                [__CLASS__, "render_field"],
                "phoenix-press",
                "phoenix_press_section",
                [
                    "name" => $key,
                    "type" => $setting["type"],
                ]
            );
        }
    }

    public static function render_field($args)
    {
        $name = $args["name"];
        $type = $args["type"];
        $value = get_option($name);

        if ($type === "text") {
            echo "<input type='text' name='$name' value='" .
                esc_attr($value) .
                "' />";
        } elseif ($type === "textarea") {
            echo "<textarea name='$name'>" .
                esc_textarea($value) .
                "</textarea>";
        }
    }
}