<?php
/**
 * Render the Literati Example Carousel block
 */

$attributes = isset($attributes) ? $attributes : [];
$transition_time = isset( $attributes['transitionTime'] ) ? $attributes['transitionTime'] : 5;

$promotions = get_posts( array(
    'post_type' => 'promotion',
    'post_status' => 'publish',
    'numberposts' => -1,
) );

if ( empty( $promotions ) ) {
    echo '<p>' . esc_html__( 'No promotions found', 'literati-example-carousel' ) . '</p>';
    return;
}

$promotions_data = array_map(function($promotion) {
    return [
        'header' => get_post_meta($promotion->ID, '_promotion_header', true),
        'text' => get_post_meta($promotion->ID, '_promotion_text', true),
        'image' => get_post_meta($promotion->ID, '_promotion_image', true),
        'button' => get_post_meta($promotion->ID, '_promotion_button', true),
    ];
}, $promotions);

$promotions_json = wp_json_encode($promotions_data);
?>

<div class="wp-block-literati-example-carousel" data-transition-time="<?php echo esc_attr( $transition_time ); ?>" data-promotions="<?php echo esc_attr($promotions_json); ?>">
</div>