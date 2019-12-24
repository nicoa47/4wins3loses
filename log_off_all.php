<?php

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// SQL code
$sql = "UPDATE fwtl_accounts SET player_online = '0'";

// save to db
mysqli_query($con, $sql);

mysqli_close($con);

?>