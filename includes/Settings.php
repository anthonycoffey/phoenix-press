<?php
  namespace Phoenix\Press;

  use Phoenix\Press\Database;

  class Settings {
  public static function init() {
    add_action( 'admin_menu', array( __CLASS__, 'add_admin_menus' ) );
    add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
    add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_admin_assets' ) );

    if ( isset( $_POST[ 'phoenix_reset_stats' ] ) && check_admin_referer( 'phoenix_reset_stats_action', 'phoenix_reset_stats_nonce' ) ) {
      Database::reset_stats();
      add_action( 'admin_notices', function () {
        echo '<div class="notice notice-success is-dismissible"><p>Split test statistics reset.</p></div>';
      } );
    }
  }

  public static function enqueue_admin_assets( $hook ) {
    // Log the hook to identify the correct page ID
    error_log( 'Phoenix Press Admin Hook: ' . $hook );

    if ( 'toplevel_page_phoenix-press' === $hook ) {
      wp_enqueue_media();
    }
  }

  public static function add_admin_menus() {
    add_menu_page(
      'PhoenixPress',
      'PhoenixPress',
      'manage_options',
      'phoenix-press',
      array( __CLASS__, 'render_settings_page' ),
      'dashicons-chart-bar',
      58
    );

    add_submenu_page(
      'phoenix-press',
      'Settings',
      'Settings',
      'manage_options',
      'phoenix-press',
      array( __CLASS__, 'render_settings_page' )
    );

    add_submenu_page(
      'phoenix-press',
      'Analytics',
      'Analytics',
      'manage_options',
      'phoenix-press-analytics',
      array( __CLASS__, 'render_analytics_page' )
    );
  }

  public static function render_settings_page() {
    $active_tab = isset( $_GET[ 'tab' ] ) ? $_GET[ 'tab' ] : 'api_settings';

    echo '<div class="wrap">';
    echo '<h1>PhoenixPress Settings</h1>';

    // Tabs
    echo '<h2 class="nav-tab-wrapper">';
    echo '<a href="?page=phoenix-press&tab=api_settings" class="nav-tab ' . ( 'api_settings' == $active_tab ? 'nav-tab-active' : '' ) . '">API Settings</a>';
    echo '<a href="?page=phoenix-press&tab=form_settings" class="nav-tab ' . ( 'form_settings' == $active_tab ? 'nav-tab-active' : '' ) . '">Form Settings</a>';
    echo '<a href="?page=phoenix-press&tab=ab_testing" class="nav-tab ' . ( 'ab_testing' == $active_tab ? 'nav-tab-active' : '' ) . '">A/B Testing</a>';
    echo '</h2>';

    // Custom CSS
    echo '<style>
            .phoenix-settings-card {
                background: #fff;
                border: 1px solid #ccd0d4;
                padding: 20px 30px;
                border-radius: 4px;
                box-shadow: 0 1px 1px rgba(0,0,0,.04);
                max-width: 1000px;
                margin-top: 20px;
            }
            .phoenix-settings-card h2 {
                border-bottom: 1px solid #eee;
                padding-bottom: 15px;
                margin-bottom: 20px;
                font-size: 1.3em;
                color: #23282d;
            }
            .phoenix-settings-card .form-table th {
                width: 200px;
                font-weight: 600;
            }
            .phoenix-settings-card input[type="text"],
            .phoenix-settings-card textarea {
                width: 100%;
                max-width: 600px;
                padding: 8px;
            }
            .phoenix-settings-card .image-upload-wrapper img {
                margin: 10px 0;
                border: 1px solid #ddd;
                padding: 4px;
                border-radius: 3px;
            }
            .phoenix-settings-card .submit {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
        </style>';

    echo '<div class="phoenix-settings-card">';
    echo '<form method="post" action="options.php">';

    $option_group = 'phoenix_press_api_options';

    if ( 'form_settings' == $active_tab ) {
      $option_group = 'phoenix_press_form_options';
    } elseif ( 'ab_testing' == $active_tab ) {
      $option_group = 'phoenix_press_ab_options';
    }

    settings_fields( $option_group );

  // Render section based on active tab
    if ( 'api_settings' == $active_tab ) {
      do_settings_sections( 'phoenix-press-api_settings' );
    } elseif ( 'form_settings' == $active_tab ) {
      do_settings_sections( 'phoenix-press-form_settings' );
    } elseif ( 'ab_testing' == $active_tab ) {
      do_settings_sections( 'phoenix-press-ab_testing' );
    }

  // Hidden input to preserve tab on save redirect (requires JS or hook to work fully,

  // but WP redirects back to referrer usually. To be safe, we might need a filter on redirect_location)

  // For standard options.php, it redirects to options-general.php?updated=true or similar.
    // We rely on the referrer containing the tab param.

    submit_button();
    echo '</form>';
    echo '</div>';

    echo '</div>';

    self::render_media_library_script();
  }

  public static function render_analytics_page() {
    echo '<div class="wrap">';
    echo '<h1>PhoenixPress Analytics</h1>';

    if ( get_option( 'phoenix_split_test_enabled' ) ) {
      $stats = Database::get_stats();

      $conversational_stats = isset( $stats[ 'conversational' ] ) ? $stats[ 'conversational' ] : null;

      if ( isset( $stats[ 'conversational' ] ) ) {
        unset( $stats[ 'conversational' ] );
      }

      echo '<style>
                .phoenix-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
                .phoenix-stats-card { background: #fff; border: 1px solid #ccd0d4; padding: 20px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.04); text-align: center; }
                .phoenix-stats-card h3 { margin: 0 0 10px; font-size: 13px; color: #646970; text-transform: uppercase; font-weight: 600; }
                .phoenix-stats-card .number { font-size: 32px; font-weight: 700; color: #1d2327; line-height: 1; }
                .phoenix-chart-container { background: #fff; border: 1px solid #ccd0d4; padding: 20px; border-radius: 4px; margin-bottom: 20px; box-shadow: 0 1px 1px rgba(0,0,0,.04); }
                .phoenix-info-box { background: #fff; border-left: 4px solid #72aee6; padding: 1px 16px; margin: 20px 0; box-shadow: 0 1px 1px rgba(0,0,0,.04); }
            </style>';

      echo '<div class="phoenix-info-box">';
      echo '<h3>About Split Testing</h3>';
      echo '<p>Split testing allows you to compare two versions of your form (Variant A and Variant B) to see which one performs better. Visitors are randomly assigned a variant on <strong>each page load</strong> (no cookies used).</p>';
      echo '<p>We track <strong style="color:darkblue;">Views</strong> (form loads), <strong  style="color:darkblue;">Starts</strong> (first interaction), and <strong  style="color:darkblue;">Submissions</strong> (completed forms) to calculate the <strong  style="color:darkblue;">Conversion Rate</strong>.</p>';
      echo '</div>';

      echo '<h2>A/B Split Test Performance</h2>';

      $ab_views       = 0;
      $ab_submissions = 0;
      $ab_starts      = 0;
      $variants       = array_keys( $stats );
      sort( $variants );

      $chart_categories  = array();
      $chart_rates       = array();
      $chart_views       = array();
      $chart_starts      = array();
      $chart_submissions = array();

      foreach ( $stats as $variant => $data ) {
        $v_views  = $data[ 'view' ] ?? 0;
        $v_starts = $data[ 'start' ] ?? 0;
        $v_subs   = $data[ 'submission' ] ?? 0;

        $ab_views       += $v_views;
        $ab_starts      += $v_starts;
        $ab_submissions += $v_subs;

        $rate = $v_views > 0 ? round( ( $v_subs / $v_views ) * 100, 2 ) : 0;

        $chart_categories[  ]  = "Variant $variant";
        $chart_rates[  ]       = $rate;
        $chart_views[  ]       = $v_views;
        $chart_starts[  ]      = $v_starts;
        $chart_submissions[  ] = $v_subs;
      }

      $ab_rate = $ab_views > 0 ? round( ( $ab_submissions / $ab_views ) * 100, 2 ) . '%' : '0%';

      echo '<div class="phoenix-stats-grid">';
      echo '<div class="phoenix-stats-card"><h3>Total Views</h3><div class="number">' . number_format( $ab_views ) . '</div></div>';
      echo '<div class="phoenix-stats-card"><h3>Total Submissions</h3><div class="number">' . number_format( $ab_submissions ) . '</div></div>';
      echo '<div class="phoenix-stats-card"><h3>Avg. Conversion Rate</h3><div class="number">' . $ab_rate . '</div></div>';
      echo '</div>';

      echo '<div class="phoenix-stats-grid" style="grid-template-columns: 1fr 1fr;">';
      echo '<div class="phoenix-chart-container"><div id="chart-ab-rates" style="height: 300px;"></div></div>';
      echo '<div class="phoenix-chart-container"><div id="chart-ab-volume" style="height: 300px;"></div></div>';
      echo '</div>';

      echo '<table class="widefat fixed" cellspacing="0" style="margin-bottom: 40px;">';
      echo '<thead><tr><th>Variant</th><th>Views</th><th>Starts</th><th>Submissions</th><th>Conversion Rate</th></tr></thead>';
      echo '<tbody>';

      foreach ( $variants as $variant ) {
        $data        = $stats[ $variant ];
        $views       = $data[ 'view' ] ?? 0;
        $submissions = $data[ 'submission' ] ?? 0;
        $rate        = $views > 0 ? round( ( $submissions / $views ) * 100, 2 ) . '%' : '0%';

        echo "<tr>";
        echo "<td>Variant $variant</td>";
        echo "<td>$views</td>";
        echo "<td>{$data[ 'start' ]}</td>";
        echo "<td>$submissions</td>";
        echo "<td>$rate</td>";
        echo "</tr>";
      }

      echo '</tbody></table>';

      if ( $conversational_stats || true ) {
        echo '<hr style="margin: 30px 0;">';
        echo '<h2>Conversational Form Performance</h2>';

        $c_views  = $conversational_stats[ 'view' ] ?? 0;
        $c_starts = $conversational_stats[ 'start' ] ?? 0;
        $c_subs   = $conversational_stats[ 'submission' ] ?? 0;
        $c_rate   = $c_views > 0 ? round( ( $c_subs / $c_views ) * 100, 2 ) . '%' : '0%';

        echo '<div class="phoenix-stats-grid">';
        echo '<div class="phoenix-stats-card"><h3>Views</h3><div class="number">' . number_format( $c_views ) . '</div></div>';
        echo '<div class="phoenix-stats-card"><h3>Submissions</h3><div class="number">' . number_format( $c_subs ) . '</div></div>';
        echo '<div class="phoenix-stats-card"><h3>Conversion Rate</h3><div class="number">' . $c_rate . '</div></div>';
        echo '</div>';

        echo '<div class="phoenix-chart-container"><div id="chart-conv-funnel" style="height: 300px;"></div></div>';

        echo '<table class="widefat fixed" cellspacing="0">';
        echo '<thead><tr><th>Type</th><th>Views</th><th>Starts</th><th>Submissions</th><th>Conversion Rate</th></tr></thead>';
        echo '<tbody>';
        echo "<tr>";
        echo "<td>Conversational Form</td>";
        echo "<td>$c_views</td>";
        echo "<td>$c_starts</td>";
        echo "<td>$c_subs</td>";
        echo "<td>$c_rate</td>";
        echo "</tr>";
        echo '</tbody></table>';
      }

      $highcharts_init_script = "
            document.addEventListener('DOMContentLoaded', function() {
                Highcharts.chart('chart-ab-rates', {
                    chart: { type: 'column' },
                    title: { text: 'Conversion Rate Comparison' },
                    xAxis: { categories: " . json_encode( $chart_categories ) . " },
                    yAxis: { min: 0, title: { text: 'Percentage (%)' } },
                    tooltip: { valueSuffix: '%' },
                    series: [{
                        name: 'Conversion Rate',
                        data: " . json_encode( $chart_rates ) . ",
                        colorByPoint: true,
                        colors: ['#7cb5ec', '#90ed7d']
                    }],
                    legend: { enabled: false },
                    credits: { enabled: false }
                });

                Highcharts.chart('chart-ab-volume', {
                    chart: { type: 'column' },
                    title: { text: 'Engagement Volume' },
                    xAxis: { categories: " . json_encode( $chart_categories ) . " },
                    yAxis: { min: 0, title: { text: 'Count' } },
                    series: [{
                        name: 'Views',
                        data: " . json_encode( $chart_views ) . "
                    }, {
                        name: 'Starts',
                        data: " . json_encode( $chart_starts ) . "
                    }, {
                        name: 'Submissions',
                        data: " . json_encode( $chart_submissions ) . "
                    }],
                    credits: { enabled: false }
                });

                Highcharts.chart('chart-conv-funnel', {
                    chart: { type: 'column' },
                    title: { text: 'Conversational Form Funnel' },
                    xAxis: { categories: ['Views', 'Starts', 'Submissions'] },
                    yAxis: { min: 0, title: { text: 'Count' } },
                    series: [{
                        name: 'Volume',
                        data: [" . $c_views . ", " . $c_starts . ", " . $c_subs . "],
                        color: '#f7a35c'
                    }],
                    legend: { enabled: false },
                    credits: { enabled: false }
                });
            });";

      wp_enqueue_script( 'highcharts', 'https://code.highcharts.com/highcharts.js', array(), null, true );
      wp_add_inline_script( 'highcharts', $highcharts_init_script );

      echo '<form method="post" style="margin-top: 20px;">';
      wp_nonce_field( 'phoenix_reset_stats_action', 'phoenix_reset_stats_nonce' );
      echo '<input type="hidden" name="phoenix_reset_stats" value="1">';
      submit_button( 'Reset Statistics', 'secondary', 'submit', false );
      echo '</form>';
    } else {
      echo '<div class="notice notice-warning inline"><p>Split testing is currently disabled. Please enable it in the <a href="admin.php?page=phoenix-press">Settings</a> page to view analytics.</p></div>';
    }

    echo '</div>';
  }

  public static function register_settings() {
    // API Settings
    add_settings_section( 'phoenix_press_api_section', 'API Settings', null, 'phoenix-press-api_settings' );

    $api_settings = array(
      'phoenix_api_url'               => array( 'label' => 'Phoenix API Base URL', 'type' => 'text' ),
      'phoenix_gmaps_api_key'         => array( 'label' => 'Google Maps API Key', 'type' => 'text' ),
      'phoenix_turnstile_site_key'    => array( 'label' => 'Turnstile Site Key', 'type' => 'text' ),
      'phoenix_turnstile_secret_key'  => array( 'label' => 'Turnstile Secret Key', 'type' => 'text' ),
      'phoenix_auth_net_api_login_id' => array( 'label' => 'Authorize.Net API Login ID', 'type' => 'text' ),
      'phoenix_auth_net_client_key'   => array( 'label' => 'Authorize.Net Client Key', 'type' => 'text' ),
      'phoenix_auth_net_test_mode'    => array( 'label' => 'Authorize.Net Test Mode', 'type' => 'checkbox' ),
    );
    self::register_fields( $api_settings, 'phoenix-press-api_settings', 'phoenix_press_api_section', 'phoenix_press_api_options' );

    // Form Settings
    add_settings_section( 'phoenix_press_form_section', 'Form Display Settings', null, 'phoenix-press-form_settings' );

    $form_settings = array(
      'phoenix_form_title'          => array( 'label' => 'Form Title', 'type' => 'text' ),
      'phoenix_form_subtitle'       => array( 'label' => 'Form Subtitle', 'type' => 'text' ),
      'phoenix_form_avatar'         => array( 'label' => 'Chat Avatar', 'type' => 'image' ),
      'phoenix_sms_consent_message' => array( 'label' => 'SMS Consent Message', 'type' => 'textarea' ),
      'phoenix_disclaimer_message'  => array( 'label' => 'Disclaimer Message', 'type' => 'textarea' ),
      'phoenix_submission_message'  => array( 'label' => 'Submission Confirmation Message', 'type' => 'textarea' ),
    );
    self::register_fields( $form_settings, 'phoenix-press-form_settings', 'phoenix_press_form_section', 'phoenix_press_form_options' );

    // A/B Testing Settings
    add_settings_section( 'phoenix_press_ab_section', 'A/B Testing Configuration', null, 'phoenix-press-ab_testing' );

    $ab_settings = array(
      'phoenix_split_test_enabled'   => array( 'label' => 'Enable Split Testing', 'type' => 'checkbox' ),
      'phoenix_split_test_variant_a' => array( 'label' => 'Variant A Shortcode', 'type' => 'text' ),
      'phoenix_split_test_variant_b' => array( 'label' => 'Variant B Shortcode', 'type' => 'text' ),
    );
    self::register_fields( $ab_settings, 'phoenix-press-ab_testing', 'phoenix_press_ab_section', 'phoenix_press_ab_options' );
  }

  private static function register_fields( $fields, $page, $section, $option_group ) {

    foreach ( $fields as $key => $setting ) {
      register_setting( $option_group, $key );
      add_settings_field(
        $key,
        $setting[ 'label' ],
        array( __CLASS__, 'render_field' ),
        $page,
        $section,
        array(
          'name' => $key,
          'type' => $setting[ 'type' ],
        )
      );
    }
  }

  public static function render_field( $args ) {
    $name  = $args[ 'name' ];
    $type  = $args[ 'type' ];
    $value = get_option( $name );

    if ( 'text' === $type ) {
      echo "<input type='text' name='$name' value='" .
      esc_attr( $value ) .
        "' />";
    } elseif ( 'textarea' === $type ) {
      echo "<textarea name='$name'>" .
      esc_textarea( $value ) .
        '</textarea>';
    } elseif ( 'checkbox' === $type ) {
      echo "<input type='checkbox' name='$name' value='1' " .
      checked( 1, $value, false ) .
        " />";
    } elseif ( 'image' === $type ) {
      echo '<div class="image-upload-wrapper">';
      echo '<input type="hidden" name="' . esc_attr( $name ) . '" id="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '" />';
      echo '<img src="' . esc_url( $value ) . '" id="' . esc_attr( $name ) . '_preview" style="max-width: 100px; height: auto; display: ' . ( $value ? 'block' : 'none' ) . ';" />';
      echo '<input type="button" class="button button-secondary" value="Upload Image" id="' . esc_attr( $name ) . '_button" />';
      echo '<input type="button" class="button button-secondary" value="Remove Image" id="' . esc_attr( $name ) . '_remove" style="display: ' . ( $value ? 'block' : 'none' ) . ';" />';
      echo '</div>';
    }
  }

  public static function render_media_library_script() {
    ?>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                // Preserve tab on save
                if (window.location.search.indexOf('settings-updated=true') > -1) {
                     // We rely on referrer or just let it default to first tab if we can't persist.
                     // The simplest way without complex JS is to check referrer in PHP, but WP redirect makes that hard.
                     // Alternatively, we can use JS to check a cookie or local storage, but for now we'll stick to URL params.
                     // If the user clicks a tab, the URL changes. When they save, WP posts to options.php and redirects back.
                     // By default it redirects to the page slug.
                     // We can use the 'wp_redirect' filter if we really need to force the tab param back.
                }

                $('[id$="_button"]').click(function(e) {
                    e.preventDefault();

                    var button = $(this);
                    var name = button.attr('id').replace('_button', '');
                    var input = $('#' + name);
                    var preview = $('#' + name + '_preview');
                    var removeButton = $('#' + name + '_remove');

                    var frame = wp.media({
                        title: 'Select or Upload Image',
                        button: {
                            text: 'Use this image'
                        },
                        multiple: false
                    });

                    frame.on('select', function() {
                        var attachment = frame.state().get('selection').first().toJSON();
                        input.val(attachment.url);
                        preview.attr('src', attachment.url).show();
                        removeButton.show();
                    });

                    frame.open();
                });

                $('[id$="_remove"]').click(function(e) {
                    e.preventDefault();

                    var button = $(this);
                    var name = button.attr('id').replace('_remove', '');
                    var input = $('#' + name);
                    var preview = $('#' + name + '_preview');

                    input.val('');
                    preview.hide();
                    button.hide();
                });
            });
        </script>
        <?php
          }
          }
