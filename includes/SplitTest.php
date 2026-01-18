<?php

namespace Phoenix\Press;

class SplitTest {
    public static function init() {
        add_action('init', [__CLASS__, 'assign_variant']);
        add_shortcode('phoenix_split_test', [__CLASS__, 'render_shortcode']);
    }

    public static function assign_variant() {
        if (is_admin()) {
            return;
        }

        if (!isset($_COOKIE['phoenix_split_test_variant'])) {
            // Randomly assign A or B
            $variant = (rand(0, 1) === 0) ? 'A' : 'B';
            
            // Set cookie for 30 days
            setcookie(
                'phoenix_split_test_variant', 
                $variant, 
                time() + 30 * DAY_IN_SECONDS, 
                COOKIEPATH, 
                COOKIE_DOMAIN
            );
            
            // Make available for current request
            $_COOKIE['phoenix_split_test_variant'] = $variant;
        }
    }

    public static function render_shortcode($atts) {
        if (!get_option('phoenix_split_test_enabled')) {
            return '';
        }

        $variant = isset($_COOKIE['phoenix_split_test_variant']) ? $_COOKIE['phoenix_split_test_variant'] : 'A';
        
        // Sanitize variant
        if (!in_array($variant, ['A', 'B'])) {
             $variant = 'A';
        }

        $option_name = 'phoenix_split_test_variant_' . strtolower($variant);
        $shortcode = get_option($option_name);
        
        if (empty($shortcode)) {
            return "<!-- Phoenix Split Test Error: Variant $variant shortcode not configured -->";
        }

        $output = do_shortcode($shortcode);

        return sprintf(
            '<div class="phoenix-split-test-wrapper" data-split-test-variant="%s">%s</div>',
            esc_attr($variant),
            $output
        );
    }
}
