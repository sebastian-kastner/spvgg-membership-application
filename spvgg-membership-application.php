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

define('SPVGG_MEMBERSHIP_APPLICATION_VERSION', '1.0.0');

global $spvgg_membership_application_validation_issues;

$GLOBALS["spvgg_membership_application_validation_issues"] = array();

function show_membership_application()
{
	enqueue_form_assets();

	// handle post data if set
	if (empty($_POST)) {
		return '<div id="app"></div>';
	} else {
		$raw_data = json_decode(base64_decode($_POST['plain_values']));
		$formatted_data = mb_convert_encoding(base64_decode($_POST['formatted_values']), 'UTF-8', 'ISO-8859-1');

		$first_member = get_first_member($raw_data);
		$first_member_email = get_email($first_member);
		$first_member_name = get_name($first_member);
		$all_fields_set = all_fields_set($raw_data);

		if ($first_member_email == null || $first_member_name == null || !$all_fields_set) {
			return "Der Mitgliedschaftsantrag ist unvollständig. Gehen sie zurück und vervollständigen sie den Antrag.";
		}

		// TODO: send mail to mitgliederverwaltung@spvggdeuringen.de

		// send confirmation mail to applicant
		$to = $first_member_email;
		$subject = "Neuer SpVgg Mitgliedschaftsantrag";
		$message = "Hallo " . $first_member_name . "\n\n";
		$message .= "Vielen Dank für deinen Antrag auf Mitgliedschaft bei der SpVgg Deuringen. ";
		$message .= "Wir kümmern uns so schnell wie möglich um die Bearbeitung des Antrags!\n\n";
		$message .= "Hier die Zusammenfassung des Antrags:\n\n";
		$message .= $formatted_data;
		$headers = "From: mitgliederverwaltung@spvggdeuringen.de";

		$mailed = mail($to, $subject, $message, $headers);
		if ($mailed) {
			return "Dein Antrag und eine Bestätigung an " . $first_member_email . " wurde erfolgreich verschickt. Wir bearbeiten den Antrag so schnell wie möglich!";
		} else {
			return "Die eMail konnte nicht verschickt werden";
		}
	}
}

function all_fields_set($data): bool
{
	if (!isset($data->sepaAgreement) || $data->sepaAgreement != "Yes") {
		return false;
	}
	if (!isset($data->dataProtectionAgreement) || $data->dataProtectionAgreement != "Yes") {
		return false;
	}
	if (!isset($data->publicationAgreement) || $data->publicationAgreement != "Yes") {
		return false;
	}
	return true;
}

function get_first_member($data): ?object
{
	$members = $data->members;
	if (isset($members) && is_array($members) && count($members) > 0) {
		return $members[0];
	}
	return null;
}

function get_email($member): ?string
{
	if ($member == null) {
		return null;
	}
	$email = $member->email;
	if (isset($email)) {
		return $email;
	}
	return null;
}

function get_name($member): ?string
{
	if ($member == null) {
		return null;
	}
	$title = $member->title;
	$firstName = $member->firstName;
	$lastName = $member->lastName;
	if (isset($firstName) && isset($lastName)) {
		$name = "";
		if (isset($title) && $title != "") {
			$name .= $title . " ";
		}
		$name .= $firstName . " " . $lastName;
		return $name;
	}
	return null;
}

function get_dump($data): string
{
	$out = "<pre>";
	ob_start();
	var_dump($data);
	$dumpedData = ob_get_clean();
	$out = $out . $dumpedData;
	$out = $out . "</pre>";
	return $out;
}

/**
 * Wordpress integration
 */

function enqueue_form_assets()
{
	$dir = __DIR__ . '/public/assets/';
	$files = scandir($dir);
	foreach ($files as &$file) {
		// add css js files
		if (str_ends_with($file, ".js")) {
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

function get_partial_contents($partial_name)
{
	ob_start();
	$partial = 'public/partials/' . $partial_name;
	include(plugin_dir_path(__FILE__) . $partial);
	return ob_get_clean();
}

// register shortcode
add_shortcode('show_membership_application', 'show_membership_application');