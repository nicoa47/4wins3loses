<<<<<<< HEAD
alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
]

alphabet_upper = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
]

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

function render_list(l) {
    for (let i = 0; i < l.length; i++) {
        l[i].render();
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

function get_names_pwds(remove_self=false) {
    var all_names = [];
    var all_pwds = [];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var all_names_pwds_unsplit = this.responseText;
            var all_name_pwd_pairs = all_names_pwds_unsplit.split("|b|");
            for (let index = 0; index < all_name_pwd_pairs.length; index++) {
                const pair = all_name_pwd_pairs[index];
                var name = pair.split("|a|")[0];
                var pwd = pair.split("|a|")[1];
                if (remove_self && name == logged_in_name) {
                    continue;
                }
                if (name != "") {
                    all_names.push(name);
                    all_pwds.push(pwd);
                }
            }
        }
    }
    xmlhttp.open("GET", "check_if_name_exists.php", false);
    xmlhttp.send();
    return [all_names, all_pwds];
}

function check_name(name) {
    // check whether name string not empty
    if (name.length == 0) {
        return false;
    }

    // check whether name in DB
    var all_names = get_names_pwds()[0];
    for (let index = 0; index < all_names.length; index++) {
        if (name == all_names[index]) {
            return false;
        }
    }

    // no problems --> return true
    return true;
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
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "insert_new_player.php?q="+name+"|"+pwd+"|"+mail, false);
        xmlhttp.send();


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
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "set_log_off.php?q="+logged_in_name, false);
    xmlhttp.send();

    // set the string name back to empty
    logged_in_name = "";

}

function log_off_all() {
    console.log("in here")
    // debugging function rather
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "log_off_all.php", false);
    xmlhttp.send();
}

function log_in(name) {

    logged_in_name = name;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "set_log_in.php?q="+logged_in_name, false);
    xmlhttp.send();

    // set the string name back to empty
    logged_in_name = "";

}

function logged_in_proceed(name, goal_state) {
    logged_in_name = name;
    if (goal_state == "search_player") {
        search_player_screen = new SearchPlayerScreen();
    } else {
        search_game_screen = new SearchGameScreen();
    }
    game_state = goal_state;
}

function ongoing_game() {
    var first_game_match = [];
    if (logged_in_name == "") {
        return first_game_match; // no matching games
    }
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var first_game_match_unsplit = this.responseText;
            first_game_match = first_game_match_unsplit.split('|a|');
        }
    }
    xmlhttp.open("GET", "check_ongoing_games.php", false);
    xmlhttp.send();
    return first_game_match;
}
=======
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

function middle(val1, val2) {
    var min = Math.min(val1, val2);
    var max = Math.max(val1, val2);
    return min + (max - min)/2;
}

function get_pos(e) {
    var x_val = e.clientX;
    var y_val = e.clientY;
<<<<<<< HEAD
    var coord = {x: x_val, y: y_val};
    return coord_game_space(coord);
=======
    return {x: x_val, y: y_val};
>>>>>>> 14a316017873a057223248cb8b52a71b5f382a47
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

function render_list(l) {
    for (let i = 0; i < l.length; i++) {
        l[i].render();
    }
}

function clicked_on_item(item_list) {
    for (let i = 0; i < item_list.length; i++) {
        item_list[i].clicked();
    }
<<<<<<< HEAD
}
=======
}

// test!
display_text("AAAHH", 1, 4, 1, 4, 30, "black");
display_text("AAAHH", 2, 4, 2, 4, 30, "blue");
display_text("AAAHH", 3, 4, 3, 4, 30, "grey");
>>>>>>> 14a316017873a057223248cb8b52a71b5f382a47
>>>>>>> a87670cce9ad1992033953a759f3285db7a181d7
