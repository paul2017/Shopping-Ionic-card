<?php
/*If ($_SERVER['HTTP_ORIGIN'] == 'https://www.eylftools.com.au')
    header('Access-Control-Allow-Origin: https://www.eylftools.com.au');
else
    exit;*/
//header('Access-Control-Allow-Origin: *');
ini_set("display_errors", 1);
ini_set("track_errors", 1);
ini_set("html_errors", 1);
error_reporting(E_ALL);

//Caspio Bridge WS API WSDL file

define('HOST', 'localhost');
define('USER', 'root');
define('PASS', '');
define('DBNAME', 'stl');

$con = mysqli_connect(HOST, USER, PASS,DBNAME);
    
send_notification('72748a2327300cebd188fa87cbf9d71a1eaa7d3cc02790f0d9a0e92725244736','Message',3);
send_developer_notification('72748a2327300cebd188fa87cbf9d71a1eaa7d3cc02790f0d9a0e92725244736','Message',3);



function send_developer_notification($a, $message,$count)
{
	global $con;
    $passphrase = '1234';

// Put your alert message here:


////////////////////////////////////////////////////////////////////////////////
    $query = "select * from deviceToken";
	$res = mysqli_query($con,$query);

    /*$query0 = "select * from notify where id = (select max(id) from notify)";
    $res0 = mysqli_query($con, $query0);

    $query1 = "select * from notify1 where id = (select max(id) from notify1)";
    $res1 = mysqli_query($con, $query1);

    $query2 = "select * from notify2 where id = (select max(id) from notify2)";
    $res2 = mysqli_query($con, $query2);*/

    $ctx = stream_context_create();
    stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
    stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

// Open a connection to the APNS server
    while($row=mysqli_fetch_row($res))
    {
    	$deviceId=$row[1];
        $num = $row[2];
        $num++;
        $query1 = "update deviceToken set deviceToken = '$num' where id=$row[0]";
        mysqli_query($con, $query1);
        $fp = stream_socket_client(
            'ssl://gateway.sandbox.push.apple.com:2195', $err,
            $errstr, 60, STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT, $ctx);

        if (!$fp)
            exit("Failed to connect: $err $errstr" . PHP_EOL);

        echo 'Connected to APNS' . PHP_EOL;

        // Create the payload body
        $body['aps'] = array(
            'alert' => $message,
            'sound' => 'default',
            'badge' => $count
        );

        // Encode the payload as JSON
        $payload = json_encode($body);

        // Build the binary notification
        $msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

        // Send it to the server
        $result = fwrite($fp, $msg, strlen($msg));

        if (!$result)
            echo 'Message not delivered' . PHP_EOL;
        else
            echo 'Message successfully delivered' . PHP_EOL;

        // Close the connection to the server
        fclose($fp);
    }
}

function send_notification($a,$message,$count)
{
	global $con;
	$query="select * from deviceToken";
	$res=mysqli_query($con,$query);
    set_time_limit(0);
// charset header for output
    header('content-type: text/html; charset: utf-8');
    // print_r($deviceIds);
// this is the pass phrase you defined when creating the key
    $passphrase = '1234';
// you can post a variable to this string or edit the message here
// tr_to_utf function needed to fix the Turkish characters
// load your device ids to an array
// this is where you can customize your notification
    $result = 'Start' . '<br />';

////////////////////////////////////////////////////////////////////////////////
// start to create connection
    $ctx = stream_context_create();
    stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck2.pem');
    stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);
    // echo count($deviceIds) . ' devices will receive notifications.<br />';
   	 while($row=mysqli_fetch_row($res))
    {
    	$deviceId=$row[1];
        $num = $row[2];
        $num++;
        $query1 = "update deviceToken set deviceToken = '$num' where id=$row[0]";
        // wait for some time
        sleep(1);

       
        //   echo 'count='.$count;
        // Open a connection to the APNS server
        $payload = '{"aps":{"alert":"' . $message . '","sound":"default","badge":' . $count . '}}';
        $fp = stream_socket_client('ssl://gateway.push.apple.com:2195', $err, $errstr, 60, STREAM_CLIENT_CONNECT | STREAM_CLIENT_PERSISTENT, $ctx);

        if (!$fp) {
               exit("Failed to connect: $err $errstr" . '<br />');
        } else {
                 echo 'Apple service is online. ' . '<br />';
        }

        // Build the binary notification
        $msg = chr(0) . pack('n', 32) . pack('H*', $deviceId) . pack('n', strlen($payload)) . $payload;

        // Send it to the server
        $result = fwrite($fp, $msg, strlen($msg));

        if (!$result) {
            //     echo 'Undelivered message count: ' . $item . '<br />';
        } else {
            //   echo 'Delivered message count: ' . $item . '<br />';


        }

        if ($fp) {
            fclose($fp);
             echo 'The connection has been closed by the client' . '<br />';
        }
    
    }
    //echo count($deviceIds) . ' devices have received notifications.<br />';

// set time limit back to a normal value
    set_time_limit(30);
}

function android_notification($regIds, $message, $index)
{
    define('API_ACCESS_KEY', 'AIzaSyAXKdQJBVZKDTn_XxGrbYHbKrWetTr-vmU');

    $registrationIds = array();
    foreach ($regIds as $regID) {
        $item = trim($regID, '\'');
        array_push($registrationIds, $item);
        android_update_badge($item, "ee", $index);

    }
    // prep the bundle
    $msg = array
    (
        'message' => $message,
        'title' => 'LIFT' . '-' . $message,
        'subtitle' => $message,
        'tickerText' => $message,
        'vibrate' => 1,
        'sound' => 1,
        'largeIcon' => 'large_icon',
        'smallIcon' => 'small_icon'
    );

    $fields = array
    (
        'registration_ids' => $registrationIds,
        'data' => $msg
    );

    $headers = array
    (
        'Authorization: key=' . API_ACCESS_KEY,
        'Content-Type: application/json'
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://android.googleapis.com/gcm/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
    $result = curl_exec($ch);

    curl_close($ch);

}

?>