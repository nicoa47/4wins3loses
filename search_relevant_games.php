<?php

$pl = $_GET['q'];


$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

$sql = "SELECT * FROM fwtl_games ORDER BY player_1";

// reject malicious code
$pl = mysqli_real_escape_string($con, $pl);

// ORDER BY score DESC

if ($result=mysqli_query($con, $sql))
  {
  for ($i = 1; $i <= $result->num_rows; $i++)
    {
    $obj = mysqli_fetch_object($result);
    if ($pl=$obj->player_1) {
        echo $obj->player_2;
        echo "|a|";
    }
    if ($pl=$obj->player_2) {
        echo $obj->player_1;
        echo "|a|";
    }
    }
  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>