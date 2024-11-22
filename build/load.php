<?php
// Attempt to parse the ini file
$ini = parse_ini_file('app.ini');

// Check if the ini file was successfully parsed
if ($ini === false) {
    // Handle the error, e.g., log it or display an error message
    die('Error: Unable to open or parse the configuration file.');
}

// Set the content type to JavaScript
header("Content-Type: application/javascript");

// Encode the values and output them
$apiUrl = base64_encode($ini['API_URL']);
$vncPass = base64_encode($ini['VNC_PASS']);
$vncUrl = base64_encode($ini['VNC_URL']);

// Generate the JavaScript object with encoded values
echo "window.env = {";
echo "    AP: '$apiUrl',";
echo "    BU: '$buUrl',";
echo "    VP: '$vncPass',";
echo "    VU: '$vncUrl'";
echo "};";
?>
