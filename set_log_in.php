<?php

$na = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// reject malicious code
$na = mysqli_real_escape_string($con, $na);

// SQL code
$sql = "UPDATE fwtl_accounts SET player_online = '1' WHERE player_name='$na'";

// save to db
mysqli_query($con, $sql);

mysqli_close($con);

?>