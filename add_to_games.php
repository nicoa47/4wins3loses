<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// split the input string
// input: player1, player2, dims, occupied
// stones always empty
// turn always 0 (pl 1)
$a = explode("|", $q);
$na1 = $a[0];
$na2 = $a[1];
$di = $a[2];
$oc = $a[3];

echo $q;

// reject malicious code
$na1    = mysqli_real_escape_string($con, $na1);
$na2    = mysqli_real_escape_string($con, $na2);
$di     = mysqli_real_escape_string($con, $di );
$oc     = mysqli_real_escape_string($con, $oc );

// SQL code
$sql = "INSERT INTO fwtl_games(player_1,player_2,game_dims,occupied_stone_inds,player_1_stone_inds,player_2_stone_inds,turn) VALUES('$na1', '$na2', '$di', '$oc', '', '', 0)";

// save to db
mysqli_query($con, $sql);

// close
mysqli_close($con);

?>