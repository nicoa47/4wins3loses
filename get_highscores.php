<?php

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

$sql = "SELECT * FROM fwtl_accounts ORDER BY CAST(player_n_wins AS float)/CAST(player_n_games AS float) LIMIT 12";


if ($result=mysqli_query($con, $sql))
  {
  $obj = mysqli_fetch_object($result);
  for ($i = 1; $i <= $result->num_rows; $i++)
    {
        echo $obj->player_name;
        echo "|a|";
        echo $value=bcdiv($obj->player_n_wins, $obj->player_n_games, 3);
        echo "|a|";
        echo $obj->player_n_games;
        echo "|b|";

    }

  // Free result set
  mysqli_free_result($result);
}

mysqli_close($con);

?>