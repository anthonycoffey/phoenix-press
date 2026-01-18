<?php

namespace Phoenix\Press;

class SplitTest {
    private static $variant = null;

    public static function init() {
        add_action('init', [__CLASS__, 'assign_variant']);
        add_shortcode('phoenix_split_test', [__CLASS__, 'render_shortcode']);
    }

    public static function assign_variant() {
        if (is_admin()) {
            return;
        }

        // Randomly assign A or B for this request only
        self::$variant = (rand(0, 1) === 0) ? 'A' : 'B';
    }

    public static function render_shortcode($atts) {
        if (!get_option('phoenix_split_test_enabled')) {
            return '';
        }

        // Default to A if not set (e.g. if assign_variant didn't run for some reason)
        $variant = self::$variant ? self::$variant : 'A';
        
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
