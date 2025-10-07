<?php

namespace Phoenix\Press;

class Api {
    private const TOKEN_CACHE_DURATION = 300; // 5 minutes
    private const TOKEN_CACHE_GROUP = 'phoenix_tokens';

    public static function init() {
        add_action( 'rest_api_init', [ __CLASS__, 'register_rest_routes' ] );
        add_action(
            'rest_api_init',

            function () {
                add_filter( 'rest_pre_serve_request', function ( $value ) {
                    header(
                        'Access-Control-Allow-Headers: Content-Type, x-turnstile-token'
                    );
                    return $value;
                }
            );
        }
        ,
        15
    );
}

public static function register_rest_routes() {
    register_rest_route( 'phoenix-press/v1', '/submit-lead-form', [
        'methods' => 'POST',
        'callback' => [ __CLASS__, 'submit_lead' ],
        'permission_callback' => [ __CLASS__, 'verify_turnstile_token' ],
    ] );

    register_rest_route(
        'phoenix-press/v1',
        '/submit-lead-form/(?P<id>\d+)',
        [
            'methods' => 'PUT',
            'callback' => [ __CLASS__, 'update_lead' ],
            'permission_callback' => [ __CLASS__, 'verify_turnstile_token' ],
        ]
    );

    register_rest_route( 'phoenix-press/v1', '/quote', [
        'methods' => 'POST',
        'callback' => [ __CLASS__, 'get_quote' ],
        'permission_callback' => '__return_true',
    ] );

    register_rest_route( 'phoenix-press/v1', '/bookings', [
        'methods' => 'POST',
        'callback' => [ __CLASS__, 'create_booking' ],
        'permission_callback' => '__return_true',
    ] );
}

public static function submit_lead( $request )
 {
    $api_url = get_option( 'phoenix_api_url' );

    if ( empty( $api_url ) ) {
        return new \WP_REST_Response(
            [ 'error' => 'API URL is not configured' ],
            500
        );
    }

    $data = $request->get_json_params();

    if ( empty( $data ) ) {
        return new \WP_REST_Response( [ 'error' => 'Invalid JSON data' ], 400 );
    }

    // Sanitize text fields
    foreach ( $data as $key => $value ) {
        if ( is_string( $value ) ) {
            $data[ $key ] = sanitize_text_field( $value );
        }
    }

    $response = wp_remote_post( $api_url . '/form-submission', [
        'body' => wp_json_encode( $data ),
        'headers' => [ 'Content-Type' => 'application/json' ],
    ] );

    if ( is_wp_error( $response ) ) {
        return new \WP_REST_Response( [ 'error' => 'Failed to submit' ], 500 );
    }

    return new \WP_REST_Response(
        json_decode( wp_remote_retrieve_body( $response ) ),
        200
    );
}
public static function update_lead( $request )
 {
    $api_url = get_option( 'phoenix_api_url' );
    if ( empty( $api_url ) ) {
        return new \WP_REST_Response(
            [ 'error' => 'API URL is not configured' ],
            500
        );
    }

    $id = $request->get_param( 'id' );
    if ( empty( $id ) ) {
        return new \WP_REST_Response( [ 'error' => 'Missing lead ID' ], 400 );
    }

    $data = $request->get_json_params();
    if ( empty( $data ) ) {
        return new \WP_REST_Response(
            [ 'error' => 'Invalid or missing JSON data' ],
            400
        );
    }

    // Sanitize text fields
    foreach ( $data as $key => $value ) {
        if ( is_string( $value ) ) {
            $data[ $key ] = sanitize_text_field( $value );
        }
    }

    $endpoint_url = trailingslashit( $api_url ) . "form-submission/{$id}";

    $response = wp_remote_request( $endpoint_url, [
        'method' => 'PUT',
        'body' => wp_json_encode( $data ),
        'headers' => [
            'Content-Type' => 'application/json',
        ],
    ] );

    if ( is_wp_error( $response ) ) {
        return new \WP_REST_Response(
            [
                'error' => 'Failed to update submission',
                'details' => $response->get_error_message(),
            ],
            500
        );
    }

    $response_body = wp_remote_retrieve_body( $response );
    $decoded_body = json_decode( $response_body, true );

    if ( json_last_error() !== JSON_ERROR_NONE ) {
        return new \WP_REST_Response(
            [ 'error' => 'Invalid response from API' ],
            500
        );
    }

    return new \WP_REST_Response( $decoded_body, 200 );
}

public static function get_quote( $request ) {
    $api_url = get_option( 'phoenix_api_url' );
    if ( empty( $api_url ) ) {
        return new \WP_REST_Response( [ 'error' => 'API URL is not configured' ], 500 );
    }

    $data = $request->get_json_params();
    if ( empty( $data ) ) {
        return new \WP_REST_Response( [ 'error' => 'Invalid JSON data' ], 400 );
    }

    $response = wp_remote_post( $api_url . '/quote', [
        'body' => wp_json_encode( $data ),
        'headers' => [ 'Content-Type' => 'application/json' ],
    ] );

    if ( is_wp_error( $response ) ) {
        return new \WP_REST_Response( [ 'error' => 'Failed to fetch quote' ], 500 );
    }

    return new \WP_REST_Response( json_decode( wp_remote_retrieve_body( $response ) ), 200 );
}

public static function create_booking( $request ) {
    $api_url = get_option( 'phoenix_api_url' );
    if ( empty( $api_url ) ) {
        return new \WP_REST_Response( [ 'error' => 'API URL is not configured' ], 500 );
    }

    $data = $request->get_json_params();
    if ( empty( $data ) ) {
        return new \WP_REST_Response( [ 'error' => 'Invalid JSON data' ], 400 );
    }

    $response = wp_remote_post( $api_url . '/bookings', [
        'body' => wp_json_encode( $data ),
        'headers' => [ 'Content-Type' => 'application/json' ],
    ] );

    if ( is_wp_error( $response ) ) {
        return new \WP_REST_Response( [ 'error' => 'Failed to create booking' ], 500 );
    }

    return new \WP_REST_Response( json_decode( wp_remote_retrieve_body( $response ) ), 200 );
}

public static function verify_turnstile_token( $request )
 {

    return true;
    $headers = $request->get_headers();
    $token = $headers[ 'x_turnstile_token' ][ 0 ] ?? '';

    if ( empty( $token ) ) {
        return false;
    }

    $is_processed = self::is_token_processed( $token );

    if ( $is_processed ) {
        return true;
    }

    $turnstile_secret = get_option( 'phoenix_turnstile_secret_key' );
    if ( empty( $turnstile_secret ) ) {
        return false;
    }

    $response = wp_remote_post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        [
            'body' => [
                'secret' => $turnstile_secret,
                'response' => $token,
            ],
        ]
    );

    if ( is_wp_error( $response ) ) {
        return false;
    }

    $data = json_decode( wp_remote_retrieve_body( $response ), true );

    $is_valid = isset( $data[ 'success' ] ) && $data[ 'success' ] === true;

    if ( $is_valid ) {
        self::mark_token_processed( $token );
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



}
