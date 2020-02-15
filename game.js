var current_mouse_pos = {x: 0, y: 0}; // keeping track of current mouse position
var game_state = "menu";

var n_hori = {name: 'hori', num: 8};
var n_vert = {name: 'vert', num: 8};

// get info from URL if clicked on mail link to join game
var logged_in_name = getUrlParam('pl', "b");

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

// if first time loaded and player in URL, ask for pwd
if (logged_in_name.length > 0) {
    var pwd = prompt("Please enter your password:");
    var login_correct = check_log_in(logged_in_name, pwd);
    if (login_correct) {
        logging_in(logged_in_name, "game");
        var opponent_name = getUrlParam('opp', "");
        if (opponent_name.length > 0) {
            // search for game
            var loaded_game_infos = get_game_infos_ongoing_game(opponent_name);
            if (loaded_game_infos.length > 0) {
                reload_game(opponent_name);
            }
        }
    } else {
        console.log("log in incorrect!")
        logged_in_name = "";
    }
}

// add event listeners
document.addEventListener('mousedown', mousedown);
document.addEventListener('mousemove', mousemove);
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
    // fill_canvas("rgba(255,255,255,0)");

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

    // debug
    fill_canvas("rgba(1,0,0,0.5)");
}

function mousedown(e) {

    // make sure it is LMB
    if (e.button == 0) {
        // get position
        current_mouse_pos = get_pos(e);
        
        // activate items --> but not between screens
        // deactivate click listener for new screen
        for (let screen_ind = 0; screen_ind < screens.length; screen_ind++) {
            try {
                if (screens[screen_ind].game_state == game_state) {
                    // special cases
                    if (screen_ind == 2 || screen_ind == 3) {
                        clicked_on_item(screens[screen_ind].items);
                        clicked_on_item(screens[screen_ind].input_items);
                    }
                    else if (screen_ind == 4 || screen_ind == 5) {
                        clicked_on_item(screens[screen_ind].items);
                        clicked_on_item(screens[screen_ind].items[1].names);
                    }
                    else if (screen_ind == 6) {
                        for (let index = 0; index < screens[6].cells.length; index++) {
                            clicked_on_item(screens[screen_ind].items);
                            clicked_on_item(screens[6].cells[index]);
                        }
                    }
                    else {
                        // normal case
                        clicked_on_item(screens[screen_ind].items);
                    }
                    break;
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