<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

$a = explode("|", $q);
$pl = $a[0];
$pl1 = $a[1];
$pl2 = $a[2];

$pl =  mysqli_real_escape_string($con, $pl);
$pl1 =  mysqli_real_escape_string($con, $pl1);
$pl2 =  mysqli_real_escape_string($con, $pl2);

// get the previous number of games for each player

if ($pl == 1) {
    // player1
    $result = mysqli_query($con, "SELECT player_1_stone_inds FROM fwtl_games WHERE player_1='$pl1' AND player_2='$pl2'");
    $stones = $result->fetch_object()->player_1_stone_inds;
    $sql = "UPDATE fwtl_games SET player_1_stone_inds=CONCAT('$stones','gu') WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
} else {
    // player2
    $result = mysqli_query($con, "SELECT player_2_stone_inds FROM fwtl_games WHERE player_1='$pl1' AND player_2='$pl2'");
    $stones = $result->fetch_object()->player_2_stone_inds;
    $sql = "UPDATE fwtl_games SET player_2_stone_inds=CONCAT('$stones','gu') WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
}

// close
mysqli_close($con);

?>