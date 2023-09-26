<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.s-kastner.de/
 * @since             1.0.0
 * @package           Spvgg_Membership_Application
 *
 * @wordpress-plugin
 * Plugin Name:       Membership Application
 * Plugin URI:        https://www.spvggdeuringen.de
 * Description:       Membership Application form
 * Version:           1.0.0
 * Author:            Sebastian Kastner
 * Author URI:        https://www.s-kastner.de/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       spvgg-membership-application
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('SPVGG_MEMBERSHIP_APPLICATION_VERSION', '1.0.0');

global $spvgg_membership_application_validation_issues;
// add_action('wp_enqueue_scripts', 'enque_js_files');

$GLOBALS["spvgg_membership_application_validation_issues"] = array();

function show_membership_application()
{
	enqueue_form_assets();
	// handle post data if set
	if (empty($_POST)) {
		return get_vue_form();
	} else {
		return "Post data";
	}
}

function enqueue_form_assets()
{
	$dir = __DIR__  . '/public/assets/';
	$files = scandir($dir);
	foreach ($files as &$file) {
		// add css js files
		if(str_ends_with($file, ".js")) {
			$script_name = 'spvgg-membership-' . $file;
			$script_path = plugin_dir_url(__FILE__) . 'public/assets/' . $file;
			wp_enqueue_script($script_name, $script_path);
		} else if (str_ends_with($file, ".css")) {
			$style_name = 'spvgg-membership-' . $file;
			$style_path = plugin_dir_url(__FILE__) . 'public/assets/' . $file;
			wp_enqueue_style($style_name, $style_path);
		}
	}
}

function get_vue_form() {
	return '<div id="app"></div>';
}

function get_partial_contents($partial_name)
{
	ob_start();
	$partial = 'public/partials/' . $partial_name;
	include(plugin_dir_path(__FILE__) . $partial);
	return ob_get_clean();
}

// register shortcode
add_shortcode('show_membership_application', 'show_membership_application');