<?php

namespace Phoenix\Press;

class Meta {
    public static function init() {
        add_action( 'wp_footer', [ __CLASS__, 'lead_form' ] );
        add_shortcode( 'phoenix_form', [ __CLASS__, 'lead_form_shortcode' ] );
        add_shortcode('phoenix_form_success', [__CLASS__, 'success_message_shortcode']);
        add_shortcode( 'phoenix_stepper_form', [ __CLASS__, 'stepper_form_shortcode' ] );
    }

    public static function lead_form() {
        echo '<div id="phoenix-form-root"></div>';
    }

    public static function lead_form_shortcode( $attr ) {
        ob_start();
        echo '<div class="phoenix-form-embed-root"></div>';
        return ob_get_clean();
    }

    public static function stepper_form_shortcode( $attr ) {
        ob_start();
        echo '<div id="phoenix-stepper-form-root"></div>';
        return ob_get_clean();
    }


    public static function success_message_shortcode( $attr ) {
        $name = isset( $_GET['full_name'] ) ? sanitize_text_field( $_GET['full_name'] ) : '';
        $submission_message = get_option('phoenix_submission_message', '');
        ob_start();
        if ( $name ) {
            echo '<p>Thanks for your submission, ' . esc_html( $name ) . '!</p>';
        }
        echo '<p>' . wp_kses_post($submission_message) . '</p>';
        return ob_get_clean();
    }

}
