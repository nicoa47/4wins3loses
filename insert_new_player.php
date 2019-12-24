<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// split the input string
$a = explode("|", $q);
$na = $a[0];
$pw = $a[1];
$ma = $a[2];

// reject malicious code
$na = mysqli_real_escape_string($con, $na);
$pw = mysqli_real_escape_string($con, $pw);
$ma = mysqli_real_escape_string($con, $ma);

// SQL code
$sql = "INSERT INTO fwtl_accounts(player_name,player_pwd,player_mail,player_n_games,player_n_wins,player_online) VALUES('$na', '$pw', '$ma', 0, 0, 1)";

// save to db
mysqli_query($con, $sql);

// close
mysqli_close($con);

?>