<?php
/*
 * Plugin Name: PhoenixPress
 * Plugin URI: https://github.com/anthonycoffey/phoenix-press
 * Description: WordPress plugin for Phoenix CRM.
 * Version: 1.2.0
 * Author: Anthony Coffey
 * Author URI: https://coffey.codes/
 *
 * Text Domain: phoenix-press
 *
 */

use Phoenix\Press\Plugin;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
  exit();
}

add_action(
  'plugins_loaded',
  function () {
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
      include __DIR__ . '/vendor/autoload.php';
    }

    PHOENIX_PRESS();
  },
  9
);

/**
 * Returns the main instance of the plugin to prevent the need to use globals.
 */
function PHOENIX_PRESS() {
  return Plugin::instance();
}
