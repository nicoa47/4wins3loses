<?php

$q = $_GET['q'];

$a = explode(">", $q);
$function   = $a[0];
$input      = $a[1];

$con = mysqli_connect('database-5000160186.ud-webspace.de','dbu190292','Threctia1847','dbs155300');
if (!$con) {
    echo 'Could not connect: ' . mysqli_error($con);
}


function split_input($con, $q)
{

    $a = explode("|", $q);

    for($i = 0; $i < count($a); ++$i) {
        $a[$i]= mysqli_real_escape_string($con, $a[$i]);
    }

    return $a;
}

function change_turn($a, $turn)
{
    $sql = "UPDATE fwtl_games SET turn=$turn
    WHERE player_1='$a[0]' AND player_2='$a[1]'";
    mysqli_query($con, $sql);
}

function add_finished_game_to_player($player)
{
    $result = mysqli_query($con, "SELECT player_n_games FROM fwtl_accounts WHERE player_name='$player'");
    $n_games = $result->fetch_object()->player_n_games;
    $sql = "UPDATE fwtl_accounts SET player_n_games=$n_games+1 WHERE player_name='$player'";
    mysqli_query($con, $sql);
}

function add_victory_to_player($player)
{
    $result = mysqli_query($con, "SELECT player_n_wins FROM fwtl_accounts WHERE player_name='$player'");
    $n_wins = $result->fetch_object()->player_n_wins;
    $sql = "UPDATE fwtl_accounts SET player_n_wins=$n_wins+1 WHERE player_name='$player'";
    mysqli_query($con, $sql);
}

function echo_all_game_data($row)
{
    echo $row['player_1'];
    echo "|a|";
    echo $row['player_2'];
    echo "|a|";
    echo $row['game_dims'];
    echo "|a|";
    echo $row['occupied_stone_inds'];
    echo "|a|";
    echo $row['player_1_stone_inds'];
    echo "|a|";
    echo $row['player_2_stone_inds'];
    echo "|a|";
    echo $row['turn'];
}





function add_to_games($con, $input)
{
    $a = split_input($con, $input);

    // SQL code
    $sql = "INSERT INTO fwtl_games(player_1,player_2,game_dims,occupied_stone_inds,player_1_stone_inds,player_2_stone_inds,turn)
            VALUES('$a[0]', '$a[1]', '$a[2]', '$a[3]', '', '', '$a[4]')";
    
    // save to db
    mysqli_query($con, $sql);
}

function apply_new_turn($con, $input)
{

    $a = split_input($con, $input);

    if ($a[4]=='1') {
        if ($a[2] >= 0 && $a[3] >= 0) {
            // get the previous content of cell that keeps track of stones
            $result = mysqli_query($con, "SELECT player_1_stone_inds FROM fwtl_games WHERE player_1='$a[0]' AND player_2='$a[1]'");
            $stones = $result->fetch_object()->player_1_stone_inds;
            // append the new stone
            $sql = "UPDATE fwtl_games SET player_1_stone_inds=CONCAT('$stones','x','$a[2]','y','$a[3]')
            WHERE player_1='$a[0]' AND player_2='$a[1]'";
            mysqli_query($con, $sql);
        }
        change_turn($a, 1);
    }
    else {
        if ($a[2] >= 0 && $a[3] >= 0) {
            // get the previous content of cell that keeps track of stones
            $result = mysqli_query($con, "SELECT player_2_stone_inds FROM fwtl_games WHERE player_1='$a[0]' AND player_2='$a[1]'");
            $stones = $result->fetch_object()->player_2_stone_inds;
            // append the new stone
            $sql = "UPDATE fwtl_games SET player_2_stone_inds=CONCAT('$stones','x','$a[2]','y','$a[3]')
            WHERE player_1='$a[0]' AND player_2='$a[1]'";
            mysqli_query($con, $sql);
        }
        change_turn($a, 0);
    }
}

function assess_finished_game($con, $input)
{
    $a = split_input($con, $input);

    add_finished_game_to_player($a[0]);
    add_finished_game_to_player($a[1]);

    if ($a[2] == 0) {
        add_victory_to_player($a[0]);
    } else {
        add_victory_to_player($a[1]);
    }
}

function check_empty($con, $input)
{
    $a = split_input($con, $input);

    $sql = "SELECT * FROM fwtl_games
    WHERE   (player_1='$a[0]' AND player_2='$a[1]')
    OR      (player_1='$a[1]' AND player_2='$a[0]')";

    if ($result=mysqli_query($con, $sql))
    {
    $obj = mysqli_fetch_object($result);

    if (mysqli_num_rows($result) > 0) {
    
            if (strlen($obj->player_1_stone_inds)>0 || strlen($obj->player_2_stone_inds)>0) {
                echo "false1";
            } else {
                echo "true";
            }

        } else {
            echo "false2";
        }

    // Free result set
    mysqli_free_result($result);
    }
}

function check_end_seen($con, $input)
{
    $a = split_input($con, $input);

    $sql = "SELECT * FROM fwtl_games WHERE player_1='$a[0]' AND player_2='$a[1]'";

    if ($result=mysqli_query($con, $sql))
    {
    $obj = mysqli_fetch_object($result);
    if ($obj->p1_game_end==1 && $obj->p2_game_end==1) {
        echo "true";
    } else {
        echo "false";
    }

    // Free result set
    mysqli_free_result($result);
    }
}

function check_game_exists($con, $input)
{
    $a = split_input($con, $input);

    $sql = "SELECT * FROM fwtl_games WHERE (player_1='$a[0]' AND player_2='$a[1]') OR (player_1='$a[1]' AND player_2='$a[0]')";

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
}

function check_if_name_exists($con)
{
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
}

function check_if_turn_changed($con, $input)
{
    $a = split_input($con, $input);

    $sql = "SELECT * FROM fwtl_games WHERE player_1='$a[0]' AND player_2='$a[1]'";

    if ($result=mysqli_query($con, $sql))
    {
    $obj = mysqli_fetch_object($result);

    // get the turn
    echo $obj->turn;

    // Free result set
    mysqli_free_result($result);
    }
}

function check_ongoing_games($con, $input)
{

    // echo $input;

    $a = split_input($con, $input);

    // echo $a;

    $sql = "SELECT * FROM fwtl_games ORDER BY player_1";

    if ($result=mysqli_query($con, $sql))
    {
    while ($row = $result->fetch_assoc()) {

        // find first instance of game
        if ($a[0]==$row['player_1']) {
            if ($a[1]==$row['player_2']) {
                // get all data
                echo_all_game_data($row);
                break;
            }
        }

        else if ($a[0]==$row['player_2']) {
            if ($a[1]==$row['player_1']) {
                // get all data
                echo_all_game_data($row);
                break;
            }
        }

    }

    // Free result set
    mysqli_free_result($result);
    }
}

function get_highscores($con)
{
    $sql = "SELECT * FROM fwtl_accounts";
    // ORDER BY CAST(player_n_wins AS float)/CAST(player_n_games AS float) LIMIT 12

    if ($result=mysqli_query($con, $sql))
      {
        // echo $result->num_rows;
      for ($i = 1; $i <= $result->num_rows; $i++)
        {
            $obj = mysqli_fetch_object($result);

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
}

function give_up($con, $input)
{
    $a = split_input($con, $input);

    if ($a[0] == 1) {
        // player1
        $result = mysqli_query($con, "SELECT player_1_stone_inds FROM fwtl_games WHERE player_1='$a[1]' AND player_2='$a[2]'");
        $stones = $result->fetch_object()->player_1_stone_inds;
        $sql = "UPDATE fwtl_games SET player_1_stone_inds=CONCAT('$stones','gu') WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    } else {
        // player2
        $result = mysqli_query($con, "SELECT player_2_stone_inds FROM fwtl_games WHERE player_1='$a[1]' AND player_2='$a[2]'");
        $stones = $result->fetch_object()->player_2_stone_inds;
        $sql = "UPDATE fwtl_games SET player_2_stone_inds=CONCAT('$stones','gu') WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
}

function remove_finished_game($con, $input)
{
    $a = split_input($con, $input);

    // SQL code
    $sql = "DELETE FROM fwtl_games WHERE player_1='$a[0]' AND player_2='$a[1]'";

    // save to db
    mysqli_query($con, $sql);
}

function search_relevant_games($con, $pl)
{
    $sql = "SELECT * FROM fwtl_games ORDER BY player_1";

    // reject malicious code
    $pl = mysqli_real_escape_string($con, $pl);

    // ORDER BY score DESC

    if ($result=mysqli_query($con, $sql))
    {
    for ($i = 1; $i <= $result->num_rows; $i++)
        {
        $obj = mysqli_fetch_object($result);

        if ($pl==$obj->player_1) {
            echo $obj->player_2;
            echo "||";
            continue; // make sure that same game is not listed twice
        }
        if ($pl==$obj->player_2) {
            echo $obj->player_1;
            echo "||";
            continue; // make sure that same game is not listed twice
        }
        }
    // Free result set
    mysqli_free_result($result);
    }
}

function set_end($con, $input)
{
    $a = split_input($con, $input);

    if ($a[0] == '1') {
        $sql = "UPDATE fwtl_games SET p1_game_end=1 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
    else {
        $sql = "UPDATE fwtl_games SET p2_game_end=1 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
}

function set_seen($con, $input)
{
    $a = split_input($con, $input);

    if ($a[0] == '1') {
        $sql = "UPDATE fwtl_games SET player_1_seen=1 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
    else {
        echo '2';
        $sql = "UPDATE fwtl_games SET player_2_seen=1 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
}

function set_unseen($con, $input)
{
    $a = split_input($con, $input);

    if ($a[0] == 1) {
        $sql = "UPDATE fwtl_games SET player_2_seen=0 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
    else {
        $sql = "UPDATE fwtl_games SET player_1_seen=0 WHERE player_1='$a[1]' AND player_2='$a[2]'";
        mysqli_query($con, $sql);
    }
}



// call functions

if ($function == 'add_to_games')            { add_to_games($con, $input); }
if ($function == 'apply_new_turn')          { apply_new_turn($con, $input); }
if ($function == 'assess_finished_game')    { assess_finished_game($con, $input); }
if ($function == 'check_empty')             { check_empty($con, $input); }
if ($function == 'check_end_seen')          { check_end_seen($con, $input); }
if ($function == 'check_game_exists')       { check_game_exists($con, $input); }
if ($function == 'check_if_name_exists')    { check_if_name_exists($con); }
if ($function == 'check_if_turn_changed')   { check_if_turn_changed($con, $input); }
if ($function == 'check_ongoing_games')     { check_ongoing_games($con, $input); }
if ($function == 'get_highscores')          { get_highscores($con); }
if ($function == 'give_up')                 { give_up($con, $input); }
if ($function == 'remove_finished_game')    { remove_finished_game($con, $input); }
if ($function == 'search_relevant_games')   { search_relevant_games($con, $input); }
if ($function == 'set_end')                 { set_end($con, $input); }
if ($function == 'set_seen')                { set_seen($con, $input); }
if ($function == 'set_unseen')              { set_unseen($con, $input); }

// close
mysqli_close($con);

?>