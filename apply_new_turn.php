<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// split the input string
$a = explode("|", $q);
$pl1 =  $a[0];
$pl2 =  $a[1];
$x =    $a[2];
$y =    $a[3];
$tu =   $a[4];

// reject malicious code
$pl1 =  mysqli_real_escape_string($con, $pl1);
$pl2 =  mysqli_real_escape_string($con, $pl2);
$x =    mysqli_real_escape_string($con, $x);
$y =    mysqli_real_escape_string($con, $y);
$tu =   mysqli_real_escape_string($con, $tu);

// SQL code

if ($tu=='1') {
    // get the previous content of cell that keeps track of stones
    $result = mysqli_query($con, "SELECT player_1_stone_inds FROM fwtl_games WHERE player_1='$pl1' AND player_2='$pl2'");
    $stones = $result->fetch_object()->player_1_stone_inds;
    // change turn
    $sql = "UPDATE fwtl_games SET turn=1
    WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
    echo 1;
    // append the new stone
    $sql = "UPDATE fwtl_games SET player_1_stone_inds=CONCAT('$stones','x','$x','y','$y')
    WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
}
else {
    // get the previous content of cell that keeps track of stones
    $result = mysqli_query($con, "SELECT player_2_stone_inds FROM fwtl_games WHERE player_1='$pl1' AND player_2='$pl2'");
    $stones = $result->fetch_object()->player_2_stone_inds;
    // change turn
    $sql = "UPDATE fwtl_games SET turn=0
    WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
    echo 0;
    // append the new stone
    $sql = "UPDATE fwtl_games SET player_2_stone_inds=CONCAT('$stones','x','$x','y','$y')
    WHERE player_1='$pl1' AND player_2='$pl2'";
    mysqli_query($con, $sql);
}

// close
mysqli_close($con);

?>