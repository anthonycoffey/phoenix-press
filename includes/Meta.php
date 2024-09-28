<?php

namespace Phoenix\Press;

class Meta
{

  public static function init()
  {
    add_action('wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ]);
    add_action('rest_api_init', [ __CLASS__, 'register_rest_routes' ]);
  }

  public function enqueue_scripts()
  {
    wp_enqueue_script(
      'phoenix-press-js',
      plugins_url('assets/js/bundle.js', __FILE__),
      array('wp-element'), // WordPress has React built-in as wp-element
      '1.0',
      true
    );

    // Localize script to pass nonces or any PHP data to your React app
    wp_localize_script('phoenix-press-js', 'data', array(
      'nonce' => wp_create_nonce('wp_rest'), // Create a nonce for security
      'api_url' => home_url('/wp-json/phoenix-press/v1/'),
    ));
  }

  function register_rest_routes()
  {
    // Route to get data
    register_rest_route('your-plugin/v1', '/get-form-data', array(
      'methods' => 'GET',
      'callback' => [ __CLASS__, 'get_form_data' ],
      'permission_callback' => function () {return true;},
    ));

    // Route to submit data
    register_rest_route('your-plugin/v1', '/submit-lead', array(
      'methods' => 'POST',
      'callback' => [ __CLASS__, 'submit_lead' ],
      'permission_callback' => function () {
        return check_ajax_referer('wp_rest', '_wpnonce', false);
      },
    ));
  }

// Fetch lead data
  public function get_form_data($request)
  {
    // Fetch some initial data from the external API
    $response = wp_remote_get(PHOENIX_PRESS_API . '/path/to/form-data');
    $body = wp_remote_retrieve_body($response);

    return new WP_REST_Response(json_decode($body), 200);
  }

// Submit lead data
  public function submit_lead(WP_REST_Request $request)
  {
    $data = $request->get_json_params();

    // Post data to external API
    $response = wp_remote_post(PHOENIX_PRESS_API . '/submit', array(
      'body' => json_encode($data),
      'headers' => array('Content-Type' => 'application/json'),
    ));

    if (is_wp_error($response)) {
      return new WP_REST_Response(array('error' => 'Failed to submit'), 400);
    }

    return new WP_REST_Response(json_decode(wp_remote_retrieve_body($response)), 200);
  }

}
