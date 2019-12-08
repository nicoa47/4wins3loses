<?php

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}

$sql = "SELECT * FROM fwtl_accounts ORDER BY player_name";

// ORDER BY score DESC

if ($result=mysqli_query($con, $sql))
  {
  for ($i = 1; $i <= $result->num_rows; $i++)
    {
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