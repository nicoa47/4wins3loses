<<<<<<< HEAD
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
            game_state = this.target_state;
        }
    }
    update() {
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

class StaticText extends MenuItem {
    constructor(target_state, label, size, line_of_lines, col_of_cols) {
        super(target_state, label, size, line_of_lines, col_of_cols);
    }
    update() {
        // do nothing
    }
}

class Menu {
    constructor(items) {
        this.items = items;
    }
    update() {
        update_list(this.items);
    }
    render() {
        render_list(this.items);
    }
}

class Rules {
    constructor(lines) {
        this.lines = lines;
    }
    update() {
        update_list(this.lines);
    }
    render() {
        render_list(this.lines);
    }
=======
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
            game_state = this.target_state;
        }
    }
    update() {
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

class StaticText extends MenuItem {
    constructor(target_state, label, size, line_of_lines, col_of_cols) {
        super(target_state, label, size, line_of_lines, col_of_cols);
    }
    update() {
        // do nothing
    }
}

class Menu {
    constructor(items) {
        this.items = items;
    }
    update() {
        update_list(this.items);
    }
    render() {
        render_list(this.items);
    }
}

class Rules {
    constructor(lines) {
        this.lines = lines;
    }
    update() {
        update_list(this.lines);
    }
    render() {
        render_list(this.lines);
    }
>>>>>>> 14a316017873a057223248cb8b52a71b5f382a47
}