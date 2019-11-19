// coord: {x: x_val, y: y_val}

function coord(x_val, y_val) {
    return {x: x_val, y: y_val};
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

// test!
display_text("AAAHH", 1, 4, 1, 4, 30, "black");
display_text("AAAHH", 2, 4, 2, 4, 30, "blue");
display_text("AAAHH", 3, 4, 3, 4, 30, "grey");