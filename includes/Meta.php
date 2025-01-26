<?php

namespace Phoenix\Press;

class Meta {
    public static function init() {
        add_action( 'wp_footer', [ __CLASS__, 'lead_form' ] );
        add_shortcode( 'phoenix_form', [ __CLASS__, 'lead_form_shortcode' ] );

        // Initialize other classes

    }

    public static function lead_form() {
        echo '<div id="phoenix-form-root"></div>';
    }

    public static function lead_form_shortcode( $attr ) {
        ob_start();
        echo '<div class="phoenix-form-embed-root"></div>';
        return ob_get_clean();
    }
}