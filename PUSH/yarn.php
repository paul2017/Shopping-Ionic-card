<?php
    define('HOST', 'localhost');
    define('USER', 'root');
    define('PASS', '');
    define('DBNAME', 'yarnbalk');

    $con = mysql_connect(HOST, USER, PASS) or die ('could not connect:'.mysql_error());
    mysql_select_db(DBNAME,$con) or die('Could not select database.');

    $val=$_GET['token'];
    $query = "insert into deviceToken (deviceToken) values ('$val')";
    $result = mysql_query($query) or die(mysql_error());
    echo 'success';
?>