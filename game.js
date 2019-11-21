var current_mouse_pos = {x: 0, y: 0}; // keeping track of current mouse position
var game_state = "menu"; // menu game rules options 

// containers
var menu_items = [];
menu_items.push(new MenuItem("game",        "START GAME",  50, [1, 4]));
menu_items.push(new MenuItem("rules",       "RULES",       50, [2, 4]));
menu_items.push(new MenuItem("options",     "OPTIONS",     50, [3, 4]));
menu_items.push(new MenuItem("highscores",  "HIGHSCORES",  50, [4, 4]));
var menu = new Menu(menu_items);

var rules_lines = [];
rules_lines.push(new StaticText(game_state, "put 4 of your stones in a row, column or diagonal", 20, [1, 10], [1, 1]));
rules_lines.push(new StaticText(game_state, "avoid putting 3 of your stones in a row, column or diagonal", 20, [2, 10], [1, 1]));
rules_lines.push(new StaticText(game_state, "stop your opponent from putting 4 of his/her stones in a row, column or diagonal", 20, [3, 10], [1, 1]));
rules_lines.push(new StaticText(game_state, "fool your opponent into putting 3 of his/her stones in a row, column or diagonal", 20, [4, 10], [1, 1]));
rules_lines.push(new StaticText(game_state, "Have fun!", 20, [6, 10], [1, 1]));
rules_lines.push(new MenuItem("menu", "Go Back to Menu", 20, [8, 10], [1, 1]));
var rules = new Rules(rules_lines);

// add event listeners
document.addEventListener('mousedown', mousedown);
document.addEventListener('mousemove', mousemove);

// creating the game loop
function update() {
    // update everything
    update_list(menu_items);
    // draw everything
    draw_all();
    // keep animation going
    requestAnimationFrame(update);
}

function draw_all() {
    // clear canvas
    fill_canvas("white");

    // distinction of game states
    if (game_state == "menu") {
        menu.render();
    }
    else if (game_state == "rules") {
        rules.render();
    }
}

function mousedown(e) {
    // get position
    current_mouse_pos = get_pos(e);
    // activate items
    if (game_state == "menu") {
        clicked_on_item(menu.items);
    }
    if (game_state == "rules") {
        clicked_on_item(rules.lines);
    }
}

function mousemove(e) {
    // get position
    current_mouse_pos = get_pos(e);
}

// start updating
update();