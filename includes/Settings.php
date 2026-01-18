<?php

namespace Phoenix\Press;

use Phoenix\Press\Database;

class Settings {
    public static function init() {
        add_action( 'admin_menu', [ __CLASS__, 'add_settings_page' ] );
        add_action( 'admin_init', [ __CLASS__, 'register_settings' ] );
        add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_media_library' ] );

        if ( isset( $_POST['phoenix_reset_stats'] ) && check_admin_referer( 'phoenix_reset_stats_action', 'phoenix_reset_stats_nonce' ) ) {
            Database::reset_stats();
            add_action('admin_notices', function() {
                echo '<div class="notice notice-success is-dismissible"><p>Split test statistics reset.</p></div>';
            });
        }
    }

    public static function enqueue_media_library( $hook ) {
        if ( $hook === 'settings_page_phoenix-press' ) {
            wp_enqueue_media();
        }
    }

    public static function add_settings_page() {
        add_options_page(
            'Phoenix Press Settings',
            'Phoenix Press',
            'manage_options',
            'phoenix-press',
            [ __CLASS__, 'render_settings_page' ]
        );
    }

    public static function render_settings_page() {
        echo '<div class="wrap">';
        echo '<h1>Phoenix Press Settings</h1>';
        echo '<form method="post" action="options.php">';
        settings_fields( 'phoenix_press_options' );
        do_settings_sections( 'phoenix-press' );
        submit_button();
        echo '</form>';
        
        // Render Stats
        if ( get_option( 'phoenix_split_test_enabled' ) ) {
            echo '<h2>Split Test Statistics</h2>';
            $stats = Database::get_stats();
            
            echo '<table class="widefat fixed" cellspacing="0">';
            echo '<thead><tr><th>Variant</th><th>Views</th><th>Starts</th><th>Submissions</th><th>Conversion Rate</th></tr></thead>';
            echo '<tbody>';
            
            $variants = array_unique(array_merge(['A', 'B'], array_keys($stats)));
            sort($variants);
            
            foreach ($variants as $variant) {
                $data = isset($stats[$variant]) ? $stats[$variant] : ['view' => 0, 'start' => 0, 'submission' => 0];
                $views = $data['view'] ?? 0;
                $submissions = $data['submission'] ?? 0;
                $rate = $views > 0 ? round(($submissions / $views) * 100, 2) . '%' : '0%';
                
                echo "<tr>";
                echo "<td>Variant $variant</td>";
                echo "<td>$views</td>";
                echo "<td>{$data['start']}</td>";
                echo "<td>$submissions</td>";
                echo "<td>$rate</td>";
                echo "</tr>";
            }
            
            echo '</tbody></table>';
            
            echo '<form method="post" style="margin-top: 20px;">';
            wp_nonce_field( 'phoenix_reset_stats_action', 'phoenix_reset_stats_nonce' );
            echo '<input type="hidden" name="phoenix_reset_stats" value="1">';
            submit_button( 'Reset Statistics', 'secondary', 'submit', false );
            echo '</form>';
        }

        echo '</div>';

        self::render_media_library_script();
    }

    public static function register_settings() {
        $settings = [
            'phoenix_form_title' => [
                'label' => 'Form Title',
                'type' => 'text',
            ],
            'phoenix_form_subtitle' => [
                'label' => 'Form Subtitle',
                'type' => 'text',
            ],
            'phoenix_form_avatar' => [
                'label' => 'Chat Avatar',
                'type' => 'image',
            ],
            'phoenix_api_url' => [
                'label' => 'Phoenix API Base URL',
                'type' => 'text',
            ],
            'phoenix_turnstile_site_key' => [
                'label' => 'Turnstile Site Key',
                'type' => 'text',
            ],
            'phoenix_turnstile_secret_key' => [
                'label' => 'Turnstile Secret Key',
                'type' => 'text',
            ],
            'phoenix_gmaps_api_key' => [
                'label' => 'Google Maps API Key',
                'type' => 'text',
            ],
            'phoenix_sms_consent_message' => [
                'label' => 'SMS Consent Message',
                'type' => 'textarea',
            ],
            'phoenix_disclaimer_message' => [
                'label' => 'Disclaimer Message',
                'type' => 'textarea',
            ],
            'phoenix_submission_message' => [
                'label' => 'Submission Confirmation Message',
                'type' => 'textarea',
            ],
            'phoenix_split_test_enabled' => [
                'label' => 'Enable Split Testing',
                'type' => 'checkbox',
            ],
            'phoenix_split_test_variant_a' => [
                'label' => 'Variant A Shortcode',
                'type' => 'text',
            ],
            'phoenix_split_test_variant_b' => [
                'label' => 'Variant B Shortcode',
                'type' => 'text',
            ],
            'phoenix_auth_net_api_login_id' => [
                'label' => 'Authorize.Net API Login ID',
                'type' => 'text',
            ],
            'phoenix_auth_net_client_key' => [
                'label' => 'Authorize.Net Client Key',
                'type' => 'text',
            ],
            'phoenix_auth_net_test_mode' => [
                'label' => 'Authorize.Net Test Mode',
                'type' => 'checkbox',
            ],
        ];

        foreach ( $settings as $key => $setting ) {
            register_setting( 'phoenix_press_options', $key );
            add_settings_section(
                'phoenix_press_section',
                '',
                null,
                'phoenix-press'
            );
            add_settings_field(
                $key,
                $setting[ 'label' ],
                [ __CLASS__, 'render_field' ],
                'phoenix-press',
                'phoenix_press_section',
                [
                    'name' => $key,
                    'type' => $setting[ 'type' ],
                ]
            );
        }
    }

    public static function render_field( $args ) {
        $name = $args[ 'name' ];
        $type = $args[ 'type' ];
        $value = get_option( $name );

        if ( $type === 'text' ) {
            echo "<input type='text' name='$name' value='" .
            esc_attr( $value ) .
            "' />";
        } elseif ( $type === 'textarea' ) {
            echo "<textarea name='$name'>" .
            esc_textarea( $value ) .
            '</textarea>';
        } elseif ( $type === 'checkbox' ) {
            echo "<input type='checkbox' name='$name' value='1' " .
            checked( 1, $value, false ) .
            " />";
        } elseif ( $type === 'image' ) {
            echo '<div class="image-upload-wrapper">';
            echo '<input type="hidden" name="' . esc_attr( $name ) . '" id="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '" />';
            echo '<img src="' . esc_url( $value ) . '" id="' . esc_attr( $name ) . '_preview" style="max-width: 100px; height: auto; display: ' . ( $value ? 'block' : 'none' ) . ';" />';
            echo '<input type="button" class="button button-secondary" value="Upload Image" id="' . esc_attr( $name ) . '_button" />';
            echo '<input type="button" class="button button-secondary" value="Remove Image" id="' . esc_attr( $name ) . '_remove" style="display: ' . ( $value ? 'block' : 'none' ) . ';" />';
            echo '</div>';
        }
    }

    public static function render_media_library_script() {
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                $('[id$="_button"]').click(function(e) {
                    e.preventDefault();

                    var button = $(this);
                    var name = button.attr('id').replace('_button', '');
                    var input = $('#' + name);
                    var preview = $('#' + name + '_preview');
                    var removeButton = $('#' + name + '_remove');

                    var frame = wp.media({
                        title: 'Select or Upload Image',
                        button: {
                            text: 'Use this image'
                        },
                        multiple: false
                    });

                    frame.on('select', function() {
                        var attachment = frame.state().get('selection').first().toJSON();
                        input.val(attachment.url);
                        preview.attr('src', attachment.url).show();
                        removeButton.show();
                    });

                    frame.open();
                });

                $('[id$="_remove"]').click(function(e) {
                    e.preventDefault();

                    var button = $(this);
                    var name = button.attr('id').replace('_remove', '');
                    var input = $('#' + name);
                    var preview = $('#' + name + '_preview');

                    input.val('');
                    preview.hide();
                    button.hide();
                });
            });
        </script>
        <?php
    }
}
