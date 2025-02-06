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
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

if (!session_id()) {
	session_start();
}

define('SPVGG_MEMBERSHIP_APPLICATION_VERSION', '1.0.0');

function show_membership_application()
{
	$mgmtMailAddresse = "mitgliederverwaltung@spvggdeuringen.de";
	$mediaMailAddresse = "medien@spvggdeuringen.de";

	enqueue_form_assets();

	// handle post data if set
	if (empty($_POST)) {
		return '<div id="app"></div>';
	} else {
		// decode base64. convert to utf8. decode json as array
		$raw_data = json_decode(base64_decode($_POST['plain_values']), true);
		// decode base64. convert to utf8.
		$formatted_data = base64_decode($_POST['formatted_values']);
		$formatted_summary = base64_decode($_POST['summary_text']);

		$creator = get_creator($raw_data);
		$creator_email = get_email($creator);
		$creator_name = get_name($creator);
		$uuid = get_application_uuid($raw_data);

		if ($uuid == null || $creator_email == null || $creator_name == null || !all_fields_set($raw_data)) {
			return "Der Mitgliedschaftsantrag ist unvollständig. Gehe zurück und vervollständige den Antrag.";
		}

		$application_sent = (array_key_exists($uuid, $_SESSION) && $_SESSION[$uuid] == true);
		if ($application_sent) {
			session_write_close();
			$html = "<h3>Mitgliedschaft beantragt</h3>";
			$html .= "<p>Dein Mitgliedschaftsantrag und eine Bestätigungs an " . $creator_email . " wurde bereits abgeschickt. Es kann bis zu 15 Minuten dauern bis die Bestätigungsmail ankommt.</p>";
			$html .= "<p>Bitte wende Dich an " . $mgmtMailAddresse . " falls Du keine Bestätigung erhalten hast.</p>";
			return $html;
		}

		// send confirmation mail to applicant
		$toMember = $creator_email;
		$subject = "Mitgliedschaftsantrag bei SpVgg Deuringen e.V.";

		$memberMail = "Hallo " . $creator_name . "\n\n";
		$memberMail .= "Vielen Dank für Deinen Antrag auf Mitgliedschaft bei der SpVgg Deuringen.\n\n";
		$memberMail .= "Wir kümmern uns so schnell wie möglich um die Bearbeitung des Antrags!\n\n";
		$memberMail .= "Hier die Zusammenfassung Deines Antrags:\n\n";
		$memberMail .= $formatted_data;
		$headers = "From: " . $mgmtMailAddresse;
		$headers = array('Content-Type: text/plain; charset=UTF-8');

		$mgmtMail = "Zusammenfassung des Mitgliedschaftsantrags:\n\n";
		$mgmtMail .= $formatted_summary;
		$mgmtMail .= "\n\n";
		$mgmtMail .= "Details: \n\n";
		$mgmtMail .= $formatted_data;

		// TODO: Remove debug output!
		print("<h3>Mail an den Verein</h3>");
		print("<pre>");
		print($mgmtMail);
		print("</pre>");

		print("<h3>Mail an Antragsteller</h3>");
		print($creator_email);
		print("<pre>");
		print($memberMail);
		print("</pre>");


		// add filters for wp mail delivery
		// this is not done on a global scope to make sure the settings are only applied to this form
		add_filter('wp_mail_from', 'custom_wp_mail_from');
		add_filter('wp_mail_from_name', 'custom_wp_mail_from_name');
		add_filter('wp_mail_content_type', 'custom_wp_mail_content_type');

		// send mail to member
		$memberMailStatus = send_mail($toMember, $subject, $memberMail, $headers);

		if ($memberMailStatus) {
			// send mail to membership management
			$mgmtMailStatus = send_mail($mgmtMailAddresse, $subject, $mgmtMail, $headers);
			if ($mgmtMailStatus) {
				$_SESSION[$uuid] = true;
				session_write_close();

				// send additional mail to media mail address; no confirmation required
				send_mail($mediaMailAddresse, $subject, $mgmtMail, $headers);

				$html = "<h3>Mitgliedschaft beantragt</h3>";
				$html .= "<p>Dein Antrag und eine Bestätigung an " . $creator_email . " wurde erfolgreich verschickt. Prüfe gegebenenfalls den Spam Ordner falls die Bestätigung nicht ankommt. Wir bearbeiten den Antrag so schnell wie möglich!</p>";
				$html .= "<p>Vielen Dank! Wir freuen uns Dich bei der SpVgg begrüßen zu dürfen. Wir wünschen viel Freude in unserem Verein!</p>";
				return $html;
			}
		}
		return "Fehler beim Versenden der eMail. Bitte nutze den analogen Mitgliedschaftsantrag zum Ausdrucken oder melden dich bei " . $mgmtMailAddresse . ".";
	}
}

function all_fields_set($data): bool
{
	$sepaAgreement = get_value($data, "sepaAgreement");
	if (!isset($sepaAgreement) || $sepaAgreement != "Ja") {
		return false;
	}
	$dataProtectionAgreement = get_value($data, "dataProtectionAgreement");
	if (!isset($dataProtectionAgreement) || $dataProtectionAgreement != "Ja") {
		return false;
	}
	$publicationAgreement = get_value($data, "publicationAgreement");
	if (!isset($publicationAgreement) || $publicationAgreement != "Ja") {
		return false;
	}
	return true;
}

function get_creator($data)
{
	if (!array_key_exists("members", $data)) {
		return null;
	}
	$members = $data["members"];
	if (!array_key_exists("creator", $members)) {
		return null;
	}
	return $members['creator'];	
}

function get_email($member): ?string
{
	if ($member == null) {
		return null;
	}
	$email = get_value($member, "email");
	if (isset($email)) {
		return $email;
	}
	return null;
}

function get_application_uuid($data): ?string
{
	if (!array_key_exists("uuid", $data)) {
		return null;
	}
	return $data["uuid"];
}

function get_name($member): ?string
{
	if ($member == null) {
		return null;
	}
	$title = get_value($member, "title");
	$firstName = get_value($member, "firstName");
	$lastName = get_value($member, "lastName");
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

function get_value($array, $key): ?string
{
	if (array_key_exists($key, $array)) {
		return $array[$key];
	}
	return null;
}

function send_mail(string $to, string $subject, string $message, array $headers): bool
{
	return wp_mail($to, $subject, $message, $headers);
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

function custom_wp_mail_from()
{
	return 'mitgliederverwaltung@spvggdeuringen.de';
}

function custom_wp_mail_from_name()
{
	return 'Mitgliederverwaltung SpVgg Deuringen e.V.';
}

function custom_wp_mail_content_type()
{
	return "text/plain; charset=UTF-8";
}

// TODO: Remove debug method
function debug($var) {
	print('<pre>');
	var_dump($var);
	print('</pre>');
}

// register shortcode
add_shortcode('show_membership_application', 'show_membership_application');
