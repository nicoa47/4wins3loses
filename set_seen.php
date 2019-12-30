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

if ($pl == '1') {
    echo $pl1;
    echo $pl2;
    $sql = "UPDATE fwtl_games SET player_1_seen=1 WHERE player_1='$pl1' AND player_2='$pl2'";
}
else {
    echo '2';
    $sql = "UPDATE fwtl_games SET player_2_seen=1 WHERE player_1='$pl1' AND player_2='$pl2'";
}

mysqli_query($con, $sql);

// close
mysqli_close($con);

?>