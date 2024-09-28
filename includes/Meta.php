<?php

namespace Phoenix\Leads;

/**
 * Meta class.
 */
class Meta {
  /**
   * Init
   */
  public static function init() {
    add_action('init', [__CLASS__, 'register_promotion_post_type']);
    add_action('rest_api_init', [__CLASS__,'register_promotion_meta_fields']);
    add_action('add_meta_boxes', [__CLASS__, 'add_promotion_meta_box']);
    add_action('save_post', [__CLASS__, 'save_promotion_meta']);
  }

  /**
   *  Register custom post type
   */
  public static function register_promotion_post_type() {
    $labels = array(
        'name' => __('Promotions'),
        'singular_name' => __('Promotion'),
    );
    $args = array(
        'labels' => $labels,
        'public' => true,
        'supports' => array('title'),
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-megaphone',
     
    );
    register_post_type('promotion', $args);
  }

  /**
   * Register meta fields
   */
  public static function register_promotion_meta_fields() {
    $fields = [
        '_promotion_header',
        '_promotion_text',
        '_promotion_button',
        '_promotion_image',
    ];

    foreach ($fields as $field) {
        register_rest_field(
            'promotion',
            $field,
            array(
                'get_callback' => function ($post) use ($field) {
                    return get_post_meta($post['id'], $field, true);
                },
                'update_callback' => null,
                'schema' => array(
                    'type' => 'string',
                    'context' => array('view', 'edit'),
                ),
            )
        );
    }
}



  /**
   *  Add meta box
   */
  public static function add_promotion_meta_box() {
    add_meta_box('promotion_meta', __('Promotion Details'), [__CLASS__,'render_promotion_meta_box'], 'promotion', 'normal', 'default');
  }

  /**
   *  Meta box markup
   */
  public static function render_promotion_meta_box($post) {
      $header = get_post_meta($post->ID, '_promotion_header', true);
      $text = get_post_meta($post->ID, '_promotion_text', true);
      $button = get_post_meta($post->ID, '_promotion_button', true);
      $selected_image = get_post_meta($post->ID, '_promotion_image', true);
      $args = array(
          'post_type' => 'attachment',
          'post_mime_type' => 'image',
          'post_status' => 'inherit',
          'posts_per_page' => -1,
      );
      $images = get_posts($args);

      wp_nonce_field('save_promotion_meta', 'promotion_meta_nonce');
      ?>
      <p>
          <label for="promotion_header"><?php _e('Header'); ?></label>
          <input type="text" name="promotion_header" id="promotion_header" value="<?php echo esc_attr($header); ?>" class="widefat">
      </p>
      <p>
          <label for="promotion_text"><?php _e('Text'); ?></label>
          <textarea name="promotion_text" id="promotion_text" class="widefat"><?php echo esc_textarea($text); ?></textarea>
      </p>

      <p>
          <label for="promotion_button"><?php _e('Button'); ?></label>
          <input type="url" name="promotion_button" id="promotion_button" value="<?php echo esc_attr($button); ?>" class="widefat">
      </p>
      <p>
        <label for="promotion_image"><?php _e('Select Image', 'phoenix-leads-plugin-carousel'); ?></label>
        <select name="promotion_image" id="promotion_image" class="widefat">
            <option value=""><?php _e('Select an image', 'phoenix-leads-plugin-carousel'); ?></option>
            <?php foreach ($images as $image) : ?>
                <option value="<?php echo esc_url($image->guid); ?>" <?php selected($selected_image, $image->guid); ?>>
                    <?php echo esc_html(get_the_title($image->ID)); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <div id="promotion_image_preview" style="margin-top: 10px;">
        <?php if ($selected_image) : ?>
            <img src="<?php echo esc_url($selected_image); ?>" alt="<?php echo esc_attr($header); ?>" style="max-width: 300px; height: auto;">
        <?php endif; ?>
    </div> 
    <script>
    jQuery(document).ready(function($) {
        $('#promotion_image').on('change', function() {
            const imageUrl = $(this).val();
            const preview = $('#promotion_image_preview');
            if (imageUrl) {
              preview.html(`<img src="${imageUrl}" alt="Promo Image Preview" style="max-width: 300px; height: auto;">`);
            } else {
                preview.html('');
            }
        });
    });
    </script>
    <?php
  }

  /**
   *  Save meta box data
   */
  public static function save_promotion_meta($post_id) {
      if (!isset($_POST['promotion_meta_nonce']) || !wp_verify_nonce($_POST['promotion_meta_nonce'], 'save_promotion_meta')) {
          return;
      }

      if (!current_user_can('edit_post', $post_id)) {
          return;
      }

      update_post_meta($post_id, '_promotion_header', sanitize_text_field($_POST['promotion_header']));
      update_post_meta($post_id, '_promotion_text', sanitize_textarea_field($_POST['promotion_text']));
      update_post_meta($post_id, '_promotion_button', esc_url_raw($_POST['promotion_button']));
      update_post_meta($post_id, '_promotion_image', esc_url_raw($_POST['promotion_image']));
  }
}
