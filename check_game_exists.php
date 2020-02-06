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


// reject malicious code
$pl1 = mysqli_real_escape_string($con, $pl1);
$pl2 = mysqli_real_escape_string($con, $pl2);

$sql = "SELECT * FROM fwtl_games WHERE (player_1='$pl1' AND player_2='$pl2') OR (player_1='$pl2' AND player_2='$pl1')";

if ($result=mysqli_query($con, $sql))
  {
  $obj = mysqli_fetch_object($result);

  if (mysqli_num_rows($result) > 0) {
        echo "true";
    } else {
        echo "false";
    }

  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>