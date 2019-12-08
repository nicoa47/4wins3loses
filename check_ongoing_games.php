<?php

$na = $_GET['q'];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

// reject malicious code
$na = mysqli_real_escape_string($con, $na);

$sql = "SELECT * FROM fwtl_games ORDER BY player_name";

// ORDER BY score DESC

if ($result=mysqli_query($con, $sql))
  {
  for ($i = 1; $i <= $result->num_rows; $i++)
    {
        // find first instance of game
        if ($na=$obj->player_1) {
            // get all data
            echo $obj->player_1;
            echo "|a|";
            echo $obj->player_2;
            echo "|a|";
            echo $obj->game_dims;
            echo "|a|";
            echo $obj->occupied_stone_inds;
            echo "|a|";
            echo $obj->player_1_stone_inds;
            echo "|a|";
            echo $obj->player_2_stone_inds;
        }
        else if ($na=$obj->player_2) {
            // get all data
            echo $obj->player_1;
            echo "|a|";
            echo $obj->player_2;
            echo "|a|";
            echo $obj->game_dims;
            echo "|a|";
            echo $obj->occupied_stone_inds;
            echo "|a|";
            echo $obj->player_1_stone_inds;
            echo "|a|";
            echo $obj->player_2_stone_inds;
        }
    $obj = mysqli_fetch_object($result);
    echo $obj->player_name;
    echo "|a|";
    echo $obj->player_pwd;
    echo "|b|";
    }
  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>