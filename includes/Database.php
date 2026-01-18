<?php

namespace Phoenix\Press;

class Database {

    private static $table_name;

    public static function init() {
        global $wpdb;
        self::$table_name = $wpdb->prefix . 'phoenix_split_tests';
        
        // We might want to hook this to plugin activation, but running on init/admin_init check is safer for development
        // For production, this should ideally be on activation or update hook.
        // For this task, I'll add a check if table exists to avoid running dbDelta every time.
        self::maybe_create_table();
    }

    public static function maybe_create_table() {
        global $wpdb;
        
        if ( $wpdb->get_var( "SHOW TABLES LIKE '" . self::$table_name . "'" ) != self::$table_name ) {
            self::create_table();
        }
    }

    public static function create_table() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE " . self::$table_name . " (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
            variant varchar(10) NOT NULL,
            event_type varchar(20) NOT NULL,
            device_type varchar(20) DEFAULT 'desktop',
            PRIMARY KEY  (id),
            KEY variant (variant),
            KEY event_type (event_type)
        ) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        \dbDelta( $sql );
    }

    public static function record_event( $variant, $event_type, $device_type = 'desktop' ) {
        global $wpdb;

        $wpdb->insert(
            self::$table_name,
            [
                'time' => \current_time( 'mysql' ),
                'variant' => \sanitize_text_field( $variant ),
                'event_type' => \sanitize_text_field( $event_type ),
                'device_type' => \sanitize_text_field( $device_type ),
            ]
        );
    }

    public static function get_stats() {
        global $wpdb;
        
        // Aggregate stats by variant and event_type
        // We want: Variant A -> Views: X, Starts: Y, Submissions: Z
        $results = $wpdb->get_results( "
            SELECT variant, event_type, COUNT(*) as count
            FROM " . self::$table_name . "
            GROUP BY variant, event_type
        " );

        $stats = [];
        
        foreach ( $results as $row ) {
            if ( ! isset( $stats[ $row->variant ] ) ) {
                $stats[ $row->variant ] = [
                    'view' => 0,
                    'start' => 0,
                    'submission' => 0
                ];
            }
            $stats[ $row->variant ][ $row->event_type ] = (int) $row->count;
        }

        return $stats;
    }

    public static function reset_stats() {
        global $wpdb;
        $wpdb->query( "TRUNCATE TABLE " . self::$table_name );
    }
}
