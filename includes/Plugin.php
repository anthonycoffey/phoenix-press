<?php

namespace Phoenix\Press;

use Phoenix\Press\Meta;

/**
 * Main plugin class.
 */
class Plugin
{
  /**
   * Plugin version.
   */
  private $version = '1.0.7';

  /**
   * The single instance of the class.
   */
  protected static $_instance = null;

  /**
   * Main instance. Ensures only one instance is loaded or can be loaded'.
   */
  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }
    return self::$_instance;
  }

  /**
   * Cloning is forbidden.
   */
  public function __clone()
  {
    _doing_it_wrong(
      __FUNCTION__,
      esc_html__('Foul!', 'phoenix-press'),
      '1.0.0'
    );
  }

  /**
   * Unserializing instances of this class is forbidden.
   */
  public function __wakeup()
  {
    _doing_it_wrong(
      __FUNCTION__,
      esc_html__('Foul!', 'phoenix-press'),
      '1.0.0'
    );
  }

  /**
   * Construct
   */
  protected function __construct()
  {
    // Entry point.
    $this->initialize_plugin();
  }

  /**
   * Get Plugin URL
   */
  public function get_plugin_url()
  {
    return untrailingslashit(plugins_url('/', __DIR__));
  }

  /**
   * Get Plugin Path
   */
  public function get_plugin_path()
  {
    return untrailingslashit(plugin_dir_path(__DIR__));
  }

  /**
   * Get Plugin Basename
   */
  public function get_plugin_basename()
  {
    return plugin_basename(__DIR__);
  }

  /**
   * Get Plugin Version
   */
  public function get_plugin_version($base = false, $version = '')
  {
    $version = $version ? $version : $this->version;

    if ($base) {
      $version_parts = explode('-', $version);
      $version = count($version_parts) > 1 ? $version_parts[ 0 ] : $version;
    }

    return $version;
  }

  /**
   * Define constants
   */
  protected function maybe_define_constant($name, $value)
  {
    if (!defined($name)) {
      define($name, $value);
    }
  }

  /**
   * Indicates whether the plugin is fully initialized.
   */
  public function is_plugin_initialized()
  {
    return null !== $this->get_plugin_version();
  }

  /**
   * Initialize
   */
  public function initialize_plugin()
  {
    $this->define_constants();

    $this->includes();
  }

  /**
   * Constants.
   */
  public function define_constants()
  {
    $this->maybe_define_constant('PHOENIX_PRESS_VERSION', $this->version);
    $this->maybe_define_constant(
      'PHOENIX_PRESS_ABSPATH',
      trailingslashit(plugin_dir_path(__DIR__))
    );
  }

  /**
   * Includes.
   */
  public function includes()
  {
    Meta::init();
  }

  /**
   * Uninstall methods
   */
  public static function uninstall()
  {
    // Uninstall
  }
}
