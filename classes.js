// classes for interactive screens
class MenuItem {
    constructor(target_state, label, size, line_of_lines, col_of_cols=[1, 1]) {
        this.target_state = target_state;
        this.label = label;
        this.size = size;
        this.line = line_of_lines[0];
        this.n_lines = line_of_lines[1];
        this.col = col_of_cols[0];
        this.n_cols = col_of_cols[1];

        this.base_color = "black";
        this.hover_color = "grey";
        this.color = this.base_color;
        this.hovered = false;

        this.AABB = get_text_AABB(this.line, this.n_lines, this.col, this.n_cols);
    }
    clicked() {
        if (coord_within_AABB(current_mouse_pos, this.AABB)) {
            // catch special cases first
            if (this.target_state == "search_player" && logged_in_name == "") {
                game_state = "reg_log_in";
                screens[1].goal_game_state = "search_player";
            } else if (this.target_state == "search_game" && logged_in_name == "") {
                screens[3] = new LogIn("search_game");
                game_state = "log_in";
            } else if (this.target_state == "register") {
                screens[2] = new Register(screens[1].goal_game_state);
                game_state = "register";
            } else if (this.target_state == "search_player") {
                screens[4] = new SearchPlayer();
                game_state = "search_player";
            } else if (this.target_state == "search_game") {
                screens[5] = new SearchGame();
                game_state = "search_game";
            } else if (this.target_state == "log_in") {
                screens[3] = new LogIn(screens[1].goal_game_state);
                game_state = "log_in";
            } else {
                game_state = this.target_state;
            }
        }
    }
    update() {
        // AABB can change dynamically upon resizing!
        this.AABB = get_text_AABB(this.line, this.n_lines, this.col, this.n_cols);

        if (coord_within_AABB(current_mouse_pos, this.AABB)) {
            this.hovered = true;
            this.color = this.hover_color;
        } else {
            this.hovered = false;
            this.color = this.base_color;
        }
    }
    render() {
        display_text(this.label, this.line, this.n_lines, this.col, this.n_cols, this.size, this.color);
    }
}

class SpecialFunctionItem extends MenuItem {
    constructor(func, label, size, line_of_lines, col_of_cols) {
        super(game_state, label, size, line_of_lines, col_of_cols);
        this.func = func;
    }
    clicked() {
        if (coord_within_AABB(current_mouse_pos, this.AABB)) {
            if (this.func == "check_register_game") {
                // get the data
                // TODO: remove hardcoding
                var name = screens[2].input_items[0].input_text.label;
                var pwd = screens[2].input_items[1].input_text.label;
                var mail = screens[2].input_items[2].input_text.label;
                // check the data
                screens[2].valid_name = check_name(name);
                screens[2].valid_pwd = check_pwd(pwd);
                screens[2].valid_mail = check_mail(mail);
                // all correct: add to DB
                add_player_to_DB(name, pwd, mail);
                if (screens[2].valid_name &&
                    screens[2].valid_pwd &&
                    screens[2].valid_mail) {
                        logged_in_proceed(name, "search_game");
                    }
            }
            if (this.func == "check_register_player") {
                // get the data
                // TODO: remove hardcoding
                var name = screens[2].input_items[0].input_text.label;
                var pwd = screens[2].input_items[1].input_text.label;
                var mail = screens[2].input_items[2].input_text.label;
                // check the data
                screens[2].valid_name = check_name(name);
                screens[2].valid_pwd = check_pwd(pwd);
                screens[2].valid_mail = check_mail(mail);
                // all correct: add to DB
                add_player_to_DB(name, pwd, mail);
                if (screens[2].valid_name &&
                    screens[2].valid_pwd &&
                    screens[2].valid_mail) {
                        logged_in_proceed(name, "search_player");
                    }
            }
            if (this.func == "send_pwd") {
                // get pw
                var name = screens[3].input_items[0].input_text.label;
                var mail = DB_call("get_mail", [name], true);
                var pwd = DB_call("get_password", [name], true);
                if (pwd.length > 0) {
                    var subject = "4wins3loses - password request";
                    var message = "Your password is: " + pwd;
                    DB_call("send_mail", [mail, subject, message]);
                    screens[3].email_sent_note = true;
                } else {
                    alert("Could not find '" + name + "' in database!");
                }
            }
            if (this.func == "check_log_in_game") {
                // get the data
                // TODO: remove hardcoding
                var name = screens[3].input_items[0].input_text.label;
                var pwd = screens[3].input_items[1].input_text.label;
                // check the data
                var correct = check_log_in(name, pwd);
                screens[3].log_in_correct = correct;
                if (correct) {
                    logging_in(name, "game");
                    logged_in_proceed(name, "search_game");
                }
            }
            if (this.func == "check_log_in_player") {
                // get the data
                // TODO: remove hardcoding
                var name = screens[3].input_items[0].input_text.label;
                var pwd = screens[3].input_items[1].input_text.label;
                // check the data
                var correct = check_log_in(name, pwd);
                screens[3].log_in_correct = correct;
                if (correct) {
                    logging_in(name);
                    logged_in_proceed(name, "search_player");
                }
            }
            if (this.func == "log_off") {
                log_off();
                if (game_state == "search_game") {
                    screens[3] = new LogIn("search_game");
                    game_state = "log_in";
                } else {
                    screens[1] = new RegLogIn("Your are not logged in", "search_player");
                    game_state = "reg_log_in";
                }
                
            }
            if (this.func == "start_game_search_players") {
                // get the player1 name
                var player_name = this.label;
                // init games based on options and add to DB
                init_game(player_name);
            }
            if (this.func == "start_game_search_games") {
                // get the player2 name
                var player_name = this.label;
                // get the game infos from DB
                reload_game(player_name);
            }
            if (this.func == "challenge_player") {

                // get the player2 name
                // player who won is on the right side

                if (screens[7].winner_ind == 0) {
                    var player2_name = game.player1;
                    var player1_name = game.player2;
                } else {
                    var player2_name = game.player2;
                    var player1_name = game.player1;
                }
                // remove the active game (if still existent)
                DB_call("remove_finished_game", [this.player1, this.player2]);
                // init games based on options and add to DB
                init_game(player2_name, true, player1_name);
            }
            if (this.func == "give_up") {
                if (screens[6].turn == screens[6].player) {
                    DB_call("give_up", [screens[6].player, screens[6].player1, screens[6].player2]);
                    screens[6].refresh();
                    // -1: no cells are set
                    screens[6].apply_action(-1, -1);
                }
            }
        }
    }
}

class StaticText            extends MenuItem {
    constructor(target_state, label, size, line_of_lines, col_of_cols) {
        super(target_state, label, size, line_of_lines, col_of_cols);
    }
    clicked() {
        // do nothing
    }
    update() {
        // do nothing
    }
}

class SearchPlayerInput {
    // TODO allow scrolling function!
    constructor(line_of_lines, special_function) {
        // important: "line" must be "of_lines" minus 5 or smaller
        // why 5: 1 normal text input + up to 3 special function items + 1 static information
        this.ll = line_of_lines;
        this.sf = special_function;
        while(logged_in_name == "") {}; // wait for name to refresh
        this.names = [];
        this.current_names_list = [];
        this.initial_names_list = [];
        // this.set_items();
        this.AABB = get_text_AABB(this.ll[0], this.ll[1], 1, 2);
        this.active = false;
        this.set_items();
        // init scrollbar handles
        this.set_handles();
        this.hovered_up = false;
        this.hovered_down = false;
        this.current_ind = 0;
    }
    set_handles() {
        this.handle_up = middle_of_cell(this.ll, [3, 3]);
        this.handle_down = middle_of_cell([this.ll[0] + 4, this.ll[1]], [3, 3]);
    }
    set_items() {
        // initiate players (different whether initiating game or searching challengers)
        if (this.sf == "start_game_search_players") {
            // get all names except oneself
            this.current_names_list = get_names_pwds(true, true)[0];
        } else {
            // only display challengers
            this.current_names_list = find_all_relevant_games();
        }
        if (this.initial_names_list.length == 0) {
            this.initial_names_list = this.current_names_list;
        }

        // arrays can change dynamically, depending on letter typed
        this.names = [];
        this.info = [];
        
    }
    display_players() {
        // instantiate these arrays accordingly

        // reset
        this.names = [];
        
        if (this.current_names_list.length > 0) {

            var end_loop = Math.min(this.current_names_list.length, this.current_ind + 5);
            var view_ind = 0;
            for (let index = this.current_ind; index < end_loop; index++) {
                this.names.push(new SpecialFunctionItem(this.sf, this.current_names_list[index], 40,
                    [this.ll[0] + view_ind + 0.5, this.ll[1]], [2, 3]));
                view_ind++;
            }
        }
    }
    clicked() {
        if (this.hovered_up && this.current_ind > 0) {
            this.current_ind--;
        }
        if (this.hovered_down && this.current_ind < this.current_names_list.length - 5) {
            this.current_ind++;
        }
    }
    update() {

        // update handles position
        this.set_handles();

        // refresh the players display
        this.display_players();

        // TODO adjust to scrollbar position

        // hover over top or bottom tri?
        if (coord_in_square(current_mouse_pos, this.handle_up, 50/2)) {
            this.hovered_up = true;
        } else {
            this.hovered_up = false;
        }
        if (coord_in_square(current_mouse_pos, this.handle_down, 50/2)) {
            this.hovered_down = true;
        } else {
            this.hovered_down = false;
        }

        for (let index = 0; index < this.names.length; index++) {
            this.names[index].update();
        }

    }
    render() {
        for (let index = 0; index < this.names.length; index++) {
            this.names[index].render();
        }

        // scrollbar
        draw_tri(50, "u", this.handle_up, "black", !this.hovered_up);
        draw_tri(50, "d", this.handle_down, "black", !this.hovered_down);

    }
}

class ValueSelector {
    constructor(min, max, goal_var, start, line_of_lines, col_of_cols=[1,1]) {
        this.min = min;
        this.max = max;
        this.var = goal_var;
        this.label = start;
        this.size = 80;
        this.line = line_of_lines[0];
        this.n_lines = line_of_lines[1];
        this.col = col_of_cols[0];
        this.n_cols = col_of_cols[1];

        this.color = "black";
        this.color = this.base_color;
        this.hovered_left = false;
        this.hovered_right = false;
        this.place_handles();
        
    }
    place_handles() {
        this.cell_mid_coord = middle_of_cell([this.line, this.n_lines], [this.col, this.n_cols]);
        this.pos_left = {x: this.cell_mid_coord.x - 1*this.size, y: this.cell_mid_coord.y};
        this.pos_right = {x: this.cell_mid_coord.x + 1*this.size, y: this.cell_mid_coord.y};
    }
    clicked() {
        if (this.hovered_left && this.label > this.min) {
            this.label--;
            this.var.num = this.label;
        }
        if (this.hovered_right && this.label < this.max) {
            this.label++;
            this.var.num = this.label;
        }

    }
    update() {
        // update the AABBs so that window resizing is considered
        this.place_handles();

        // hover over left or right tri?
        if (coord_in_square(current_mouse_pos, this.pos_left, this.size/2)) {
            this.hovered_left = true;
        } else {
            this.hovered_left = false;
        }
        if (coord_in_square(current_mouse_pos, this.pos_right, this.size/2)) {
            this.hovered_right = true;
        } else {
            this.hovered_right = false;
        }
    }
    render() {
        display_text(this.label, this.line, this.n_lines, this.col, this.n_cols, this.size, this.color);
        draw_tri(this.size, 'l', this.pos_left, "black", !this.hovered_left);
        draw_tri(this.size, 'r', this.pos_right, "black", !this.hovered_right);
    }
}

class Cell {
    constructor(row_ind, col_ind, l, r, t, b) {
        this.row_ind = row_ind;
        this.col_ind = col_ind;
        this.l = l;
        this.r = r;
        this.t = t;
        this.b = b;
        this.size = this.r - this.l;
        this.coords = [];
        this.coords.push({x: this.l, y: this.t});
        this.coords.push({x: this.l, y: this.b});
        this.coords.push({x: this.r, y: this.b});
        this.coords.push({x: this.r, y: this.t});
        this.pos = {x: (this.l + this.r)/2, y: (this.t + this.b)/2};

        this.hovered = false;
        this.state = 0; // 0: empty; 1: player1; 2: player2; 3: blocked
        
    }
    clicked() {
        if (this.hovered && this.state == 0) {

            // set the occupying player for cell
            this.state = screens[6].turn;
            // all necessary adjustments of game
            screens[6].apply_action(this.col_ind, this.row_ind);

        }
    }
    update() {

        // hovered?
        if (current_mouse_pos.x >= this.l
            && current_mouse_pos.x < this.r
            && current_mouse_pos.y >= this.t
            && current_mouse_pos.y < this.b) {
                this.hovered = true;
            } else {
                this.hovered = false;
            }
    }
    render() {
        if (this.hovered) {
            draw_poly(this.coords, true, "rgba(0, 0, 0, 0.15)");
        }
        if (this.state == 1) {
            draw_circ(this.pos, this.size*0.6, true, "black")
        }
        if (this.state == 2) {
            draw_X(this.pos, this.size);
        }
        if (this.state == 3) {
            fill_cell(this.pos, this.size, "black");
        }
    }
}

class TextInput {
    constructor(label, size, line_of_lines, pwd=false, mail=false) {
        this.label = label;
        this.size = size;
        this.line_of_lines = line_of_lines;
        this.line = line_of_lines[0];
        this.n_lines = line_of_lines[1];
        this.input_text = new StaticText(game_state, "", this.input_text_size, this.line_of_lines, [2, 2]);
        this.set_items();
        this.active = false;
        this.hovered = false;
        this.col = 1;       // only for instruction
        this.n_cols = 2;    // only for instruction
        this.AABB = get_text_AABB(this.line, this.n_lines, this.col, this.n_cols);
        this.pwd = pwd;
        this.mail = mail;
    }
    set_items() {
        if (canv_w > canv_h) {
            this.instruction = new SpecialFunctionItem("text_input", this.label, this.size, this.line_of_lines, [1, 2]);
            this.AABB = get_text_AABB(this.line, this.n_lines, this.col, this.n_cols);
        } else {
            this.instruction = new SpecialFunctionItem("text_input", this.label, this.size, this.line_of_lines, [1, 1]);
            this.AABB = get_text_AABB(this.line, this.n_lines, 1, 1);
        }
    }
    clicked() {
        if (coord_within_AABB(current_mouse_pos, this.AABB)) {
            this.active = true;
        }
    }
    letter_typed(letter) {
        if (this.mail) {
            var max_len = 100;
        } else {
            var max_len = 10;
        }
        if (this.active && this.input_text.label.length < max_len) {
            this.input_text.label += letter;
        }
    }
    delete_letter() {
        if (this.active && this.input_text.label.length > 0) {
            var text = this.input_text.label;
            this.input_text.label = text.substring(0, text.length - 1);
        }
    }
    finish() {
        // user hits enter or escape
        this.active = false;
    }
    update() {
        this.set_items();
        this.instruction.update();
        // call prompt field when clicked
        if (this.active) {
            var prompt_input = window.prompt(this.instruction.label, this.input_text.label);
            if (prompt_input == null) {
                prompt_input = "";
            }
            this.input_text.label = prompt_input;
            this.active = false;
        }
    }
    render() {
        this.instruction.render();
        // render input
        if (canv_w > canv_h) {
            if (this.pwd) {
                var hidden_label = hide_text(this.input_text.label);
                display_text(hidden_label, this.line, this.n_lines, 2, 2, this.size, "black");
            } else {
                display_text(this.input_text.label, this.line, this.n_lines, 2, 2, this.size*0.8, "black", "Courier New");
            }
        } else {
            if (this.pwd) {
                var hidden_label = hide_text(this.input_text.label);
                display_text(hidden_label, this.line + 0.5, this.n_lines, 1, 1, this.size, "black");
            } else {
                display_text(this.input_text.label, this.line + 0.5, this.n_lines, 1, 1, this.size*0.8, "black", "Courier New");
            }
        }
    }
}






// base class for interactive screens with items
class InteractiveScreen {
    constructor(items) {
        this.hori_items = items;
        this.items = items;
    }
    update() {
        // make font appear smaller on vertical screens
        // for (let index = 0; index < this.items.length; index++) {
            // try {
                // var size_hori = this.hori_items[index].size;
                // if (canv_h >= can_w) {
                //     var new_size = size_hori*0.75;
                // } else {
                //     var new_size = size_hori;
                // }
                // this.items[index].size = new_size;
            // } catch {}
        // }
        update_list(this.items);
    }
    render() {
        render_list(this.items);
    }
}

class Menu                  extends InteractiveScreen {
    constructor() {
        var items = [
            new StaticText(game_state,      "4 wins*",              120, [2, 14], [1, 1]),
            new StaticText(game_state,      "* 3 loses.",           45,  [6, 28], [6, 10]),
            new MenuItem("search_player",   "CHALLENGE PLAYER",     55,  [3, 7]),
            new MenuItem("search_game",     "CHOOSE GAME",          55,  [4, 7]),
            new MenuItem("rules",           "RULES",                55,  [5, 7]),
            new MenuItem("options",         "OPTIONS",              55,  [6, 7]),
            new MenuItem("highscores",      "HIGHSCORES",           55,  [7, 7]),
        ];
        super(items);
        this.game_state = "menu";
    }
}

class RegLogIn              extends InteractiveScreen {
    constructor(label, goal_game_state) {
        var items = [
            new StaticText(game_state,  label,                  60, [1, 5], [1, 1]),
            new MenuItem("log_in",      "Log In",               45, [2, 5]),
            new MenuItem("register",    "Create New Player",    45, [3, 5]),
            new MenuItem("menu",        "Back to Menu",         45, [5, 5]),
        ];
        super(items);
        this.game_state = "reg_log_in";
        this.goal_game_state = goal_game_state;
        this.label = label;
    }
}

class Register              extends InteractiveScreen {
    constructor(goal_state) {
        var items = [
                     new StaticText(game_state, "Register New Player",       60, [1, 5], [1, 1]),
                     new MenuItem("menu", "Back to Menu",                    45, [5, 5], [1, 2])
        ];
        super(items);
        if (goal_state == "search_player") {
            this.items.push(new SpecialFunctionItem("check_register_player", "Continue",      45, [5, 5], [2, 2]));
        } else {
            this.items.push(new SpecialFunctionItem("check_register_game", "Continue",      45, [5, 5], [2, 2]));
        }
        this.input_items = [
            new TextInput("Enter Name",                             50, [2, 5]),
            new TextInput("Enter Password",                         50, [3, 5], true),
            new TextInput("Enter E-Mail",                           50, [4, 5], false, true),
        ];
        this.game_state = "register";
        this.goal_state = goal_state;
        this.active_input_ind = -1; // -1 means zero
        this.text_inputs_active = [0, 0, 0]; // keeping track that only one input is active at a time
        this.valid_name = true;
        this.valid_pwd = true;
        this.valid_mail = true;
    }
    update() {

        update_list(this.items);
        update_list(this.input_items);

        // check that only one text input is active:
        // --> search if multiple are currently active
        var new_inputs_active = [];

        for (let index = 0; index < this.input_items.length; index++) {
            const text_input = this.input_items[index];
            if (text_input.active) {
                new_inputs_active.push(1);
            } else {
                new_inputs_active.push(0);
            }
        }

        // call function to determine what has changed in terms of ordered activations
        if (sum_of_list(new_inputs_active) > 1) {
            this.text_inputs_active = abs_list_difference(this.text_inputs_active, new_inputs_active);
        } else {
            this.text_inputs_active = new_inputs_active;
        }

        for (let index = 0; index < this.input_items.length; index++) {
            const active = this.text_inputs_active[index];
            if (active == 1) {
                this.active_input_ind = index;
                this.input_items[index].active = true;
            } else {
                this.input_items[index].active = false;
            }
        }
        if (sum_of_list(this.text_inputs_active) == 0) {
            this.active_input_ind = -1;
        }
        
    }
    render() {
        render_list(this.items);
        render_list(this.input_items);
        if (!this.valid_name) {
            var name_feedback = new StaticText(game_state, "Name already exists", 60, [4, 10], [1, 1]);
            name_feedback.color = "rgba(220, 0, 0, 1)";
            name_feedback.render();
        }
        if (!this.valid_pwd) {
            var pwd_feedback = new StaticText(game_state, "Password needs at least 3 characters", 60, [9, 15], [1, 1]);
            pwd_feedback.color = "rgba(220, 0, 0, 1)";
            pwd_feedback.render();
        }
        if (!this.valid_mail) {
            var mail_feedback = new StaticText(game_state, "E-Mail not valid (how about some '@' and '.' ;)", 60, [16, 20], [1, 1]);
            mail_feedback.color = "rgba(220, 0, 0, 1)";
            mail_feedback.render();
        }
    }
}

class LogIn                 extends InteractiveScreen {
    constructor(goal_state) {
        var items = [
            new StaticText(game_state, "Log In to your Account",   57, [1, 5], [1, 1]),
            new SpecialFunctionItem("send_pwd", "Forgot Password", 50, [4, 5], [1, 1]),
            new MenuItem("menu", "Back to Menu",                   45, [5, 5], [1, 2]),
        ];
        super(items);
        this.game_state = "log_in";
        this.goal_state = goal_state;
        if (goal_state == "search_player") {
            this.items.push(new SpecialFunctionItem("check_log_in_player", "Log In",      45, [5, 5], [2, 2]));
        } else {
            this.items.push(new SpecialFunctionItem("check_log_in_game", "Log In",      45, [5, 5], [2, 2]));
        }
        this.input_items = [
            new TextInput("Your Name",                             50, [2, 5]),
            new TextInput("Your Password",                         50, [3, 5], true),
        ]
        this.email_sent_note = false;
        this.log_in_correct = true;
        this.valid_name = true;
        this.valid_pwd = true;
        this.text_inputs_active = [0, 0]; // keeping track that only one input is active at a time
        this.active_input_ind = -1; // -1: none active
    }
    update() {

        update_list(this.items);
        update_list(this.input_items);

        // check that only one text input is active:
        // --> search if multiple are currently active
        var new_inputs_active = [];
        for (let index = 0; index < this.input_items.length; index++) {
            const text_input = this.input_items[index];
            if (text_input.active) {
                new_inputs_active.push(1);
            } else {
                new_inputs_active.push(0);
            }
        }

        // call function to determine what has changed in terms of ordered activations
        if (sum_of_list(new_inputs_active) > 1) {
            this.text_inputs_active = abs_list_difference(this.text_inputs_active, new_inputs_active);
        } else {
            this.text_inputs_active = new_inputs_active;
        }

        for (let index = 0; index < this.input_items.length; index++) {
            const active = this.text_inputs_active[index];
            if (active == 1) {
                this.active_input_ind = index;
                this.input_items[index].active = true;
            } else {
                this.input_items[index].active = false;
            }
        }
        if (sum_of_list(this.text_inputs_active) == 0) {
            this.active_input_ind = -1;
        }
        
    }
    render() {
        render_list(this.items);
        render_list(this.input_items);
        if (!this.valid_name) {
            var name_feedback = new StaticText(game_state, "Name does not exist", 60, [4, 10], [1, 1]);
            name_feedback.color = "rgba(220, 0, 0, 1)";
            name_feedback.render();
        }
        if (!this.valid_pwd) {
            var pwd_feedback = new StaticText(game_state, "Password is too short", 60, [9, 15], [1, 1]);
            pwd_feedback.color = "rgba(220, 0, 0, 1)";
            pwd_feedback.render();
        }
        // notification that email was sent
        if (this.email_sent_note) {
            var mail_sent = new StaticText(game_state, "Check your Emails", 40, [4.5, 5], [1, 1]);
            mail_sent.color = "rgba(220,0,0,1)";
            mail_sent.render();
        }
        if (!this.log_in_correct) {
            var log_in_error = new StaticText(game_state, "Log In Data incorrect!", 50, [7, 8], [2, 2]);
            log_in_error.color = "rgba(220,0,0,1)";
            log_in_error.render();
        }
    }
}

class SearchPlayer          extends InteractiveScreen {
    constructor() {
        var items = [
            new StaticText(game_state, "Welcome, "+logged_in_name+"!", 57, [1, 7], [1, 1]),
            new SearchPlayerInput([2, 7], "start_game_search_players", "Search for Player"),
            new SpecialFunctionItem("log_off", "Log Off", 45, [7, 7], [1, 2]),
            new MenuItem("menu", "Back to Menu", 45, [7, 7], [2, 2]),
        ];
        super(items);
        this.game_state = "search_player";
    }
}

class SearchGame            extends InteractiveScreen {
    constructor() {
        var items = [
            new StaticText(game_state, "Welcome, "+logged_in_name+"!", 57, [1, 7], [1, 1]),
            new SearchPlayerInput([2, 7], "start_game_search_games", "Search for Game"),
            new SpecialFunctionItem("log_off", "Log Off", 45, [7, 7], [1, 2]),
            new MenuItem("menu", "Back to Menu", 45, [7, 7], [2, 2]),
        ];
        super(items);
        this.game_state = "search_game";
    }
}

class Game                  extends InteractiveScreen {
    constructor(n_hori, n_vert, player1, player2, newgame=true) {
        var items = [
            new MenuItem("menu", "Back to Menu", 60, [14, 16], [15, 16]),
        ]
        super(items);
        this.game_state = "game";

        this.n_hori = n_hori;
        this.n_vert = n_vert;

        this.max_nums = [0, 0];
        this.max_cells = [[], []];
        this.player_state = [0, 0]; // -1: lose, 1: win

        this.player1 = player1;
        this.player2 = player2;
        
        // identify the number of your player
        if (player1 == logged_in_name) {
            this.player = 1;
        } else {
            this.player = 2;
        }

        this.init_lines();
        if (newgame) {
            this.init_cells();
        }

        this.turn = 1;
        this.active = true;

        // cosmetics
        this.labels = [
            new StaticText(game_state, this.player1, 80, [6, 16], [2, 16]),
            new StaticText(game_state, this.player2, 80, [6, 16], [15, 16]),
        ];

        // menu options
        this.give_up_option = false;

        DB_call("set_seen", [this.player, this.player1, this.player2]);

        this.counter = 0;
    }
    init_lines() {
        // init the grid coords
        this.grid_coords = [];
        this.cells = [];

        // get the step size
        this.step_size = Math.min(canv_w, canv_h)/Math.max(Number(this.n_hori) + 2, Number(this.n_vert) + 2);
        this.start_left = (canv_w - (this.step_size*this.n_vert))/2;
        this.end_right = this.start_left + this.n_vert*this.step_size;
        this.start_top = (canv_h - (this.step_size*this.n_hori))/2;
        this.end_bottom = this.start_top + this.n_hori*this.step_size;

        // render in the center of screen
        for (let i = 0; i < this.n_hori - 1; i++) {
            this.grid_coords.push([]);
            this.grid_coords[i].push({x: this.start_left, y: this.start_top + (i + 1)*this.step_size});
            this.grid_coords[i].push({x: this.end_right, y: this.start_top + (i + 1)*this.step_size});
        }
        for (let i = 0; i < this.n_vert - 1; i++) {
            this.grid_coords.push([]);
            this.grid_coords[i + (this.n_hori - 1)].push({x: this.start_left + (i + 1)*this.step_size, y: this.start_top});
            this.grid_coords[i + (this.n_hori - 1)].push({x: this.start_left + (i + 1)*this.step_size, y: this.end_bottom});
        }
    }
    init_cells() {
        this.cells = [];
        for (let i = 0; i < this.n_hori; i++) {
            this.cells.push([]);
            for (let ii = 0; ii < this.n_vert; ii++) {
                var l = this.start_left + ii*this.step_size;
                var r = this.start_left + (ii + 1)*this.step_size;
                var t = this.start_top + i*this.step_size;
                var b = this.start_top + (i + 1)*this.step_size;
                this.cells[i].push(new Cell(i, ii, l, r, t, b));
            }
        }
    }
    update_cells() {
        // TODO
    }
    count_cells(player) {
        var counter = 0;
        for (let i = 0; i < this.cells.length; i++) {
            for (let ii = 0; ii < this.cells[i].length; ii++) {
                const cell = this.cells[i][ii];
                if (cell.state == player) {
                    counter++;
                }
            }
        }
        return counter;
    }
    apply_action(col_ind, row_ind) {
        // append to DB --> only new stone to relevant player --> also adjust turn
        DB_call("apply_new_turn", [this.player1, this.player2, col_ind, row_ind, this.turn]);
        // adjust this turn
        if (this.turn == 2) {
            this.turn = 1;
        } else {
            this.turn = 2;
        }

        // set other player to unseen
        DB_call("set_seen", [this.player, this.player1, this.player2]);
        DB_call("set_unseen", [this.player, this.player1, this.player2]);
    }
    set_cells(type_ind, pos_list) {

        for (let index = 0; index < pos_list.length; index++) {
            const pos = pos_list[index];
            this.cells[pos[1]][pos[0]].state = Number(type_ind);
        }

    }
    store_cells() {
        cells_string_player1 = "";
        cells_string_player2 = "";
        cells_string_blocked = "";
        for (let i = 0; i < this.cells.length; i++) {
            for (let ii = 0; ii < this.cells[i].length; ii++) {
                if (this.cells[i][ii].state == 1) {
                    var str = "x" + String(i) + "y" + String(ii);
                    cells_string_player1 += str;
                }
                if (this.cells[i][ii].state == 2) {
                    var str = "x" + String(i) + "y" + String(ii);
                    cells_string_player2 += str;
                }
                if (this.cells[i][ii].state == 3) {
                    var str = "x" + String(i) + "y" + String(ii);
                    cells_string_blocked += str;
                }
            }
        }
        return [cells_string_player1, cells_string_player2, cells_string_blocked];
    }
    set_max(player, counter, i, ii, dir) {
        this.max_nums[player - 1] = counter;
        if (player == 1) {
            this.max_cells[player - 1] = []; // reset
            // fill array, go backwards
            if (dir == 'hori') {
                for (let index = 0; index < this.max_nums[player - 1]; index++) {
                    this.max_cells[player - 1].push(this.cells[i][ii - 1 - index]);
                }
            } else {
                for (let index = 0; index < this.max_nums[player - 1]; index++) {
                    this.max_cells[player - 1].push(this.cells[i - 1- index][ii]);
                }
            }
        } else {
            this.max_cells[player - 1] = []; // reset
            // fill array, go backwards
            if (dir == 'hori') {
                for (let index = 0; index < this.max_nums[player - 1]; index++) {
                    this.max_cells[player - 1].push(this.cells[i][ii - 1 - index]);
                }
            } else {
                for (let index = 0; index < this.max_nums[player - 1]; index++) {
                    this.max_cells[player - 1].push(this.cells[i - 1 - index][ii]);
                }
            }
        }
    }
    set_max_diag(player, diag, start_ind, counter) {
        this.max_nums[player - 1] = counter;
        if (player == 1) {
            this.max_cells[player - 1] = []; // reset
            // fill array, go backwards
            for (let index = 0; index < this.max_nums[player - 1]; index++) {
                const cell = diag[start_ind - index];
                this.max_cells[player - 1].push(this.cells[cell.row_ind][cell.col_ind]);
            }
        } else {
            this.max_cells[player - 1] = []; // reset
            // fill array, go backwards
            for (let index = 0; index < this.max_nums[player - 1]; index++) {
                const cell = diag[start_ind - index];
                this.max_cells[player - 1].push(this.cells[cell.row_ind][cell.col_ind]);
            }
        }
    }
    search_hori(player) {
        // search each row
        for (let i = 0; i < this.n_hori; i++) {
            var started_p = false;
            var p_counter = 0;
            // search each cell in each row
            for (let ii = 0; ii < this.n_vert; ii++) {
                const cell = this.cells[i][ii];
                if (cell.state == player && !started_p) {
                    started_p = true;
                    p_counter = 0; // reset
                }
                if (cell.state == player && started_p) {
                    p_counter++;
                }
                if (cell.state != player && started_p) {
                    started_p = false;
                    // stop counting --> check if > max
                    if (p_counter > this.max_nums[player - 1]) {
                        this.set_max(player, p_counter, i, ii, 'hori');
                    }
                }
            }
            // check case that last cell is set as player's
            if (started_p) {
                started_p = false;
                // stop counting --> check if > max
                if (p_counter > this.max_nums[player - 1]) {
                    this.set_max(player, p_counter, i, this.n_vert, 'hori');
                }
            }
        }
    }
    search_vert(player) {
        // search each column
        for (let ii = 0; ii < this.n_vert; ii++) {
            var started_p = false;
            var p_counter = 0;
            // search each cell in each row
            for (let i = 0; i < this.n_hori; i++) {
                const cell = this.cells[i][ii];
                if (cell.state == player && !started_p) {
                    started_p = true;
                    p_counter = 0; // reset
                }
                if (cell.state == player && started_p) {
                    p_counter++;
                }
                if (cell.state != player && started_p) {
                    started_p = false;
                    // stop counting --> check if > max
                    if (p_counter > this.max_nums[player - 1]) {
                        this.set_max(player, p_counter, i, ii, 'vert');
                    }
                }
            }
            // check case that last cell is set as player's
            if (started_p) {
                started_p = false;
                // stop counting --> check if > max
                if (p_counter > this.max_nums[player - 1]) {
                    this.set_max(player, p_counter, this.n_hori, ii, 'vert');
                }
            }
        }
    }
    search_diag(player) {
        var diags = this.get_diags();
        // search each column
        for (let j = 0; j < diags.length; j++) {
            const diag = diags[j];
            var started_p = false;
            var p_counter = 0;
            // search each cell in each row
            for (let jj = 0; jj < diag.length; jj++) {
                const cell = diag[jj];
                if (cell.state == player && !started_p) {
                    started_p = true;
                    p_counter = 0; // reset
                }
                if (cell.state == player && started_p) {
                    p_counter++;
                }
                if (cell.state != player && started_p) {
                    started_p = false;
                    // stop counting --> check if > max
                    if (p_counter > this.max_nums[player - 1]) {
                        this.set_max_diag(player, diag, jj - 1, p_counter);
                    }
                }
            }
            // check case that last cell is set as player's
            if (started_p) {
                started_p = false;
                // stop counting --> check if > max
                if (p_counter > this.max_nums[player - 1]) {
                    this.set_max_diag(player, diag, diag.length - 1, p_counter);
                }
            }
        }
    }
    get_diags() {

        var diag_cell_array = [];
        var ind_of_diagonal = 0;

        function fill_to_left_bottom(cells, n_hori, n_vert) {
            // push first cell, always valid (but length of diagonal only 1, so actually irrelevant)
            diag_cell_array[ind_of_diagonal].push(cells[outer_ind][inner_ind]);
            while (outer_ind < n_hori - 1 && inner_ind > 0) {
                outer_ind++;
                inner_ind--;
                diag_cell_array[ind_of_diagonal].push(cells[outer_ind][inner_ind]);
            }
            ind_of_diagonal++;
        }

        function fill_to_right_bottom(cells, n_hori, n_vert) {
            // push first cell, always valid (but length of diagonal only 1, so actually irrelevant)
            diag_cell_array[ind_of_diagonal].push(cells[outer_ind][inner_ind]);
            while (outer_ind < n_hori - 1 && inner_ind < n_vert - 1) {
                outer_ind++;
                inner_ind++;
                diag_cell_array[ind_of_diagonal].push(cells[outer_ind][inner_ind]);
            }
            ind_of_diagonal++;
        }

        // DIA DIRECTION 1: to left bottom
        // beginning top left
        for (let ii = 0; ii < this.n_vert; ii++) {
            diag_cell_array.push([]);
            var inner_ind = ii;
            var outer_ind = 0;
            fill_to_left_bottom(this.cells, this.n_hori, this.n_vert);
        }
        // beginning top (+1) right
        for (let i = 1; i < this.n_hori; i++) {
            diag_cell_array.push([]);
            var inner_ind = this.n_vert - 1;
            var outer_ind = i;
            fill_to_left_bottom(this.cells, this.n_hori, this.n_vert);
        }

        // DIA DIRECTION 2: to right bottom
        // beginning bottom left
        for (let i = this.n_hori - 1; i > -1; i--) {
            diag_cell_array.push([]);
            var inner_ind = 0;
            var outer_ind = i;
            fill_to_right_bottom(this.cells, this.n_hori, this.n_vert);
        }
        // beginning top (+1) right
        for (let ii = 1; ii < this.n_vert; ii++) {
            diag_cell_array.push([]);
            var inner_ind = ii;
            var outer_ind = 0;
            fill_to_right_bottom(this.cells, this.n_hori, this.n_vert);
        }

        return diag_cell_array;

    }
    get_max_per_player() {

        this.search_hori(1);
        this.search_vert(1);
        this.search_diag(1);

        this.search_hori(2);
        this.search_vert(2);
        this.search_diag(2);

    }
    apply_game_end(winner) {
        this.active = false;
        // if (this.player_state[this.player - 1] == 0) {
        //     this.refresh(); // for other player to see result
        // }
        game_state = "game_end_options";
        screens[7] = new GameEndOptions(winner);
    }
    check_win_lose() {
        var winner = -1;

        // set player state by counting 
        if (this.max_nums[0] == 3) {
            // player 1 loses
            this.player_state[0] = -1;
            winner = 1;
        }
        if (this.max_nums[1] == 3) {
            // player 2 loses
            this.player_state[1] = -1;
            winner = 0;
        }
        if (this.max_nums[0] == 4) {
            // player 1 wins
            this.player_state[0] = 1;
            winner = 0;
        }
        if (this.max_nums[1] == 4) {
            // player 2 wins
            this.player_state[1] = 1;
            winner = 1;
        }

        // definitely a winner/loser if following is true
        if (this.player_state[0] != 0 || this.player_state[1] != 0) {
            if (winner < 0) { // this means, some one gave up
                if (this.player_state[0] == -1) {
                    this.apply_game_end(1); // player two wins (player 1 gave up)
                } else {
                    this.apply_game_end(0); // player one wins (player 2 gave up)
                }
            } else { // normal case: winner/loser determined by counting cells
                this.apply_game_end(winner);
            }
        }
    }
    reset() {
        // cosmetics
        this.labels = [
            new StaticText(game_state, this.player1, 80, [6, 16], [2, 16]),
            new StaticText(game_state, this.player2, 80, [6, 16], [15, 16]),
        ];
        // menu options
        this.items = [
            new MenuItem("menu", "Back to Menu", 60, [14, 16], [15, 16])
        ]
        this.active = true;
        this.max_nums = [0, 0];
        this.max_cells = [[], []];
        this.player_state = [0, 0]; // -1: lose, 1: win
    }
    refresh() {

        // reload the game parameters
        var splitted_infos = get_game_infos_ongoing_game(this.player1, this.player2);
        // set the stones accordingly
        var player1_stones = decode_coord_pairs(splitted_infos[4]);
        var player2_stones = decode_coord_pairs(splitted_infos[5]);

        // check whether one has given up
        if (player1_stones.length > 0 && player1_stones[player1_stones.length - 1][1].endsWith("gu")) {
            this.player_state[0] = -1;
            var stones_p1_sub = splitted_infos[4].slice(-2, -1);
            var player1_stones = decode_coord_pairs(stones_p1_sub);
            this.apply_game_end(1);
        }
        else if (player2_stones.length > 0 && player2_stones[player2_stones.length - 1][1].endsWith("gu")) {
            this.player_state[1] = -1;
            var stones_p2_sub = splitted_infos[5].slice(-2, -1);
            var player2_stones = decode_coord_pairs(stones_p2_sub);
            this.apply_game_end(0);
        }

        // otherwise proceed normally
        else {
            this.init_cells();
            this.set_cells(1, player1_stones);
            this.set_cells(2, player2_stones);
            this.turn = Number(splitted_infos[6]) + 1;
        }
    }
    update() {

        // only activate cells if game is active
        if (this.active) {
            // only activate cells if it is your turn
            if (this.turn == this.player) {
                if (!this.give_up_option && this.count_cells(this.player) > 0) {
                    this.give_up_option = true;
                    this.items.push(new SpecialFunctionItem("give_up", "Give Up", 60, [14, 16], [2, 16]));
                }
                update_llist(this.cells);
            } else {
                if (this.give_up_option) {
                    this.give_up_option = false;
                    this.items.pop();
                }
                // otherwise, periodically check database changes
                this.counter++;
                if (this.counter > 100) {
                    this.counter = 0;
                    var turn_comp = DB_call("check_if_turn_changed", [this.player1, this.player2], true);
                    if (turn_comp != this.turn - 1) {
                        this.refresh(); // reload the game parameters, set current player as active
                    }
                }
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            this.items[i].update();
        }

        // identify longest line of one player's cells
        this.get_max_per_player();

        // based on that, check if there is a win/lose
        this.check_win_lose(); // TODO stop turns if it happens

    }
    render() {
        // grid
        for (let index = 0; index < this.grid_coords.length; index++) {
            const gc = this.grid_coords[index];
            draw_line(gc, "black");
        }
        // cells
        render_llist(this.cells);
        // menu options
        render_list(this.items);

        // cosmetics
        render_list(this.labels);
        draw_circ({x: 3*canv_w/32, y: canv_h/2}, this.step_size*0.6, true, "black");
        draw_X({x: 29*canv_w/32, y: canv_h/2}, this.step_size*0.6);

        // render the turn (only if game is still running)
        if (this.active) {
            if (this.turn == 1) {
                var p1_tri_pos = get_middle_coord(4, 16, 2, 16);
                draw_tri(80, "l", p1_tri_pos, "black");
                // draw_poly(this.poly_coords_p1, false, "black");
            } else {
                var p2_tri_pos = get_middle_coord(4, 16, 15, 16);
                draw_tri(80, "r", p2_tri_pos, "black");
                // draw_poly(this.poly_coords_p2, false, "black");
            }
        }

        // render maximum cells in sequence if one player wins/loses
        // and adjust turn box accordingly

        var colors = ["red", "limegreen"];

        for (let p = 0; p < this.player_state.length; p++) {
            const ps = this.player_state[p];
            if (ps != 0) {

                var win_ind_conv = (ps + 1)/2;
                var color = colors[win_ind_conv];
                var other_p = 1 - p;
                var other_color = colors[1 - win_ind_conv];

                this.labels[p].color = color;
                this.labels[other_p].color = other_color;
                render_list(this.labels);

                // draw relevant line (break at end --> only line from relevant player)
                for (let index = 0; index < this.max_cells[p].length - 1; index++) {
                    const c1 = this.max_cells[p][index];
                    const c2 = this.max_cells[p][index + 1];
                    draw_line([c1.pos, c2.pos], color, 20);
                }

                this.items = [];

                break;

            }
        }
    }
}

class GameEndOptions        extends InteractiveScreen {
    constructor(winner_ind) {

        // get loser ind
        if (winner_ind == 0) {
            var loser_ind = 1;
        } else {
            var loser_ind = 0;
        }

        var items = [
            new MenuItem("menu", "To Menu",               80, [9, 10], [1 + 4*loser_ind, 5]),
        ];
        super(items);

        this.game_state = "game_end_options"
        this.winner_ind = winner_ind;
        this.loser_ind = loser_ind;

        // only allow losing party to challenge winner again
        // only allow to challenge if player has seen end screen
        this.challenge_possible = false;
        if (this.loser_ind + 1 == screens[6].player) {
            this.check_challenge_possible();
        }

        // player has definitely seen game state
        DB_call("set_seen", [screens[6].player, screens[6].player1, screens[6].player2]);
        DB_call("set_end", [screens[6].player, screens[6].player1, screens[6].player2]);

        // only remove game from DB if state of both players is seen
        this.game_removed = false;
        this.check_remove_game();

        this.counter = 0;
    }
    check_challenge_possible() {
        var check_game = DB_call("check_game_exists", [screens[6].player1, screens[6].player2], true);
        if (check_game == "false") { // means that both players have seen end state, therefore game not in DB anymore
            // TODO possible overlap if other person challenges first - give someone priority
            this.challenge_possible = true;
            this.items.push(new SpecialFunctionItem("challenge_player", "Challenge", 80, [9, 10], [1 + 4*this.winner_ind, 5]));
        }
    }
    check_remove_game() {
        var end_check = DB_call("check_end_seen", [screens[6].player1, screens[6].player2], true);
        if (end_check=="true") {
            // len > 1 because there should be stones in finished game
            this.game_removed = true;
            DB_call("remove_finished_game", [screens[6].player1, screens[6].player2]);
            // store data for highscores
            DB_call("assess_finished_game", [screens[6].player1, screens[6].player2, this.winner_ind]);
        }
    }
    set_players_winning_party() {
        if (game.player == 1) {
            screens[6].player1 = screens[6].player2;
            screens[6].player2 = logged_in_name;
        }
        screens[6].player = 2;        // winner always right
    }
    check_challenged() {
        var end_check = DB_call("check_end_seen", [screens[6].player1, screens[6].player2], true);
        var empty_check = DB_call("check_empty", [screens[6].player1, screens[6].player2], true);
        if (end_check == "true" || empty_check == "true") {
            this.set_players_winning_party();
            screens[6].reset();       // game is not lost/won anymore but active again
            screens[6].refresh();     // load game parameters from DB (empty board)
            screens[6].turn = 2;      // winning party starts
            game_state = "game";
        }
    }
    update() {

        // update items
        update_list(this.items);

        // ensure DB checks do not happen each frame
        this.counter++;
        if (this.counter == 100) {
            this.counter = 0;

            // check for game removal
            if (!this.game_removed) {
                this.check_remove_game();
            }

            // check DB access if new game (winning party)
            if (this.winner_ind + 1 == screens[6].player) {
                this.check_challenged();
            }

            // check DB if other player has seen game end state
            if (this.loser_ind + 1 == screens[6].player) {
                if (!this.challenge_possible) {
                    this.check_challenge_possible();
                }
            }
        }
    }
    render() {
        render_list(this.items);
    }
}

class Rules                 extends InteractiveScreen {
    constructor() {
        if (canv_w > canv_h) {
            var items = [
                new StaticText(game_state, "Put 4 of your stones in a row, column or diagonal.",                                 50, [2, 10], [1, 1]),
                new StaticText(game_state, "Avoid putting 3 of your stones in a row, column or diagonal.",                       50, [3, 10], [1, 1]),
                new StaticText(game_state, "Stop your opponent from putting 4 of his/her stones in a row, column or diagonal.",  50, [4, 10], [1, 1]),
                new StaticText(game_state, "Fool your opponent into putting 3 of his/her stones in a row, column or diagonal.",  50, [5, 10], [1, 1]),
                new StaticText(game_state, "Have fun!",                                                                          50, [7, 10], [1, 1]),
                new MenuItem("menu", "Go Back to Menu",                                                                          60, [9, 10], [1, 1]),
            ];
        } else {
            var items = [
                new StaticText(game_state, "Put 4 of your stones in a row,",            40, [1, 20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [2, 20], [1, 1]),
                new StaticText(game_state, "Avoid putting 3 of your stones",            40, [3, 20], [1, 1]),
                new StaticText(game_state, "in a row, column or diagonal.",             40, [4, 20], [1, 1]),
                new StaticText(game_state, "Stop your opponent from",                   40, [5, 20], [1, 1]),
                new StaticText(game_state, "putting 4 of his",                          40, [6, 20], [1, 1]),
                new StaticText(game_state, "/her stones in a row,",                     40, [7, 20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [8, 20], [1, 1]),
                new StaticText(game_state, "Fool your opponent into",                   40, [9 ,20], [1, 1]),
                new StaticText(game_state, "putting 3 of his",                          40, [10,20], [1, 1]),
                new StaticText(game_state, "/her stones in a row,",                     40, [11,20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [12,20], [1, 1]),
                new StaticText(game_state, "Have fun!",                                 50, [7, 10], [1, 1]),
                new MenuItem("menu", "Go Back to Menu",                                 60, [9, 10], [1, 1]),
            ];
        }
        super(items);
        this.game_state = "rules";
    }
    update() {
        if (canv_w > canv_h) {
            this.items = [
                new StaticText(game_state, "Put 4 of your stones in a row, column or diagonal.",                                 50, [2, 10], [1, 1]),
                new StaticText(game_state, "Avoid putting 3 of your stones in a row, column or diagonal.",                       50, [3, 10], [1, 1]),
                new StaticText(game_state, "Stop your opponent from putting 4 of his/her stones in a row, column or diagonal.",  50, [4, 10], [1, 1]),
                new StaticText(game_state, "Fool your opponent into putting 3 of his/her stones in a row, column or diagonal.",  50, [5, 10], [1, 1]),
                new StaticText(game_state, "Have fun!",                                                                          50, [7, 10], [1, 1]),
                new MenuItem("menu", "Go Back to Menu",                                                                          60, [9, 10], [1, 1]),
            ];
        } else {
            this.items = [
                new StaticText(game_state, "Put 4 of your stones in a row,",            40, [1, 20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [2, 20], [1, 1]),
                new StaticText(game_state, "Avoid putting 3 of your stones",            40, [3, 20], [1, 1]),
                new StaticText(game_state, "in a row, column or diagonal.",             40, [4, 20], [1, 1]),
                new StaticText(game_state, "Stop your opponent from",                   40, [5, 20], [1, 1]),
                new StaticText(game_state, "putting 4 of his",                          40, [6, 20], [1, 1]),
                new StaticText(game_state, "/her stones in a row,",                     40, [7, 20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [8, 20], [1, 1]),
                new StaticText(game_state, "Fool your opponent into",                   40, [9 ,20], [1, 1]),
                new StaticText(game_state, "putting 3 of his",                          40, [10,20], [1, 1]),
                new StaticText(game_state, "/her stones in a row,",                     40, [11,20], [1, 1]),
                new StaticText(game_state, "column or diagonal.",                       40, [12,20], [1, 1]),
                new StaticText(game_state, "Have fun!",                                 50, [7, 10], [1, 1]),
                new MenuItem("menu", "Go Back to Menu",                                 60, [9, 10], [1, 1]),
            ];
        }
        super.update();
    }
}

class Options               extends InteractiveScreen {
    constructor() {
        var items = [
            new StaticText(game_state, "Number of rows:",           50, [2, 10], [1, 1]),
            new ValueSelector(4, 16, n_hori, 8,                         [3, 10], [1, 1]),
            new StaticText(game_state, "Number of columns:",        50, [4, 10], [1, 1]),
            new ValueSelector(4, 16, n_vert, 8,                         [5, 10], [1, 1]),
            new MenuItem("menu", "Go Back to Menu",                 60, [9, 10], [1, 1]),
        ];
        super(items);
        this.game_state = "options";
        this.n_hori = 4;
        this.n_vert = 4;
    }
}

class Highscores            extends InteractiveScreen {
    constructor() {
        var items = [
            new StaticText(game_state, "HIGHSCORES", 80, [1, 10], [1, 5]),
            new MenuItem("menu", "Go Back to Menu", 60, [9, 10], [1, 1]),
        ];
        super(items);
        this.base_items = items;
        this.game_state = "highscores";
        // this.counter = 0;
        this.get_highscores();
    }
    get_highscores() {
        this.counter = 0;
        // get the 10 highest scoring players
        var hs_str = DB_call("get_highscores", [], true);
        this.best_names = order_highscores(hs_str);

        // get new static items to plot
        var new_static_items = [];
        const n_cats = this.best_names.length;
        for (let cat_ind = 0; cat_ind < n_cats; cat_ind++) {
            var league = this.best_names[cat_ind];
            var current_fontsize = 30 + cat_ind*20;
            const ll = [2 + 4*(n_cats - (cat_ind + 1)), 8 + 4*(n_cats - (cat_ind + 1))];
            for (let player_ind = 0; player_ind < league.length; player_ind++) {
                var player = league[player_ind][0];
                current_fontsize -= player_ind*10;
                const item = new StaticText(game_state, player, current_fontsize, [ll[0] + player_ind, ll[1]], [cat_ind + 1, n_cats]);
                new_static_items.push(item);
            }
        }
        this.items = this.base_items.concat(new_static_items);
    }
    update() {
        super.update(); // update_list(this.items);
        // this.counter++;
        // if (this.counter > 100) {
            
        // }
    }
}




// TODO change in ALL relevant PHP files reg. SQL game selections:
// agnostic to player order (player1, player2)