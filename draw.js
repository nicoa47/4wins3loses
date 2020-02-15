var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
// set the canvas dimensions to the full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var current_scale = 1; // keeping track of scale
var current_translate = {x: 0, y: 0}; // keeping track of translation
var canv_w;
var canv_h;
var smaller_dim;
var larger_dim; 
var prev_orient;

// init_initial_ctx_dims
function init_initial_ctx_dims() {
    if (window.innerWidth/window.innerHeight > 1) { // 1920/1080
        canv_h = window.innerHeight; // fitting dimension
        canv_w = (1920/1080)*canv_h; // derived dimension
        prev_orient = "h";
    } else {
        canv_w = window.innerWidth; // fitting dimension
        canv_h = (1920/1080)*canv_w; // derived dimension
        prev_orient = "v";
    }
    smaller_dim = Math.min(canv_w, canv_h);
    larger_dim  = Math.max(canv_w, canv_h);
}

// TODO init two latent kinds of item arrangements, AABBs for menu items etc.
// activated when there is a orientation change

init_initial_ctx_dims();

function resize() {
    // keep ratio of 1920:1080
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // TODO replace with function that just checks for orientation change
    init_initial_ctx_dims();

    current_translate.x = 0;
    current_translate.y = 0;

    if (window.innerWidth/window.innerHeight > 1) {
        // WINDOW IS WIDER
        if (window.innerWidth/window.innerHeight > 1920/1080) {
            current_scale = canvas.height / canv_h;
            current_translate.x = (window.innerWidth - canv_w*current_scale)/2;
        } else {
            current_scale = canvas.width / canv_w;
            current_translate.y = (window.innerHeight - canv_h*current_scale)/2;
        }
    } else {
        // WINDOW IS TALLER
        if (window.innerHeight/window.innerWidth > 1920/1080) {
            current_scale = canvas.width / canv_w;
            current_translate.y = (window.innerHeight - canv_h*current_scale)/2;
        } else {
            current_scale = canvas.height / canv_h;
            current_translate.x = (window.innerWidth - canv_w*current_scale)/2;
        }
    }
	ctx.setTransform(current_scale, 0, 0, current_scale, current_translate.x, current_translate.y);
}
// call resize once, then set the fixed canv_w, canv_h again
resize();

// TODO implement zooming

function clear_canvas() {
    // ctx.clearRect(0, 0, canv_w, canv_h)
    var start_w = -current_translate.x/current_scale; // -(window.innerWidth - canv_w)/2;
    var start_h = -current_translate.y/current_scale; // -(window.innerHeight - canv_h)/2;
    ctx.clearRect(start_w, start_h, window.innerWidth/current_scale, window.innerHeight/current_scale);

}

function clear_window() {
    ctx.clearRect(-1000, 0, window.innerWidth, window.innerHeight);
}

function fill_canvas(color) {
    ctx.beginPath();
    // ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canv_w, canv_h);
    ctx.closePath();
}

function draw_line(coords, color, thickness=5) {
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    ctx.lineTo(coords[1].x, coords[1].y);
    ctx.lineWidth = thickness*(canv_h/1080);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function draw_X(pos, size) {
    var l1 = []
    l1.push({x: pos.x - size/2, y: pos.y - size/2});
    l1.push({x: pos.x + size/2, y: pos.y + size/2});
    var l2 = []
    l2.push({x: pos.x + size/2, y: pos.y - size/2});
    l2.push({x: pos.x - size/2, y: pos.y + size/2});
    draw_line(l1, "black");
    draw_line(l2, "black");
}

function draw_circ(pos, size, filled, color) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size/2, 0, 2*Math.PI);
    if (filled) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.fill();
    } else {
        ctx.lineWidth = 5*(canv_h/1080);
        ctx.strokeStyle = color;
        ctx.stroke;
    }
    ctx.stroke(); 
    ctx.closePath();
}

function fill_cell(pos, size, color) {
    var coords = [];
    coords.push({x: pos.x - size/2, y: pos.y - size/2});
    coords.push({x: pos.x - size/2, y: pos.y + size/2});
    coords.push({x: pos.x + size/2, y: pos.y + size/2});
    coords.push({x: pos.x + size/2, y: pos.y - size/2});
    draw_poly(coords, true, color);
}

function draw_poly(coords, filled, color, thickness=5) {
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let index = 1; index < coords.length; index++) {
        const c = coords[index];
        ctx.lineTo(c.x, c.y);
    }
    ctx.lineTo(coords[0].x, coords[0].y);
    if (filled) {
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.lineWidth = thickness*(canv_h/1080);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    ctx.closePath();
}

function draw_tri(size, dir, pos, color, filled=true) {
    var coords = [];
    // size standardized by height
    size *= (canv_h/1080);
    var top = pos.y - size/2;
    var bottom = pos.y + size/2;
    var left = pos.x - size/2;
    var right = pos.x + size/2;
    if (dir == "l") {
        coords.push({x: left, y: pos.y});
        coords.push({x: right, y: top});
        coords.push({x: right, y: bottom});
    }
    else if (dir == "r") {
        coords.push({x: right, y: pos.y});
        coords.push({x: left, y: top});
        coords.push({x: left, y: bottom});
    }
    else if (dir == "u") {
        coords.push({x: pos.x, y: top});
        coords.push({x: right, y: bottom});
        coords.push({x: left, y: bottom});
    }
    else if (dir == "d") {
        coords.push({x: right, y: top});
        coords.push({x: left, y: top});
        coords.push({x: pos.x, y: bottom});
    }
    draw_poly(coords, filled, color);
}

function display_text(label, line, n_lines, col, n_cols, size, color, font="Arial") {
    ctx.beginPath();
    // derive the coord by getting ys of line given the size
    var AABB = get_text_AABB(line, n_lines, col, n_cols);
    // size standardized by height
    size *= (canv_h/1080);
    ctx.font = String(size)+"px "+font;
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    var xpos = middle(AABB[0].x, AABB[1].x);
    var ypos = middle(AABB[0].y, AABB[1].y) + size/2;
    ctx.fillText(label, xpos, ypos);
    ctx.closePath();
}

function get_text_AABB_OLD(label, line, n_lines, col, n_cols, size) {
    ctx.beginPath();
    // derive the coord by getting ys of line given the size
    var AABB = get_text_AABB(line, n_lines, col, n_cols);
    // size standardized by smaller dimension height
    size *= (canv_h/1080);
    ctx.font = String(size)+"px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    var xpos = middle(AABB[0].x, AABB[1].x);
    var ypos = middle(AABB[0].y, AABB[1].y) + size/2;
    ctx.fillText(label, xpos, ypos);
    ctx.closePath();
}