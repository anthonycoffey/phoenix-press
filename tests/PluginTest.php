<?php

namespace Phoenix\Press\Tests;

use Phoenix\Press\Plugin;
use Phoenix\Press\Meta;
use WP_Mock\Tools\TestCase as TestCase;
use WP_Mock;

final class PluginTest extends TestCase {
  public function setUp(): void {
    WP_Mock::setUp();

    /** Setup mocks */

    // Mock the register_post_type function
    WP_Mock::userFunction('register_post_type', [
    'return' => true,
    ]);

    // Mock the register_post_type function
    WP_Mock::userFunction('post_type_exists', [
    'return' => true,
    ]);

    WP_Mock::userFunction('get_option', [
      'return' => function ($key) {
        switch ($key) {
          case 'PHOENIX_PRESS_VERSION':
            return null;
        }
      },
    ]);

    WP_Mock::userFunction('remove_action', [
      'return' => true,
    ]);

    WP_Mock::userFunction('plugin_dir_path', [
      'return' => function ($dir) {
        return $dir . '/../';
      },
    ]);

    WP_Mock::userFunction('trailingslashit', [
      'return' => function ($path) {
        return rtrim($path, '/') . '/';
      },
    ]);
  }

  public function tearDown(): void {
    WP_Mock::tearDown();
  }

  public function test_happy() {
    $plugin = Plugin::instance();

    $this->assertSame($plugin->get_plugin_version(), '1.0.0');
    $this->assertSame($plugin->is_plugin_initialized(), true);
  }

  public function test_promotion_post_type_registration() {
    Meta::init();
    Meta::register_promotion_post_type();
    $this->assertTrue(post_type_exists('promotion'));
  }

}
