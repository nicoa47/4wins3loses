var canvas = document.getElementById("GameCanvas");
var ctx = canvas.getContext("2d");
// set the canvas dimensions to the full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// init global vars storing initial dimensions that canvas can get scaled
var canv_w = canvas.width;
var canv_h = canvas.height;

// TODO implement zooming

function display_text(label, line, n_lines, col, n_cols, size, color) {
    ctx.beginPath();
    // derive the coord by getting ys of line given the size
    var AABB = get_text_AABB(line, n_lines, col, n_cols);
    ctx.font = String(size)+"px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    var xpos = middle(AABB[0].x, AABB[1].x);
    var ypos = middle(AABB[0].y, AABB[1].y) + size/2;
    ctx.fillText(label, xpos, ypos);
    ctx.closePath();
}