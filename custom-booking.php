<?php
/**
 * Plugin Name: Custom Booking Buttons Extension
 * Description: Adds custom booking buttons for WhatsApp and Email to the Tour Booking Manager.
 * Version: 1.0.0
 * Author: Agung Widhiatmojo
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class CustomBookingButtons {

    public function __construct() {
        // Add settings page
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);

        // Add booking buttons
        add_action('ttbm_before_add_cart_btn', [$this, 'add_custom_booking_buttons'], 10, 2);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts'], 10, 1);
        add_action('wp_head', [$this, 'hide_default_booking_button']);
    }

    // Add settings page to the admin menu
    public function add_settings_page() {
        add_menu_page(
            'Booking Buttons Settings', // Page title
            'Booking Buttons',          // Menu title
            'manage_options',           // Capability
            'custom-booking-buttons',   // Menu slug
            [$this, 'render_settings_page'], // Callback function
            'dashicons-email-alt',      // Icon
            100                         // Position
        );
    }

    // Register settings
    public function register_settings() {
        register_setting('custom_booking_buttons_settings', 'custom_booking_whatsapp_number');
        register_setting('custom_booking_buttons_settings', 'custom_booking_email_address');
    }

    // Render settings page
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Booking Buttons Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('custom_booking_buttons_settings');
                do_settings_sections('custom_booking_buttons_settings');
                ?>
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">WhatsApp Number</th>
                        <td>
                            <input type="text" name="custom_booking_whatsapp_number" value="<?php echo esc_attr(get_option('custom_booking_whatsapp_number', '1234567890')); ?>" />
                            <p class="description">Enter your WhatsApp number (with country code, e.g., +1234567890).</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Email Address</th>
                        <td>
                            <input type="email" name="custom_booking_email_address" value="<?php echo esc_attr(get_option('custom_booking_email_address', 'booking@example.com')); ?>" />
                            <p class="description">Enter your booking email address.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }

    // Enqueue scripts
    public function enqueue_scripts($tour_id) {

        $whatsapp_number = get_option('custom_booking_whatsapp_number', '1234567890');
        $email_address = get_option('custom_booking_email_address', 'booking@example.com');
        wp_register_script(
            'custom-booking-buttons-script',
            plugins_url('custom-booking-buttons-script.js', __FILE__),
            ['jquery'],
            null,
            true
        );
    
        wp_enqueue_script('custom-booking-buttons-script');
        wp_enqueue_style('custom-booking-buttons-style', plugins_url('custom-booking-buttons-style.css', __FILE__));

        // Pass dynamic data to JavaScript
        wp_localize_script('custom-booking-buttons-script', 'bookingData', [
            'whatsappNumber' => $whatsapp_number,
            'emailAddress' => $email_address,
            'tourId' => $tour_id,
            'tourTitle' => get_the_title($tour_id),
            // 'tourId' => 'test_id',
            // 'tourTitle' => 'test_title'
        ]);
    }
    

    // Add custom booking buttons
    public function add_custom_booking_buttons($ttbm_product_id, $tour_id) {

        echo '<div class="custom-booking-section">';
        echo '<div class="custom-booking-buttons">';
        echo '<div class="fancy-button wa-button whatsapp-booking-button" id="whatsapp-booking-button">';
        echo '<span class="fab fa-whatsapp"></span> Book via WhatsApp';
        echo '</div>';

        echo '<div class="fancy-button email-button email-booking-button" id="email-booking-button">';
        echo '<span class="fas fa-envelope"></span> Book via Email';
        echo '</div>';
        echo '</div>';
        echo '</div>';
    }

    // Hide default booking button
    public function hide_default_booking_button() {
        echo '<style>
            .ttbm_book_now {
                display: none !important;
            }
        </style>';
    }
}

new CustomBookingButtons();