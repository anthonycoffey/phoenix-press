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

    // public static function deactivate()
    // {
    //     add_action( 'wp_enqueue_scripts', [ __CLASS__, 'dequeue_scripts' ] );
    // }

    // public static function activate()
    // {
    //     add_action( 'wp_enqueue_scripts', [ __CLASS__, 'enqueue_scripts' ] );
    // }

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
        $main_js = self::find_asset_by_prefix( 'main.js' );
        if ( $main_js ) {
            $asset_file = plugin_dir_path( dirname( __FILE__ ) ) . 'build/' . str_replace( '.js', '.asset.php', $main_js );
            if ( !file_exists( $asset_file ) ) {
                error_log( 'Phoenix Press: Main asset file not found: ' . $asset_file );
                return;
            }
            $main_asset = include $asset_file;
            error_log( 'Phoenix Press: Enqueuing main JS: ' . self::$build_url . $main_js );
            wp_enqueue_script(
                'phoenix-press-main-js',
                self::$build_url . $main_js,
                $main_asset[ 'dependencies' ],
                $main_asset[ 'version' ],
                true
            );
        } else {
            error_log( 'Phoenix Press: Main JS file not found in manifest' );
        }

        // Chunk JS files
        foreach ( self::$manifest as $file => $path ) {
            if ( preg_match( '/^(\d+)\$/', $file, $matches ) ) {
                $chunk_asset_file = plugin_dir_path( dirname( __FILE__ ) ) . "build/auto/{$file}.asset.php";
                if ( !file_exists( $chunk_asset_file ) ) {
                    error_log( 'Phoenix Press: Chunk asset file not found: ' . $chunk_asset_file );
                    continue;
                }
                $chunk_asset = include $chunk_asset_file;
                error_log( 'Phoenix Press: Enqueuing chunk JS: ' . self::$build_url . $path );
                wp_enqueue_script(
                    "phoenix-press-chunk-{$matches[1]}",
                    self::$build_url . $path,
                    $chunk_asset[ 'dependencies' ],
                    $chunk_asset[ 'version' ],
                    true
                );
            }
        }

        // Main CSS
        $main_css = self::find_asset_by_prefix( 'css' );
        if ( $main_css ) {
            $css_file = plugin_dir_path( dirname( __FILE__ ) ) . 'build/auto/' . $main_css;
            if ( !file_exists( $css_file ) ) {
                error_log( 'Phoenix Press: CSS file not found: ' . $css_file );
                return;
            }
            error_log( 'Phoenix Press: Enqueuing main CSS: ' . self::$build_url . $main_css );
            wp_enqueue_style(
                'phoenix-press-main-style',
                self::$build_url . $main_css,
                [],
                filemtime( $css_file )
            );
        } else {
            error_log( 'Phoenix Press: Main CSS file not found in manifest' );
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