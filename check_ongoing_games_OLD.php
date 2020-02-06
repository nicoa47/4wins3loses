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

$sql = "SELECT * FROM fwtl_games ORDER BY player_1";


if ($result=mysqli_query($con, $sql))
  {
  while($row = mysqli_fetch_row($result)) {
  // while ($row = $result->fetch_assoc()) {
    // echo '$row['name']';
        // find first instance of game
        if ($pl1==$row[$i]->player_1) {
            if ($pl2==$row[$i]->player_2) {
              // get all data
              echo $row[$i]->player_1;
              echo "|a|";
              echo $row[$i]->player_2;
              echo "|a|";
              echo $row[$i]->game_dims;
              echo "|a|";
              echo $row[$i]->occupied_stone_inds;
              echo "|a|";
              echo $row[$i]->player_1_stone_inds;
              echo "|a|";
              echo $row[$i]->player_2_stone_inds;
              echo "|a|";
              echo $row[$i]->turn;
            break;
            }
        }

        else if ($pl1==$row[$i]->player_2) {
          if ($pl2==$row[$i]->player_1) {
            // get all data
            echo $row[$i]->player_1;
            echo "|a|";
            echo $row[$i]->player_2;
            echo "|a|";
            echo $row[$i]->game_dims;
            echo "|a|";
            echo $row[$i]->occupied_stone_inds;
            echo "|a|";
            echo $row[$i]->player_1_stone_inds;
            echo "|a|";
            echo $row[$i]->player_2_stone_inds;
            echo "|a|";
            echo $row[$i]->turn;
          break;
          }
        }

    }

  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>