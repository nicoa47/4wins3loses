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
