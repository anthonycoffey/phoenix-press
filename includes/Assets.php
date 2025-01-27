<?php
namespace Phoenix\Press;

class Assets {
    private static $manifest;
    private static $build_url;
    private static $plugin_dir;

    public static function init() {
        self::$plugin_dir = rtrim(plugin_dir_path(dirname(__FILE__)), '/');
        self::$build_url = rtrim(plugins_url('build/', dirname(__FILE__)), '/');
        self::$manifest = self::load_manifest(self::$plugin_dir . '/build/auto/manifest.json');

        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_scripts']);
    }

    private static function load_manifest($manifest_path) {
        if (!file_exists($manifest_path)) {
            return [];
        }

        $manifest_content = file_get_contents($manifest_path);
        if ($manifest_content === false) {
            return [];
        }

        $manifest = json_decode($manifest_content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }

        return $manifest;
    }

    public static function enqueue_scripts() {
        if (empty(self::$manifest)) {
            return;
        }

        self::enqueue_external_scripts();
        self::enqueue_webpack_assets();
        self::localize_script_data();
    }

    private static function enqueue_external_scripts() {
        wp_enqueue_script(
            'turnstile-api',
            'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
            [],
            null,
            true
        );

        wp_enqueue_script(
            'mui-js',
            'https://cdn.jsdelivr.net/npm/@mui/material@5.16.1/umd/material-ui.development.js',
            ['wp-element'],
            '5.16.1',
            true
        );

        wp_enqueue_script(
            'emotion-react-js',
            'https://cdn.jsdelivr.net/npm/@emotion/react@11.13.3/dist/emotion-react.umd.min.js',
            ['wp-element'],
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
        $main_js = self::find_asset_by_prefix('main');
        if ($main_js) {
            $asset_file = self::$plugin_dir . '/build/' . str_replace('.js', '.asset.php', $main_js);
            if (file_exists($asset_file)) {
                $main_asset = require $asset_file;
                wp_enqueue_script(
                    'phoenix-press-main-js',
                    self::$build_url . '/' . $main_js,
                    $main_asset['dependencies'] ?? [],
                    $main_asset['version'] ?? '1.0',
                    true
                );
            }
        }

        foreach (self::$manifest as $file => $path) {
            if (preg_match('/^(\d+)\.js$/', $file, $matches)) {
                $js_path = self::$plugin_dir . '/build/' . $path;
                if (file_exists($js_path)) {
                    wp_enqueue_script(
                        "phoenix-press-chunk-{$matches[1]}",
                        self::$build_url . '/' . $path,
                        ['phoenix-press-main-js'],
                        filemtime($js_path),
                        true
                    );
                }
            }

            if (preg_match('/^(\d+)\.css$/', $file, $matches)) {
                $css_path = self::$plugin_dir . '/build/' . $path;
                if (file_exists($css_path)) {
                    $handle = "phoenix-press-chunk-{$matches[1]}-css";
                    wp_enqueue_style(
                        $handle,
                        self::$build_url . '/' . $path,
                        [],
                        filemtime($css_path)
                    );
                }
            }
        }
    }

    private static function find_asset_by_prefix($prefix) {
        if (!is_array(self::$manifest)) {
            return null;
        }
        foreach (self::$manifest as $file => $path) {
            if (strpos($file, $prefix) === 0) {
                return $path;
            }
        }
        return null;
    }

    private static function find_assets_by_pattern($pattern) {
        if (!is_array(self::$manifest)) {
            return [];
        }
        $matches = [];
        foreach (self::$manifest as $file => $path) {
            if (preg_match($pattern, $file)) {
                $matches[$file] = $path;
            }
        }
        return $matches;
    }

    private static function localize_script_data() {
        if (!wp_script_is('phoenix-press-main-js', 'enqueued')) {
            return;
        }

        $localized_data = [
            'NONCE' => wp_create_nonce('wp_rest'),
            'API_URL' => rest_url('phoenix-press/v1'),
            'ASSETS_URL' => plugins_url('assets', __DIR__),
            'GMAPS_API_KEY' => get_option('phoenix_gmaps_api_key', ''),
            'SMS_CONSENT_MESSAGE' => get_option('phoenix_sms_consent_message', ''),
            'DISCLAIMER_MESSAGE' => get_option('phoenix_disclaimer_message', ''),
            'SUBMISSION_MESSAGE' => get_option('phoenix_submission_message', ''),
            'TURNSTILE_SITE_KEY' => get_option('phoenix_turnstile_site_key', ''),
        ];

        wp_localize_script('phoenix-press-main-js', 'LOCALIZED', $localized_data);
    }

    public static function dequeue_scripts() {
        if (!is_array(self::$manifest)) {
            return;
        }

        wp_dequeue_script('phoenix-press-main-js');
        wp_deregister_script('phoenix-press-main-js');

        foreach (self::$manifest as $file => $path) {
            if (preg_match('/^(\d+)\.js$/', $file, $matches)) {
                $handle = "phoenix-press-chunk-{$matches[1]}";
                wp_dequeue_script($handle);
                wp_deregister_script($handle);
            }
            if (preg_match('/^(\d+)\.css$/', $file, $matches)) {
                $handle = "phoenix-press-style-{$matches[1]}";
                wp_dequeue_style($handle);
                wp_deregister_style($handle);
            }
        }

        wp_dequeue_script('turnstile-api');
        wp_deregister_script('turnstile-api');
    }
}