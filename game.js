var current_mouse_pos = {x: 0, y: 0}; // keeping track of current mouse position
var game_state = "menu";

var n_hori = {name: 'hori', num: 8};
var n_vert = {name: 'vert', num: 8};
var logged_in_name = "Adelhoeni"; // empty if not logged in
var upper = false; // flag to determine whether shift is pressed
var alt = false; // flag to determine whether alt is pressed (for @)

// containers
var menu = new Menu();                                      // 0
var reg_log_in = new RegLogIn("You are not logged in");     // 1
var register;                                               // 2
var log_in;                                                 // 3
var search_player;                                          // 4
var search_game;                                            // 5
var game;                                                   // 6
var game_end_options;                                       // 7
var rules = new Rules();                                    // 8
var options = new Options();                                // 9
var highscores = new Highscores();                          // 10

// meta-container:
screens = [
    menu, reg_log_in, register, log_in, search_player, search_game, game, game_end_options, rules, options, highscores
];

// add event listeners
// document.addEventListener('mousedown', mousedown);
document.addEventListener('mouseup', mousedown);
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
    for (let screen_ind = 0; screen_ind < screens.length; screen_ind++) {
        try {
            if (screens[screen_ind].game_state == game_state) {
                screens[screen_ind].update();
            }
        } catch {}
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
    for (let screen_ind = 0; screen_ind < screens.length; screen_ind++) {
        try {
            if (screens[screen_ind].game_state == game_state) {
                screens[screen_ind].render();
                // special case: game_end_options
                if (screen_ind == 7) {
                    screens[6].render();
                    screens[7].render();
                }
            }
        } catch {}
    }
}


// defining listener functions
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
            var index = screens[2].active_input_ind;
            if (index >= 0) {
                var last_ind = screens[2].input_items.length - 1;
                if (type_case == "number") {
                    const letter = String(e.keyCode - 48);
                    screens[2].input_items[index].letter_typed(letter);
                }
                if (type_case == "letter") {
                    if (upper) {
                        var letter = alphabet_upper[e.keyCode - 65];    
                    } else if (alt && index == last_ind && e.keyCode == 81) {
                        var letter = "@";
                    } else { // normal case
                        var letter = alphabet[e.keyCode - 65];    
                    }
                    screens[2].input_items[index].letter_typed(letter);
                }
                if (type_case == "backspace") {
                    screens[2].input_items[index].delete_letter();
                }
                if (type_case == "escape") {
                    screens[2].input_items[index].active = false;
                }
                if (type_case == "dot" && index == last_ind) {
                    screens[2].input_items[index].letter_typed(".");
                }
                if (type_case == "hyphen" && index == last_ind) {
                    if (upper) {
                        screens[2].input_items[index].letter_typed("_");
                    } else {
                        screens[2].input_items[index].letter_typed("-");
                    }
                }
                if (type_case == "tab") {
                    screens[2].input_items[index].active = false;
                    if (index < last_ind) {
                        screens[2].input_items[index + 1].active = true;
                    }
                }
                if (type_case == "enter") {
                    // test whether valid
                    // TODO remove hardcoding
                    if (index == 0) {
                        var name = screens[2].input_items[0].input_text.label;
                        screens[2].valid_name = check_name(name);
                        if (screens[2].valid_name) {
                            screens[2].input_items[index].active = false;
                            screens[2].input_items[index + 1].active = true;
                        }
                    }
                    if (index == 1) {
                        var pwd = screens[2].input_items[1].input_text.label;
                        screens[2].valid_pwd = check_pwd(pwd);
                        if (screens[2].valid_pwd) {
                            screens[2].input_items[index].active = false;
                            screens[2].input_items[index + 1].active = true;
                        }
                    }
                    if (index == 2) {
                        var mail = screens[2].input_items[2].input_text.label;
                        screens[2].valid_mail = check_mail(mail);
                        if (screens[2].valid_mail) {
                            screens[2].input_items[index].active = false;

                            // last option: go to next screen
                            var name = screens[2].input_items[0].input_text.label;
                            var pwd =  screens[2].input_items[1].input_text.label;
                            var mail = screens[2].input_items[2].input_text.label;
                            add_player_to_DB(name, pwd, mail);
                            if (screens[2].goal_state == "search_player") {
                                logged_in_proceed(name, "search_player");
                            } else {
                                logged_in_proceed(name, "search_game");
                            }

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
            var index = screens[3].active_input_ind;
            if (index >= 0) {
                var last_ind = screens[3].input_items.length - 1;
                if (type_case == "number") {
                    const letter = String(e.keyCode - 48);
                    screens[3].input_items[index].letter_typed(letter);
                }
                if (type_case == "letter") {
                    if (upper) {
                        var letter = alphabet_upper[e.keyCode - 65];
                    } else { // normal case
                        var letter = alphabet[e.keyCode - 65];    
                    }
                    screens[3].input_items[index].letter_typed(letter);
                }
                if (type_case == "backspace") {
                    screens[3].input_items[index].delete_letter();
                }
                if (type_case == "escape") {
                    screens[3].input_items[index].active = false;
                }
                if (type_case == "tab") {
                    screens[3].input_items[index].active = false;
                    if (index == 0) {
                        screens[3].input_items[index + 1].active = true;
                    }
                }
                if (type_case == "enter") {
                    // test whether valid
                    // TODO remove hardcoding
                    if (index == 0) {
                        var name = screens[3].input_items[0].input_text.label;
                        screens[3].valid_name = check_name(name, true);
                        if (screens[3].valid_name) {
                            screens[3].input_items[index].active = false;
                            screens[3].input_items[index + 1].active = true;
                        }
                    }
                    if (index == 1) {
                        var pwd = screens[3].input_items[1].input_text.label;
                        screens[3].valid_pwd = check_pwd(pwd);
                        if (screens[3].valid_pwd) {
                            screens[3].input_items[index].active = false;

                            // last option: go to next screen if valid
                            var name = screens[3].input_items[0].input_text.label;
                            var pwd = screens[3].input_items[1].input_text.label;
                            var correct = check_log_in(name, pwd);
                            screens[3].log_in_correct = correct;
                            if (correct) {
                                if (screens[3].goal_state == "search_player") {
                                    logging_in(name);
                                    logged_in_proceed(name, "search_player");
                                } else {
                                    logging_in(name, "game");
                                    logged_in_proceed(name, "search_game");
                                }
                            }
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
            if (screens[4].items[1].input_field.length > 0) {
                if (screens[4].items[1].input_field[0].active) {
                    if (type_case == "number") {
                        const letter = String(e.keyCode - 48);
                        screens[4].items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "letter") {
                        if (upper) {
                            var letter = alphabet_upper[e.keyCode - 65];
                        } else { // normal case
                            var letter = alphabet[e.keyCode - 65];    
                        }
                        screens[4].items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "backspace") {
                        screens[4].items[1].input_field[0].delete_letter();
                    }
                    if (type_case == "escape") {
                        screens[4].items[1].input_field[0].active = false;
                    }
                    if (type_case == "enter") {
                        screens[4].items[1].input_field[0].active = false;
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
            if (screens[5].items[1].input_field.length > 0) {
                if (screens[5].items[1].input_field[0].active) {
                    if (type_case == "number") {
                        const letter = String(e.keyCode - 48);
                        screens[5].items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "letter") {
                        if (upper) {
                            var letter = alphabet_upper[e.keyCode - 65];
                        } else { // normal case
                            var letter = alphabet[e.keyCode - 65];    
                        }
                        screens[5].items[1].input_field[0].letter_typed(letter);
                    }
                    if (type_case == "backspace") {
                        screens[5].items[1].input_field[0].delete_letter();
                    }
                    if (type_case == "escape") {
                        screens[5].items[1].input_field[0].active = false;
                    }
                    if (type_case == "enter") {
                        screens[5].items[1].input_field[0].active = false;
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
        for (let screen_ind = 0; screen_ind < screens.length; screen_ind++) {
            try {
                if (screens[screen_ind].game_state == game_state) {
                    clicked_on_item(screens[screen_ind].items);
                    // special cases
                    if (screen_ind == 2 || screen_ind == 3) {
                        clicked_on_item(screens[screen_ind].input_items);
                    }
                    if (screen_ind == 4 || screen_ind == 5) {
                        clicked_on_item(screens[screen_ind].items[1].names);
                    }
                    if (screen_ind == 6) {
                        for (let index = 0; index < screens[6].cells.length; index++) {
                            clicked_on_item(screens[6].cells[index]);
                        }
                    }
                }
            } catch {}
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

update();