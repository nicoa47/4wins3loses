// coord: {x: x_val, y: y_val}
function coord(x_val, y_val) {
    return {x: x_val, y: y_val};
}

function coord_game_space(coord) {
    // adjust for global scale and translation
    coord.x -= current_translate.x;
    coord.y -= current_translate.y;
    coord.x /= current_scale;
    coord.y /= current_scale;
    return coord;
}

function get_text_dims(text, size) {
    ctx.beginPath();
    var text_height = size*(canv_h/1080);
    ctx.font = String(text_height)+"px Arial";
    var text_width = ctx.measureText(text).width;
    ctx.closePath();
    return [text_width, text_height];
}

function get_cursor_line(text, size, row, n_rows, col, n_cols) {
    var text_width = get_text_dims(text, size)[0];
    var text_height = get_text_dims(text, size)[1];
    var height = Math.round(canv_h/n_rows);
    var y_start = height*(row - 1);
    var y_end = y_start + height;
    var y_mid = (y_start + y_end)/2;
    var width = Math.round(canv_w/n_cols);
    var x_start = (col - 1)*width;
    var x_end = col*width;
    var x_mid = (x_start + x_end)/2;
    var coord1 = {x: x_mid + 0.5*text_width + 10*(canv_h/1080), y: y_mid - 0.5*text_height};
    var coord2 = {x: x_mid + 0.5*text_width + 10*(canv_h/1080), y: y_mid + 0.5*text_height};
    return [coord1, coord2];
}

// AABB: [coord_upper_left, coord_lower_right]
function get_text_AABB(row, n_rows, col, n_cols) {
    var height = Math.round(canv_h/n_rows);
    var y_start = height*(row - 1);
    var y_end = y_start + height;
    var width = Math.round(canv_w/n_cols);
    var x_start = (col - 1)*width;
    var x_end = col*width;
    var coord_start = {x: x_start, y: y_start};
    var coord_end = {x: x_end, y: y_end};
    return [coord_start, coord_end];
}

function get_middle_coord(row, n_rows, col, n_cols) {
    var AABB = get_text_AABB(row, n_rows, col, n_cols);
    var x_val = AABB[0].x + (AABB[1].x - AABB[0].x)/2;
    var y_val = AABB[0].y + (AABB[1].y - AABB[0].y)/2;
    return {x: x_val, y: y_val};
}

function middle(val1, val2) {
    var min = Math.min(val1, val2);
    var max = Math.max(val1, val2);
    return min + (max - min)/2;
}

function get_pos(e) {
    var x_val = e.clientX;
    var y_val = e.clientY;
    var coord = {x: x_val, y: y_val};
    return coord_game_space(coord);
}

function coord_within_AABB(coord, AABB) {
    // assuming values of AABB are ordered
    if (coord.x < AABB[0].x || coord.x > AABB[1].x) {
        return false;
    }
    if (coord.y < AABB[0].y || coord.y > AABB[1].y) {
        return false;
    }
    return true;
}

function update_list(l) {
    for (let i = 0; i < l.length; i++) {
        l[i].update();
    }
}

function update_llist(ll) {
    // list of lists
    for (let i = 0; i < ll.length; i++) {
        for (let j = 0; j < ll[i].length; j++) {
            ll[i][j].update();
        }
    }
}

function render_list(l) {
    for (let i = 0; i < l.length; i++) {
        l[i].render();
    }
}

function render_llist(ll) {
    // list of lists
    for (let i = 0; i < ll.length; i++) {
        for (let j = 0; j < ll[i].length; j++) {
            ll[i][j].render();
        }
    }
}

function clicked_on_item(item_list) {
    for (let i = 0; i < item_list.length; i++) {
        item_list[i].clicked();
    }
}

function abs_list_difference(l1, l2) {
    var new_l = [];
    for (let index = 0; index < l1.length; index++) {
        new_l.push(Math.abs(l1[index] - l2[index]));
    }
    return new_l;
}

function sum_of_list(l) {
    var val = 0;
    for (let index = 0; index < l.length; index++) {
        val += l[index];
    }
    return val;
}

function hide_text(text) {
    var hidden = "";
    for (let index = 0; index < text.length; index++) {
        hidden += "*";
    }
    return hidden;
}

function get_names_pwds(remove_self=false, remove_existing_games=false) {
    var all_names = [];
    var all_pwds = [];
    var all_names_pwds_unsplit = DB_call("check_if_name_exists", [], true);
    var all_name_pwd_pairs = all_names_pwds_unsplit.split("|b|");
    for (let index = 0; index < all_name_pwd_pairs.length; index++) {
        const pair = all_name_pwd_pairs[index];
        var name = pair.split("|a|")[0];
        var pwd = pair.split("|a|")[1];
        if (remove_self && name == logged_in_name) {
            continue;
        }
        if (remove_existing_games) {
            // look at DB in games
            var exists = DB_call("check_game_exists", [logged_in_name, name], true);
            if (exists == "true") {
                continue;
            }
        }
        if (name != "") {
            all_names.push(name);
            all_pwds.push(pwd);
        }
    }
    return [all_names, all_pwds];
}

function find_all_relevant_games() {
    // retrieve games from DB where current logged in name is present
    // var all_names = [];
    var all_names_unsplit = DB_call("search_relevant_games", [logged_in_name], true);
    var all_names = all_names_unsplit.split("||");
    return all_names;
}

function check_name(name, should_exist=false) {
    // check whether name string not empty
    if (name.length == 0) {
        return false;
    }

    // check whether name in DB
    var all_names = get_names_pwds()[0];
    for (let index = 0; index < all_names.length; index++) {
        if (name == all_names[index]) {
            if (should_exist) {
                return true;
            } else {
                return false;
            }
        }
    }

    // no problems --> return true
    if (should_exist) {
        return false;    
    } else {
        return true;
    }
}

function check_pwd(pwd) {
    if (pwd.length < 3) {
        return false;
    }
    return true;
}

function check_mail(mail) {
    if (!mail.includes("@") || !mail.includes(".")) {
        return false;
    }
    return true;
}

function check_log_in(name, pwd) {
    var name_found = false;
    var names_pwds = get_names_pwds();
    var names = names_pwds[0];
    var pwds = names_pwds[1];
    var index;
    for (index = 0; index < names.length; index++) {
        if (name == names[index]) {
            name_found = true;
            break; // keep the index
        }
    }
    if (!name_found) {
        return false; // name does not exists -> sth def not correct
    }
    // else if
    if (pwds[index] != pwd) {
        return false; // pwd and name do not match
    }
    // else
    return true;
}

function add_player_to_DB(name, pwd, mail) {
    if (check_name(name) && check_pwd(pwd) && check_mail(mail)) {
        DB_call("insert_new_player", [name, pwd, mail]);
    }
}

function class_of_key(keycode) {
    // identify different cases: enter, backspace, escape, letters, numbers(, shift?)
    var type_case = "";
    if (keycode >= 48 && keycode <= 57) {
        type_case = "number";
    }
    if (keycode >= 65 && keycode <= 90) {
        type_case = "letter";
    }
    if (keycode == 190) {
        type_case = "dot";
    }
    if (keycode == 173) {
        type_case = "hyphen";
    }
    if (keycode == 8) {
        type_case = "backspace";
    }
    if (keycode == 9) {
        type_case = "tab";
    }
    if (keycode == 13) {
        type_case = "enter";
    }
    if (keycode == 27) {
        type_case = "escape";
    }
    return type_case;
}

function log_off() {
    
    DB_call("set_log_off", [logged_in_name], false);

    // set the string name back to empty
    logged_in_name = "";

}

function logging_in(name) {

    logged_in_name = name;

    DB_call("set_log_in", [logged_in_name], false);

    // set the string name back to empty
    // logged_in_name = ""; // TODO check why this line is here

}

function logged_in_proceed(name, goal_state) {
    logged_in_name = name;
    if (goal_state == "search_player") {
        screens[4] = new SearchPlayer();
    } else {
        screens[5] = new SearchGame();
    }
    game_state = goal_state;
}

function decode_coord_pairs(coords_string) {
    var output = [];
    // get pairs
    var pairs = coords_string.split('x');
    for (let index = 1; index < pairs.length; index++) {
        const pair = pairs[index];
        var pair_splitted = pair.split('y');
        var x = pair_splitted[0];
        var y = pair_splitted[1];
        output.push([x, y]);
    }
    return output;
}

function encode_coord_pairs(coords_pairs_lists) {
    var output_str = "";
    for (let index = 0; index < coords_pairs_lists.length; index++) {
        const pair = coords_pairs_lists[index];
        output_str += "x";
        output_str += String(pair[0]);
        output_str += "y";
        output_str += String(pair[1]);
    }
    return output_str;
}

function reload_game(name) {
    var splitted_infos = get_game_infos_ongoing_game(name);
    // assuming there are ongoing games
    var game_dims = decode_coord_pairs(splitted_infos[2]);
    var n_hori = game_dims[0][1];
    var n_vert = game_dims[0][0];
    // from php data set up the board of a "new" game
    screens[6] = new Game(n_hori, n_vert, splitted_infos[0], splitted_infos[1], false);
    // set the stones accordingly
    var player1_stones = decode_coord_pairs(splitted_infos[4]);
    var player2_stones = decode_coord_pairs(splitted_infos[5]);
    var blocked_stones = decode_coord_pairs(splitted_infos[3]);
    screens[6].init_cells();
    screens[6].set_cells(1, player1_stones);
    screens[6].set_cells(2, player2_stones);
    screens[6].set_cells(3, blocked_stones);
    screens[6].turn = Number(splitted_infos[6]) + 1;
    game_state = "game";
}

function init_game(player2, switch_turns=false, player1=logged_in_name) {
    // get the current values set in options
    var n_hori = screens[9].items[1].label;
    var n_vert = screens[9].items[3].label;
    var dims = [[n_hori, n_vert]];
    var coord_pairs = encode_coord_pairs(dims);
    // TODO generate blocked cells
    if (switch_turns) {
        var turn = 1;
    } else {
        var turn = 0;
    }
    DB_call("add_to_games", [player1, player2, coord_pairs, "", turn]);
    // init game
    screens[6] = new Game(n_hori, n_vert, player1, player2);
    // change specifics
    if (switch_turns) {
        screens[6].turn = 2;
    }
    game_state = "game";
}

function get_game_infos_ongoing_game(name, name2=logged_in_name) {
    var first_game_match = [];
    if (logged_in_name == "") {
        return first_game_match; // no matching games
    }
    var first_game_match_unsplit = DB_call("check_ongoing_games", [name, name2], true);
    var first_game_match = first_game_match_unsplit.split('|a|');
    return first_game_match;
}

function order_fair_desc(a, b) {
    // if equal scores, chose randomly which one is "better"
    if (a == b) {
        a += Math.random();
        b += Math.random();
    }
    return b - a;
}

function order_highscores(all_infos_unsplit) {
    // goal: object of names and positions to be later converted to correct size etc. in highscores render function
    // maximum 5 x axis categories (number of games)
    // split into players
    players_split = all_infos_unsplit.split('|b|');
    players_split = players_split.slice(0, -1);
    n_games = [];
    scores = [];

    for (let index = 0; index < players_split.length; index++) {
        var player_split = players_split[index].split('|a|');
        // convert to numbers
        player_split[2] = parseFloat(player_split[2]);
        if (player_split[2] == 0) {
            player_split[1] = 0;
        } else {
            player_split[1] = parseFloat(player_split[1]);
        }
        n_games.push(player_split[2]);
        scores.push(player_split);
    }

    // set borders of number of games (x axis; typically 10 and 100)
    var lower_bound = 10;
    var upper_bound = 100;
    // special cases first: less than 10
    if (Math.max(...n_games) <= 10) {
        lower_bound = Math.min(...n_games);
        upper_bound = Math.max(...n_games);
    } else if (Math.max(...n_games) > 10 && Math.max(...n_games) < 100) {
        upper_bound = Math.max(...n_games);
    }
    upper_bound += 0.001; // tiny margin to make sure all players are included
    // make 4 equidistant categories
    const n_cats = 4;
    var step = (upper_bound - lower_bound)/n_cats;
    cats_bounds = [lower_bound];
    scores_cat = [];
    for (let index = 0; index < n_cats; index++) {
        const last_item = cats_bounds[index];
        cats_bounds.push(last_item + step);
        scores_cat.push([]); // prep for sorting players
    }

    // categorize players into categories
    for (let player_ind = 0; player_ind < scores.length; player_ind++) {
        const player_data = scores[player_ind];
        var player_appended = false;
        for (let cat_ind = 0; cat_ind < scores_cat.length; cat_ind++) {
            const b1 = cats_bounds[cat_ind];
            const b2 = cats_bounds[cat_ind + 1];
            if (b1 <= player_data[2] && player_data[2] < b2) {
                scores_cat[cat_ind].push(player_data);
                player_appended = true;
                break;
            }
        }
        // if not sorted yet --> to last category
        if (!player_appended) {
            scores_cat[scores_cat.length-1].push(player_data);
        }
    }

    // sort players in each category
    scores_cat_sorted = [];
    for (let cat_ind = 0; cat_ind < scores_cat.length; cat_ind++) {
        var scores_to_sort = scores_cat[cat_ind];
        var sorted_scores = scores_to_sort.sort(function(a,b) { return order_fair_desc(a[1], b[1]); });
        // only keep 5 best
        if (sorted_scores.length > 5) {
            sorted_scores = sorted_scores.slice(0,5);
        }
        scores_cat_sorted.push(sorted_scores);
    }

    return scores_cat_sorted;

}

function DB_call(function_name, inputs, output=false) {
    var xmlhttp = new XMLHttpRequest();
    var return_text;
    if (output) {
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                return_text = this.responseText;
            }
        }
    }
    var input_str = "?q="+function_name+">";
    for (let index = 0; index < inputs.length; index++) {
        input_str += inputs[index];
        input_str += "|";
    }
    // remove last "|" if there are inputs
    if (inputs.length > 0) {
        input_str = input_str.slice(0, -1);
    }

    // calling php stuff
    xmlhttp.open("GET", "read_DB.php"+input_str, false);
    xmlhttp.send();
    if (output) {
        return return_text;
    }
}

function middle_of_cell(line_of_lines, col_of_cols) {
    var AABB = get_text_AABB(line_of_lines[0], line_of_lines[1], col_of_cols[0], col_of_cols[1]);
    var middle_x = (AABB[0].x + AABB[1].x)/2;
    var middle_y = (AABB[0].y + AABB[1].y)/2
    return {x: middle_x, y: middle_y};
}

function coord_in_square(coord, center, size) {
    if (   coord.x >= center.x - size/2
        && coord.x <= center.x + size/2
        && coord.y >= center.y - size/2
        && coord.y <= center.y + size/2) {
            return true;
        } else {
            return false;
        }
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}