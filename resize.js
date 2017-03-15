let canvas = document.querySelector('#canvas');

let currentWidth = canvas.offsetWidth;
let extraWidth = currentWidth % 25;
let newWidth = currentWidth - extraWidth - 50;

let currentHeight = canvas.offsetHeight;
let extraHeight = currentHeight % 25;
let newHeight = currentHeight - extraHeight - 50;

canvas.style.width = newWidth + 'px';
canvas.style.height = newHeight + 'px';
