<?php

namespace Phoenix\Leads;

/**
 * Blocks class.
 */
class Blocks {
  /**
   * Init
   */
  public static function init() {
    add_action( 'init', [__CLASS__, 'register_blocks'] );
  }

  /**
   * Register the Blocks
   */
  public static function register_blocks() {
    // Register the Carousel
    register_block_type( phoenixLeads_ABSPATH. 'blocks/carousel/build' );
  }
}
