<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// split the input string
$a = explode("|", $q);
$pl1 = $a[0];
$pl2 = $a[1];

// SQL code
$sql = "DELETE FROM fwtl_games WHERE player_1='$pl1' AND player_2='$pl2'";

// save to db
mysqli_query($con, $sql);

mysqli_close($con);

?>