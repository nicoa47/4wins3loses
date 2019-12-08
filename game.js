var current_mouse_pos = {x: 0, y: 0}; // keeping track of current mouse position
var game_state = "menu";
// menu reg_log_in register log_in search_player search_game
// init_game game game_finished
// rules options highscores

var n_hori = {name: 'hori', num: 8};
var n_vert = {name: 'vert', num: 8};
var logged_in_name = ""; // empty if not logged in
var logged_in_name = ""; // TODO change back
var upper = false; // flag to determine whether shift is pressed
var alt = false; // flag to determine whether alt is pressed (for @)

// containers
var menu = new Menu();
var reg_log_in_screen = new RegLogInScreen("You are not logged in");
var register_screen;
var log_in_screen;
var rules = new Rules();
var options = new Options();

// classes only instantiated after clicking respective menu option
var game;
var game_end;
var search_player_screen;
var search_game_screen;

// add event listeners
document.addEventListener('mousedown', mousedown);
document.addEventListener('mousemove', mousemove);
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);
window.addEventListener('resize', resize);
window.addEventListener("unload", unload);

// Prevent some keys from calling global browser functions
document.onkeydown = function (e) {
	
	if (!e) { /* This will happen in IE */
		e = window.e;
	}
		
	var keyCode = e.keyCode;
    
    // Backspace
	if (keyCode == 8 &&
		((e.target || e.srcElement).tagName != "TEXTAREA") && 
		((e.target || e.srcElement).tagName != "INPUT")) { 
		
		if (navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
			e.stopPropagation();
		} else {
			alert("prevented");
			e.returnValue = false;
		}
		
		return false;
    }
    
    // Tabulator
    if (keyCode == 9 &&
		((e.target || e.srcElement).tagName != "TEXTAREA") && 
		((e.target || e.srcElement).tagName != "INPUT")) { 
		
		if (navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
			e.stopPropagation();
		} else {
			alert("prevented");
			e.returnValue = false;
		}
		
		return false;
	}

};	

// creating the game loop
function update() {

    // update everything based on game state
    if (game_state == "menu") {
        menu.update();
    }
    else if (game_state == "reg_log_in") {
        reg_log_in_screen.update();
    }
    else if (game_state == "register") {
        register_screen.update();
    }
    else if (game_state == "log_in") {
        log_in_screen.update();
    }
    else if (game_state == "search_player") {
        search_player_screen.update();
    }
    else if (game_state == "search_game") {
        search_game_screen.update();
    }
    else if (game_state == "init_game") {
        game = new Game(n_hori, n_vert);
        game_state = "game";
    }
    else if (game_state == "game") {
        game.update();   
    }
    else if (game_state == "game_finished") {
        game_end.update();
    }
    else if (game_state == "rules") {
        rules.update();
    }
    else if (game_state == "options") {
        options.update();
    }

    // draw everything
    draw_all();
    // keep animation going
    requestAnimationFrame(update);
}

function draw_all() {
    // clear canvas
    clear_canvas();
    fill_canvas("rgba(255,255,255,0)");

    // distinction of game states
    if (game_state == "menu") {
        menu.render();
    }
    else if (game_state == "reg_log_in") {
        reg_log_in_screen.render();
    }
    else if (game_state == "register") {
        register_screen.render();
    }
    else if (game_state == "log_in") {
        log_in_screen.render();
    }
    else if (game_state == "search_player") {
        search_player_screen.render();
    }
    else if (game_state == "search_game") {
        search_game_screen.render();
    }
    else if (game_state == "game") {
        game.render();   
    }
    else if (game_state == "game_finished") {
        game.render();
        game_end.render();
    }
    else if (game_state == "rules") {
        rules.render();
    }
    else if (game_state == "options") {
        options.render();
    }
}

function keydown(e) {
    if (e.keyCode == 16) {
        upper = true;
    }
    if (e.keyCode == 18) {
        alt = true;
    }
    if (game_state == "register") {
        var type_case = class_of_key(e.keyCode);
        // if any active key is pressed
        if (type_case != "") {
            // search active text input field
            var index = register_screen.active_input_ind;
            if (index >= 0) {
                var last_ind = register_screen.input_items.length - 1;
                if (type_case == "number") {
                    const letter = String(e.keyCode - 48);
                    register_screen.input_items[index].letter_typed(letter);
                }
                if (type_case == "letter") {
                    if (upper) {
                        var letter = alphabet_upper[e.keyCode - 65];    
                    } else if (alt && index == last_ind && e.keyCode == 81) {
                        var letter = "@";
                    } else { // normal case
                        var letter = alphabet[e.keyCode - 65];    
                    }
                    register_screen.input_items[index].letter_typed(letter);
                }
                if (type_case == "backspace") {
                    register_screen.input_items[index].delete_letter();
                }
                if (type_case == "escape") {
                    register_screen.input_items[index].active = false;
                }
                if (type_case == "dot" && index == last_ind) {
                    register_screen.input_items[index].letter_typed(".");
                }
                if (type_case == "hyphen" && index == last_ind) {
                    if (upper) {
                        register_screen.input_items[index].letter_typed("_");
                    } else {
                        register_screen.input_items[index].letter_typed("-");
                    }
                }
                if (type_case == "tab") {
                    register_screen.input_items[index].active = false;
                    if (index < last_ind) {
                        register_screen.input_items[index + 1].active = true;
                    }
                }
                if (type_case == "enter") {
                    // test whether valid
                    // TODO remove hardcoding
                    if (index == 1) {
                        var name = register_screen.input_items[1].input_text.label;
                        register_screen.valid_name = check_name(name);
                        if (register_screen.valid_name) {
                            register_screen.input_items[index].active = false;
                            register_screen.input_items[index + 1].active = true;
                        }
                    }
                    if (index == 2) {
                        var pwd = register_screen.input_items[2].input_text.label;
                        register_screen.valid_pwd = check_pwd(pwd);
                        if (register_screen.valid_pwd) {
                            register_screen.input_items[index].active = false;
                            register_screen.input_items[index + 1].active = true;
                        }
                    }
                    if (index == 3) {
                        var mail = register_screen.input_items[3].input_text.label;
                        register_screen.valid_mail = check_mail(mail);
                        if (register_screen.valid_mail) {
                            register_screen.input_items[index].active = false;
                        }
                    }
                }
            }
        }
    }
    if (game_state == "log_in") {
        var type_case = class_of_key(e.keyCode);
        // if any active key is pressed
        if (type_case != "") {
            // search active text input field
            // TODO: remove hardcoding
            var index = log_in_screen.active_input_ind;
            if (index >= 0) {
                var last_ind = log_in_screen.input_items.length - 1;
                if (type_case == "number") {
                    const letter = String(e.keyCode - 48);
                    log_in_screen.input_items[index].letter_typed(letter);
                }
                if (type_case == "letter") {
                    if (upper) {
                        var letter = alphabet_upper[e.keyCode - 65];
                    } else { // normal case
                        var letter = alphabet[e.keyCode - 65];    
                    }
                    log_in_screen.input_items[index].letter_typed(letter);
                }
                if (type_case == "backspace") {
                    log_in_screen.input_items[index].delete_letter();
                }
                if (type_case == "escape") {
                    log_in_screen.input_items[index].active = false;
                }
                if (type_case == "tab") {
                    log_in_screen.input_items[index].active = false;
                    if (index == 0) {
                        log_in_screen.input_items[index + 1].active = true;
                    }
                }
                if (type_case == "enter") {
                    // test whether valid
                    // TODO remove hardcoding
                    if (index == 0) {
                        var name = log_in_screen.input_items[1].input_text.label;
                        log_in_screen.valid_name = check_name(name);
                        if (log_in_screen.valid_name) {
                            log_in_screen.input_items[index].active = false;
                            log_in_screen.input_items[index + 1].active = true;
                        }
                    }
                    if (index == 1) {
                        var pwd = log_in_screen.input_items[2].input_text.label;
                        log_in_screen.valid_pwd = check_pwd(pwd);
                        if (log_in_screen.valid_pwd) {
                            log_in_screen.input_items[index].active = false;
                        }
                    }
                }
            }
        }
    }
    if (game_state == "search_player") {
        var type_case = class_of_key(e.keyCode);
        // if any active key is pressed
        if (type_case != "") {
            // search active text input field
            if (search_player_screen.items[1].input_field.length > 0) {
                if (search_player_screen.items[1].input_field[0].active) {
                    if (type_case == "number") {
                        const letter = String(e.keyCode - 48);
                        search_player_screen.items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "letter") {
                        if (upper) {
                            var letter = alphabet_upper[e.keyCode - 65];
                        } else { // normal case
                            var letter = alphabet[e.keyCode - 65];    
                        }
                        search_player_screen.items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "backspace") {
                        search_player_screen.items[1].input_field[0].delete_letter();
                    }
                    if (type_case == "escape") {
                        search_player_screen.items[1].input_field[0].active = false;
                    }
                    if (type_case == "enter") {
                        search_player_screen.items[1].input_field[0].active = false;
                    }
                }
            }
        }
    }
    if (game_state == "search_game") {
        var type_case = class_of_key(e.keyCode);
        // if any active key is pressed
        if (type_case != "") {
            // search active text input field
            if (search_game_screen.items[1].input_field.length > 0) {
                if (search_game_screen.items[1].input_field[0].active) {
                    if (type_case == "number") {
                        const letter = String(e.keyCode - 48);
                        search_game_screen.items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "letter") {
                        if (upper) {
                            var letter = alphabet_upper[e.keyCode - 65];
                        } else { // normal case
                            var letter = alphabet[e.keyCode - 65];    
                        }
                        search_game_screen.items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "backspace") {
                        search_game_screen.items[1].input_field[0].delete_letter();
                    }
                    if (type_case == "escape") {
                        search_game_screen.items[1].input_field[0].active = false;
                    }
                    if (type_case == "enter") {
                        search_game_screen.items[1].input_field[0].active = false;
                    }
                }
            }
        }
    }
}

function keyup(e) {
    if (e.keyCode == 16) {
        upper = false;
    }
    if (e.keyCode == 18) {
        alt = false;
    }
}

function mousedown(e) {

    // make sure it is LMB
    if (e.button == 0) {
        // get position
        current_mouse_pos = get_pos(e);
        // activate items
        if (game_state == "menu") {
            clicked_on_item(menu.items);
        }
        else if (game_state == "reg_log_in") {
            clicked_on_item(reg_log_in_screen.items);
        }
        else if (game_state == "register") {
            clicked_on_item(register_screen.items);
            clicked_on_item(register_screen.input_items);
        }
        else if (game_state == "log_in") {
            clicked_on_item(log_in_screen.items);
            clicked_on_item(log_in_screen.input_items);
        }
        else if (game_state == "search_player") {
            clicked_on_item(search_player_screen.items);
        }
        else if (game_state == "search_game") {
            clicked_on_item(search_game_screen.items);
        }
        else if (game_state == "game") {
            for (let index = 0; index < game.cells.length; index++) {
                clicked_on_item(game.cells[index]);
            }
        }
        else if (game_state == "game_finished") {
            clicked_on_item(game_end.items);
        }
        else if (game_state == "rules") {
            clicked_on_item(rules.lines);
        }
        else if (game_state == "options") {
            clicked_on_item(options.items);
        }
    }
}

function mousemove(e) {
    // get position
    current_mouse_pos = get_pos(e);
}

function unload(e) {
    log_off();
}

// start updating
update();