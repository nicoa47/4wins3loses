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
  $obj = mysqli_fetch_object($result);
  for ($i = 1; $i <= $result->num_rows; $i++)
    {
        // find first instance of game
        if ($pl1=$obj->player_1) {
            if ($pl2=$obj->player_2) {
              echo "z"; // to check whether game exists --> check for length == 1!
                echo $obj->player_1_stone_inds;
                echo $obj->player_2_stone_inds;
            //   if (mysqli_num_rows($obj->player_1_stone_inds) == 0 && mysqli_num_rows($obj->player_2_stone_inds) == 0) {
            //       echo "true";
            //   } else {
            //       echo "false";
            //   }
            break;
        }
        }

        else if ($pl1=$obj->player_2) {
          if ($pl2=$obj->player_1) {
            echo "z"; // to check whether game exists --> check for length == 1!
            echo $obj->player_1_stone_inds;
            echo $obj->player_2_stone_inds;
            // if (mysqli_num_rows($obj->player_1_stone_inds) == 0 && mysqli_num_rows($obj->player_2_stone_inds) == 0) {
            //     echo "true";
            // } else {
            //     echo "false";
            // }
          break;
          }
        }

    }

  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>