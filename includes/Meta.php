<?php

namespace Phoenix\Press;

class Meta
{
  public static function init()
  {
    add_action('wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ]);
    add_action('rest_api_init', [ __CLASS__, 'register_rest_routes' ]);
    add_action('wp_footer', [ __CLASS__, 'lead_form' ]);
    add_shortcode('phoenix_form', [ __CLASS__, 'lead_form_shortcode' ]);
    add_action('admin_menu', [ __CLASS__, 'add_settings_page' ]);
    add_action('admin_init', [ __CLASS__, 'register_settings' ]);
  }

  public static function enqueue_scripts()
  {
    $gmaps_api_key = get_option('phoenix_gmaps_api_key', '');
    $phoenix_sms_consent_message = get_option('phoenix_sms_consent_message', '');
    $phoenix_disclaimer_message = get_option('phoenix_disclaimer_message', '');
    $phoenix_submission_message = get_option('phoenix_submission_message', '');

    wp_enqueue_script(
      'phoenix-press-js',
      plugins_url('build/phoenix-press.js', __DIR__),
      [ 'wp-element' ],
      '1.0',
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
     ]);
  }

  public static function register_rest_routes()
  {
    register_rest_route('phoenix-press/v1', '/get-form-data', [
      'methods' => 'GET',
      'callback' => [ __CLASS__, 'get_form_data' ],
      'permission_callback' => '__return_true',
     ]);

    register_rest_route('phoenix-press/v1', '/submit-lead-form', [
      'methods' => 'POST',
      'callback' => [ __CLASS__, 'submit_lead' ],
      'permission_callback' => '__return_true',
     ]);

    register_rest_route('phoenix-press/v1', '/submit-lead-form/(?P<id>\d+)', [
      'methods' => 'PATCH',
      'callback' => [ __CLASS__, 'update_lead' ],
      'permission_callback' => '__return_true',
      'args' => [
        'id' => [
          'required' => true,
          'validate_callback' => function ($param, $request, $key) {
            return is_numeric($param);
          },
         ],
       ],
     ]);
  }

  public static function get_form_data($request)
  {
    $api_url = get_option('phoenix_api_url');
    $response = wp_remote_get($api_url . '/services?limit=all');
    $body = wp_remote_retrieve_body($response);

    return new \WP_REST_Response(json_decode($body), 200);
  }

  public static function submit_lead($request)
  {
    $api_url = get_option('phoenix_api_url');

    $data = $request->get_json_params();

    if (empty($data)) {
      return new \WP_REST_Response([ 'error' => 'Invalid JSON data' ], 400);
    }

    $response = wp_remote_post($api_url . '/form-submission', [
      'body' => wp_json_encode($data),
      'headers' => [ 'Content-Type' => 'application/json' ],
     ]);

    if (is_wp_error($response)) {
      return new \WP_REST_Response([ 'error' => 'Failed to submit' ], 500);
    }

    return new \WP_REST_Response(
      json_decode(wp_remote_retrieve_body($response)),
      200
    );
  }

  public static function update_lead($request)
  {
    $api_url = get_option('phoenix_api_url');

    $id = $request->get_param('id');
    $data = $request->get_json_params();

    if (empty($data)) {
      return new \WP_REST_Response([ 'error' => 'Invalid JSON data' ], 400);
    }

    $response = wp_remote_request($api_url . "/form-submission/{$id}", [
      'method' => 'PATCH',
      'body' => wp_json_encode($data),
      'headers' => [ 'Content-Type' => 'application/json' ],
     ]);

    if (is_wp_error($response)) {
      return new \WP_REST_Response([ 'error' => 'Failed to update submission' ], 500);
    }

    return new \WP_REST_Response(
      json_decode(wp_remote_retrieve_body($response)),
      200
    );
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
      [ __CLASS__, 'render_settings_page' ]
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
    register_setting('phoenix_press_options', 'phoenix_gmaps_api_key');
    register_setting('phoenix_press_options', 'phoenix_api_url');
    register_setting(
      'phoenix_press_options',
      'phoenix_sms_consent_message',
      [
        'sanitize_callback' => 'wp_kses_post',
        'default' => '',
       ]
    );

    register_setting(
      'phoenix_press_options',
      'phoenix_disclaimer_message',
      [
        'sanitize_callback' => 'wp_kses_post',
        'default' => '',
       ]
    );

    register_setting(
      'phoenix_press_options',
      'phoenix_submission_message',
      [
        'sanitize_callback' => 'wp_kses_post',
        'default' => '',
       ]
    );

    add_settings_section(
      'phoenix_press_main_section',
      'Main Settings',
      null,
      'phoenix-press'
    );

    add_settings_field(
      'phoenix_gmaps_api_key',
      'Google Maps API Key',
      [ __CLASS__, 'gmaps_api_key_field_callback' ],
      'phoenix-press',
      'phoenix_press_main_section'
    );

    add_settings_field(
      'phoenix_api_url',
      'Phoenix API URL',
      [ __CLASS__, 'phoenix_api_url_field_callback' ],
      'phoenix-press',
      'phoenix_press_main_section'
    );

    add_settings_field(
      'phoenix_sms_consent_message',
      'SMS Consent Message',
      [ __CLASS__, 'textarea_field_callback' ],
      'phoenix-press',
      'phoenix_press_main_section',
      [ 'field' => 'phoenix_sms_consent_message' ]
    );

    add_settings_field(
      'phoenix_disclaimer_message',
      'Disclaimer Message',
      [ __CLASS__, 'textarea_field_callback' ],
      'phoenix-press',
      'phoenix_press_main_section',
      [ 'field' => 'phoenix_disclaimer_message' ]
    );

    add_settings_field(
      'phoenix_submission_message',
      'Submission Message',
      [ __CLASS__, 'textarea_field_callback' ],
      'phoenix-press',
      'phoenix_press_main_section',
      [ 'field' => 'phoenix_submission_message' ]
    );

  }

  public static function textarea_field_callback($args)
  {
    $field = $args[ 'field' ];
    $value = get_option($field, '');
    printf(
      '<textarea id="%1$s" name="%1$s" rows="5" cols="50" class="large-text">%2$s</textarea>',
      esc_attr($field),
      esc_textarea($value)
    );
  }

  public static function gmaps_api_key_field_callback()
  {
    $apiKey = get_option('phoenix_gmaps_api_key', '');
    echo '<input type="text" id="phoenix_gmaps_api_key" name="phoenix_gmaps_api_key" value="' .
    esc_attr($apiKey) .
      '" size="50" />';
  }

  public static function phoenix_api_url_field_callback()
  {
    $apiUrl = get_option('phoenix_api_url', '');
    echo '<input type="text" id="phoenix_api_url" name="phoenix_api_url" value="' .
    esc_attr($apiUrl) .
      '" size="50" />';
  }

}
