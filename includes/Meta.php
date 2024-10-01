<?php

namespace Phoenix\Press;

class Meta
{
  public static function init()
  {
    add_action('wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ]);
    add_action('rest_api_init', [ __CLASS__, 'register_rest_routes' ]);
    add_action('wp_footer', [ __CLASS__, 'lead_form' ]);
    add_action('admin_menu', [ __CLASS__, 'add_settings_page' ]); // Add settings page
    add_action('admin_init', [ __CLASS__, 'register_settings' ]); // Register settings
  }

  public static function lead_form()
  {
    echo '<div id="phoenix-form-root"></div>';
  }

  public static function enqueue_scripts()
  {
    $gmaps_api_key = get_option('phoenix_gmaps_api_key', '');

    wp_enqueue_script(
      'phoenix-press-js',
      plugins_url('build/bundle.js', __DIR__),
      array('wp-element'),
      '1.0',
      true
    );

    wp_localize_script('phoenix-press-js', 'data', array(
      'nonce' => wp_create_nonce('wp_rest'),
      'api_url' => rest_url('phoenix-press/v1/'),
      'assets' => plugins_url('assets', __DIR__),
      'gmapsApiKey' => $gmaps_api_key, // Localize the Google Maps API Key
    ));
  }

  public static function register_rest_routes()
  {
    register_rest_route('phoenix-press/v1', '/get-form-data', array(
      'methods' => 'GET',
      'callback' => [ __CLASS__, 'get_form_data' ],
      'permission_callback' => function () {return true;},
    ));

    register_rest_route('phoenix-press/v1', '/submit-lead', array(
      'methods' => 'POST',
      'callback' => [ __CLASS__, 'submit_lead' ],
      'permission_callback' => function () {
        return check_ajax_referer('wp_rest', '_wpnonce', false);
      },
    ));
  }

  public static function get_form_data($request)
  {
    $response = wp_remote_get(PHOENIX_PRESS_API . '/services?limit=all');
    $body = wp_remote_retrieve_body($response);

    return new \WP_REST_Response(json_decode($body), 200);
  }

  public static function submit_lead($request)
  {
    $data = $request->get_json_params();

    $response = wp_remote_post(PHOENIX_PRESS_API . '/submit', array(
      'body' => json_encode($data),
      'headers' => array('Content-Type' => 'application/json'),
    ));

    if (is_wp_error($response)) {
      return new \WP_REST_Response(array('error' => 'Failed to submit'), 400);
    }

    return new \WP_REST_Response(json_decode(wp_remote_retrieve_body($response)), 200);
  }

  // Add the settings page to the WordPress Admin
  public static function add_settings_page()
  {
    add_options_page(
      'Phoenix Press Settings', // Page title
      'Phoenix Press', // Menu title
      'manage_options', // Capability
      'phoenix-press', // Menu slug
      [ __CLASS__, 'render_settings_page' ]// Callback to render
    );
  }

  // Render the settings page
  public static function render_settings_page()
  {
    ?>
        <div class="wrap">
            <h1>Phoenix Press Settings</h1>
            <form method="post" action="options.php">
                <?php
settings_fields('phoenix_press_options');
    do_settings_sections('phoenix-press');
    submit_button();
    ?>
            </form>
        </div>
        <?php
}

  // Register settings for the plugin
  public static function register_settings()
  {
    register_setting('phoenix_press_options', 'phoenix_gmaps_api_key');

    add_settings_section(
      'phoenix_press_main_section', // Section ID
      'Main Settings', // Title of the section
      null, // Callback function (not needed here)
      'phoenix-press' // Page slug
    );

    add_settings_field(
      'phoenix_gmaps_api_key', // Field ID
      'Google Maps API Key', // Field label
      [ __CLASS__, 'gmaps_api_key_field_callback' ], // Callback to render the input
      'phoenix-press', // Page slug
      'phoenix_press_main_section' // Section ID
    );
  }

  // Callback to render the input field for the Google Maps API key
  public static function gmaps_api_key_field_callback()
  {
    $apiKey = get_option('phoenix_gmaps_api_key', '');
    echo '<input type="text" id="phoenix_gmaps_api_key" name="phoenix_gmaps_api_key" value="' . esc_attr($apiKey) . '" size="50" />';
  }
}
