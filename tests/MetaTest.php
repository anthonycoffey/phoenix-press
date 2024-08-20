<?php

namespace Literati\Example\Tests;

use Literati\Example\Meta;
use WP_Mock\Tools\TestCase as TestCase;
use WP_Mock;

final class MetaTest extends TestCase {
  public function setUp(): void {
    WP_Mock::setUp();

    /** Setup mocks */
    // Mock the register_post_type function
    WP_Mock::userFunction('register_post_type', [
      'return' => true,
    ]);

    // Mock the post_type_exists function
    WP_Mock::userFunction('post_type_exists', [
      'return' => true,
    ]);

    // Mock the register_rest_field function
    WP_Mock::userFunction('register_rest_field', [
      'return' => true,
    ]);

    // Mock the add_meta_box function
    WP_Mock::userFunction('add_meta_box', [
      'return' => true,
    ]);

    // Mock the add_action function
    WP_Mock::userFunction('add_action', [
      'return' => true,
    ]);

    // Mock the get_post_meta function
    WP_Mock::userFunction('get_post_meta', [
      'return' => 'mocked_meta_value',
    ]);

    // Mock the wp_nonce_field function
    WP_Mock::userFunction('wp_nonce_field', [
      'return' => true,
    ]);

    // Mock the update_post_meta function
    WP_Mock::userFunction('update_post_meta', [
      'return' => true,
    ]);

    // Mock the current_user_can function
    WP_Mock::userFunction('current_user_can', [
      'return' => true,
    ]);

    // Mock the wp_verify_nonce function
    WP_Mock::userFunction('wp_verify_nonce', [
      'return' => true,
    ]);

    // Mock the get_posts function
    WP_Mock::userFunction('get_posts', [
      'return' => [],
    ]);

    // Mock the get_the_title function
    WP_Mock::userFunction('get_the_title', [
      'return' => 'Mocked Title',
    ]);

    // Mock the sanitize_text_field function
    WP_Mock::userFunction('sanitize_text_field', [
      'return' => function($text) {
        return $text; // Simplified; in real usage, this would be a more complex sanitization
      },
    ]);

    // Mock the esc_attr function
    WP_Mock::userFunction('esc_attr', [
      'return' => function($text) {
        return $text;
      },
    ]);

    // Mock the esc_textarea function
    WP_Mock::userFunction('esc_textarea', [
      'return' => function($text) {
        return $text;
      },
    ]);

    // Mock the esc_url_raw function
    WP_Mock::userFunction('esc_url_raw', [
      'return' => function($url) {
        return $url;
      },
    ]);

    WP_Mock::userFunction('sanitize_textarea_field', [
      'return' => function($text) {
          return $text; // Simplified; should sanitize input in real usage
      },
    ]);

  }

  public function tearDown(): void {
    WP_Mock::tearDown();
  }

  public function test_promotion_post_type_registration() {
    Meta::init();
    Meta::register_promotion_post_type();
    $this->assertTrue(post_type_exists('promotion'));
  }

  public function test_register_promotion_meta_fields() {
    Meta::register_promotion_meta_fields();

    $fields = ['_promotion_header', '_promotion_text', '_promotion_button', '_promotion_image'];
    foreach ($fields as $field) {
        $this->assertNotFalse(register_rest_field('promotion', $field));
    }
  }

  public function test_add_promotion_meta_box() {
    Meta::add_promotion_meta_box();
    $this->assertTrue(add_meta_box('promotion_meta', __('Promotion Details'), [Meta::class, 'render_promotion_meta_box'], 'promotion', 'normal', 'default'));
  }

  public function test_render_promotion_meta_box() {
    $post = (object) ['ID' => 1];
    ob_start();
    Meta::render_promotion_meta_box($post);
    $output = ob_get_clean();

    $this->assertStringContainsString('promotion_header', $output);
    $this->assertStringContainsString('promotion_text', $output);
    $this->assertStringContainsString('promotion_button', $output);
    $this->assertStringContainsString('promotion_image', $output);
  }

  public function test_save_promotion_meta() {
    $post_id = 1;

    $_POST['promotion_meta_nonce'] = 'nonce';
    $_POST['promotion_header'] = 'Test Header';
    $_POST['promotion_text'] = 'Test Text';
    $_POST['promotion_button'] = 'https://example.com';
    $_POST['promotion_image'] = 'https://example.com/image.jpg';

    Meta::save_promotion_meta($post_id);

    $this->assertTrue(update_post_meta($post_id, '_promotion_header', 'Test Header'));
    $this->assertTrue(update_post_meta($post_id, '_promotion_text', 'Test Text'));
    $this->assertTrue(update_post_meta($post_id, '_promotion_button', 'https://example.com'));
    $this->assertTrue(update_post_meta($post_id, '_promotion_image', 'https://example.com/image.jpg'));
  }
}

