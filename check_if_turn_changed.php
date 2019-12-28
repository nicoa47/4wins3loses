<?php

$q = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// split the input string (both players)
$a = explode("|", $q);
$pl1 = $a[0];
$pl2 = $a[1];


// reject malicious code
$pl1 = mysqli_real_escape_string($con, $pl1);
$pl2 = mysqli_real_escape_string($con, $pl2);

$sql = "SELECT * FROM fwtl_games WHERE player_1=$pl1 AND player_2=$pl2";

if ($result=mysqli_query($con, $sql))
  {
  $obj = mysqli_fetch_object($result);

  // get the turn
  echo $obj->turn;

  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>