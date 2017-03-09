// Scaling factor for the game board
var SCALING_FACTOR = 25;

// The position of the "head" of the snake
var headXPosition = 1;
var headYPosition = 1;

// The current direction of travel for the snake.
var currentDirection = 'right';

// The speed at which the game is played (increases as the player eats more food).
var gameSpeed = 1;

// The game's "base speed"
var BASE_SPEED = 1000;

var id = setInterval(function() {
    // Clear the canvas.
    project.clear();

    // Move the "head" according to the current direction.
    console.log(currentDirection);
    if (currentDirection === 'right') {
        headXPosition += 1;
    } else if (currentDirection === 'left') {
        headXPosition -= 1;
    } else if (currentDirection === 'up') {
        headYPosition -= 1;
    } else if (currentDirection === 'down') {
        headYPosition += 1;
    }

    // Draw the head of the snake.
    var rect = new Path.Rectangle(new Point(headXPosition * SCALING_FACTOR, headYPosition * SCALING_FACTOR), 25);
    rect.fillColor = '#d3dae5';
}, BASE_SPEED);

/**
 * Update the snake head's direction based on the key press.
 */
tool.onKeyDown = function(event) {
    if (event.key === 'up' || event.key === 'down' ||
          event.key === 'left' || event.key === 'right') {
        currentDirection = event.key;
        console.log(currentDirection);
    }
}