<?php

namespace Phoenix\Press;

class Settings {
    public static function init() {
        add_action( 'admin_menu', [ __CLASS__, 'add_settings_page' ] );
        add_action( 'admin_init', [ __CLASS__, 'register_settings' ] );
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
        settings_fields( 'phoenix_press_options' );
        do_settings_sections( 'phoenix-press' );
        submit_button();
        echo '</form>';
        echo '</div>';
    }

    public static function register_settings()
 {
        $settings = [
            'phoenix_form_title' => [
                'label' => 'Form Title',
                'type' => 'text',
            ],
            'phoenix_form_subtitle' => [
                'label' => 'Form Subtitle',
                'type' => 'text',
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

    public static function render_field( $args )
 {
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
        }
    }
}

