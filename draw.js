var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
// set the canvas dimensions to the full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var current_scale = 1; // keeping track of scale
var current_translate = {x: 0, y: 0}; // keeping track of translation
var canv_w;
var canv_h;
// init_initial_ctx_dims
if (window.innerWidth/window.innerHeight > 1920/1080) {
    canv_h = window.innerHeight;
    canv_w = (1920/1080)*canv_h;
} else {
    canv_w = window.innerWidth;
    canv_h = (1080/1920)*canv_w;
}

function resize() {
    // keep ratio of 1920:1080, add white PAL bars if needed
    // case 1: ratio larger --> add PAL to left and right
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth/window.innerHeight > 1920/1080) {
        // WINDOW IS WIDER
        // set the scale such that canvas height matches window height
        current_scale = canvas.height / canv_h;
        // set the transform such that context is centered
        current_translate.x = (window.innerWidth - canv_w*current_scale)/2;
        current_translate.y = 0;
    } else {
        // WINDOW IS TALLER
        // set the scale such that canvas width matches window width
        current_scale = canvas.width / canv_w;
        // current_scale.y = current_scale.x;//(1080/1920)*current_scale.x;
        current_translate.x = 0;
        current_translate.y = (window.innerHeight - canv_h*current_scale)/2;
    }
	ctx.setTransform(current_scale, 0, 0, current_scale, current_translate.x, current_translate.y);
}
// call resize once, then set the fixed canv_w, canv_h again
resize();

// TODO implement zooming

function fill_canvas(color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canv_w, canv_h);
    ctx.closePath();
}

function display_text(label, line, n_lines, col, n_cols, size, color) {
    ctx.beginPath();
    // derive the coord by getting ys of line given the size
    var AABB = get_text_AABB(line, n_lines, col, n_cols);
    // size standardized by height
    size *= (canv_h/1080);
    ctx.font = String(size)+"px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    var xpos = middle(AABB[0].x, AABB[1].x);
    var ypos = middle(AABB[0].y, AABB[1].y) + size/2;
    ctx.fillText(label, xpos, ypos);
    ctx.closePath();
}