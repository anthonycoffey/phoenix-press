<?php
namespace Phoenix\Press;

class Assets {
    private static $manifest;
    private static $build_url;

    public static function init() {
        $plugin_dir = plugin_dir_path( dirname( __FILE__ ) );
        self::$build_url = plugins_url( 'build/', dirname( __FILE__ ) );
        self::$manifest = self::load_manifest( $plugin_dir . 'build/auto/manifest.json' );

        add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
    }

    private static function load_manifest( $manifest_path ) {
        if ( file_exists( $manifest_path ) ) {
            return json_decode( file_get_contents( $manifest_path ), true );
        }
        return [];
    }

    public static function enqueue_scripts() {
        // External CDN scripts
        self::enqueue_external_scripts();

        // Dynamic webpack assets
        self::enqueue_webpack_assets();

        // Localize script with dynamic data
        self::localize_script_data();
    }

    private static function enqueue_external_scripts() {
        // Cloudflare Turnstile API
        wp_enqueue_script(
            'turnstile-api',
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
            [],
            null,
            true
        );

        // MUI and Emotion scripts
        wp_enqueue_script(
            'mui-js',
            'https://cdn.jsdelivr.net/npm/@mui/material@5.16.1/umd/material-ui.development.js',
            [ 'wp-element' ],
            '5.16.1',
            true
        );

        wp_enqueue_script(
            'emotion-react-js',
            'https://cdn.jsdelivr.net/npm/@emotion/react@11.13.3/dist/emotion-react.umd.min.js',
            [ 'wp-element' ],
            '11.13.3',
            true
        );

        wp_enqueue_script(
            'emotion-styled-js',
            'https://cdn.jsdelivr.net/npm/@emotion/styled@11.3.0/dist/emotion-styled.umd.min.js',
            [],
            '11.3.0',
            true
        );
    }


    private static function enqueue_webpack_assets() {
        // Main JS
        // Find and enqueue main JS file
        // Log the manifest content for debugging
        error_log('Manifest content: ' . print_r(self::$manifest, true));

        foreach (self::$manifest as $key => $path) {
            if (preg_match('/main.js/', $key)) {
            error_log('Found main JS file: ' . $key . ' => ' . $path);
            wp_enqueue_script(
                'phoenix-press-main-js',
                self::$build_url . $path,
                ['wp-element'], // Default dependency
                null,
                true
            );
            break; // Stop after finding main file
            }
        }
        
        // Log if main JS file was not found
        if (!wp_script_is('phoenix-press-main-js', 'registered')) {
            error_log('Main JS file not found in manifest');
        }

        // Dynamically enqueue all chunk files
        foreach (self::$manifest as $key => $path) {
            if (preg_match('/^(\d+)\.js$/', $key, $matches)) {
            $chunk_id = $matches[1];
            wp_enqueue_script(
                "phoenix-press-chunk-{$chunk_id}",
                self::$build_url . $path,
                ['wp-element'], // Default dependency
                null,
                true
            );
            }
            
            // Handle CSS files
            if (preg_match('/(\d+)\.css$/', $key, $matches)) {
                $css_id = $matches[1];
                wp_enqueue_style(
                    "phoenix-press-chunk-{$css_id}-css",
                    self::$build_url . $path,
                    [],
                    null
                );
                error_log("Enqueued CSS file {$key} with handle phoenix-press-chunk-{$css_id}-css");
            }
        }
        }


    private static function find_asset_by_prefix( $prefix ) {
        foreach ( self::$manifest as $file => $path ) {
            if ( strpos( $file, $prefix ) === 0 ) {
                return $path;
            }
        }
        return null;
    }

    private static function localize_script_data() {
        $localized_data = [
            'NONCE' => wp_create_nonce( 'wp_rest' ),
            'API_URL' => rest_url( 'phoenix-press/v1' ),
            'ASSETS_URL' => plugins_url( 'assets', __DIR__ ),
            'GMAPS_API_KEY' => get_option( 'phoenix_gmaps_api_key', '' ),
            'SMS_CONSENT_MESSAGE' => get_option( 'phoenix_sms_consent_message', '' ),
            'DISCLAIMER_MESSAGE' => get_option( 'phoenix_disclaimer_message', '' ),
            'SUBMISSION_MESSAGE' => get_option( 'phoenix_submission_message', '' ),
            'TURNSTILE_SITE_KEY' => get_option( 'phoenix_turnstile_site_key', '' ),
        ];

        wp_localize_script( 'phoenix-press-main-js', 'LOCALIZED', $localized_data );
    }

    public function dequeue_scripts() {
        // Main JS
        $main_js = self::find_asset_by_prefix( 'main.js' );
        if ( $main_js ) {
            wp_dequeue_script( 'phoenix-press-main-js' );
            wp_deregister_script( 'phoenix-press-main-js' );
        }

        // Chunk JS files
        foreach ( self::$manifest as $file => $path ) {
            if ( preg_match( '/^(\d+)\.js$/', $file, $matches ) ) {
                wp_dequeue_script( "phoenix-press-chunk-{$matches[1]}" );
                wp_deregister_script( "phoenix-press-chunk-{$matches[1]}" );
            }
        }

        // Main CSS
        wp_dequeue_style( 'phoenix-press-main-style' );
        wp_deregister_style( 'phoenix-press-main-style' );

        // External scripts
        wp_dequeue_script( 'turnstile-api' );
        wp_deregister_script( 'turnstile-api' );
    }
}