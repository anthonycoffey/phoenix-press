<?php
/*
 * Plugin Name: Phoenix Lead Form Plugin
 * Plugin URI: https://github.com/
 * Description:
 * Version: 1.0.0
 * Author: Anthony Coffey
 * Author URI: https://coffey.codes/
 *
 * Text Domain: phoenix-leads-plugin
 *
 */

use Phoenix\Leads\Plugin;

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

    phoenixLeads();
  },
  9
);

/**
 * Returns the main instance of the plugin to prevent the need to use globals.
 */
function phoenixLeads() {
  return Plugin::instance();
}
