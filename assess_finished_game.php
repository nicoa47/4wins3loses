<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

$a = explode("|", $q);
$pl1 = $a[0];
$pl2 = $a[1];
$win = $a[2];

$pl1 =  mysqli_real_escape_string($con, $pl1);
$pl2 =  mysqli_real_escape_string($con, $pl2);
$win =  mysqli_real_escape_string($con, $win);



// get the previous number of games for each player

// player1
$result = mysqli_query($con, "SELECT player_n_games FROM fwtl_accounts WHERE player_name='$pl1'");
$n_games_1 = $result->fetch_object()->player_n_games;
$sql = "UPDATE fwtl_accounts SET player_n_games=$n_games_1+1 WHERE player_name='$pl1'";
mysqli_query($con, $sql);

// player2
$result = mysqli_query($con, "SELECT player_n_games FROM fwtl_accounts WHERE player_name='$pl2'");
$n_games_2 = $result->fetch_object()->player_n_games;
$sql = "UPDATE fwtl_accounts SET player_n_games=$n_games_2+1 WHERE player_name='$pl2'";
mysqli_query($con, $sql);

if ($win == 0) {
    $result = mysqli_query($con, "SELECT player_n_wins FROM fwtl_accounts WHERE player_name='$pl1'");
    $n_wins = $result->fetch_object()->player_n_wins;
    $sql = "UPDATE fwtl_accounts SET player_n_wins=$n_wins+1 WHERE player_name='$pl1'";
    mysqli_query($con, $sql);
} else {
    $result = mysqli_query($con, "SELECT player_n_wins FROM fwtl_accounts WHERE player_name='$pl2'");
    $n_wins = $result->fetch_object()->player_n_wins;
    $sql = "UPDATE fwtl_accounts SET player_n_wins=$n_wins+1 WHERE player_name='$pl2'";
    mysqli_query($con, $sql);
}

// close
mysqli_close($con);

?>