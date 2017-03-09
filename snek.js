function findScalingFactor() {
    // Make the snake 25 pixels big. Then, make it smaller or larger to fit the screen bigger.
    var initialSize = 25;
    var horizontalLeftOver = view.size.width % 25;
    var verticalLeftOver = view.size.height % 25;
    var horizontalWidth = Math.floor(view.size.width / 25);
    var verticalHeight = Math.floor(view.size.height / 25);
    var horizontalAddAmount = horizontalLeftOver / horizontalWidth;
    var verticalAddAmount = verticalLeftOver / verticalHeight;
    var addAmount = Math.round((horizontalAddAmount + verticalAddAmount) / 2);
    return addAmount + initialSize;
}

// Scaling factor for the game board
var scalingFactor = findScalingFactor();

// The current direction of travel for the snake.
var currentDirection = 'right';

// The speed at which the game is played (increases as the player eats more food).
var gameSpeed = 1;

// The game's "base speed"
var BASE_SPEED = 1000;

// Whether or not the game is currently running.
var gameStarted = false;

// The current location of the snake's food.
var foodXPosition = null;
var foodYPosition = null;

function getFoodLocation() {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var foodPoint = maxPoint * randomPoint;
    foodXPosition = Math.round(foodPoint.x / scalingFactor);
    foodYPosition = Math.round(foodPoint.y / scalingFactor);
}
getFoodLocation();

var body = [{'xPos': 0, 'yPos': 0}];

function addBodySegment() {
    var newSegment = {'xPos': 0, 'yPos': 0};
    var direction = null;

    var lastSegment = body[body.length - 1];

    if (body.length === 1) {
        direction = currentDirection;
    } else {
        var secondToLast = body[body.length - 2];

        if (lastSegment.xPos < secondToLast.xPos) {
            direction = 'right';
        } else if (lastSegment.xPos > secondToLast.xPos) {
            direction = 'left';
        } else if (lastSegment.yPos > secondToLast.yPos) {
            direction = 'up';
        } else {
            direction = 'down';
        }
    }
    if (direction === 'right') {
        newSegment.xPos = lastSegment.xPos - 1;
        newSegment.yPos = lastSegment.yPos;
    } else if (direction === 'left') {
        newSegment.xPos = lastSegment.xPos + 1;
        newSegment.yPos = lastSegment.yPos;
    } else if (direction === 'up') {
        newSegment.xPos = lastSegment.xPos;
        newSegment.yPos = lastSegment.yPos - 1;
    } else if (direction === 'down') {
        newSegment.xPos = lastSegment.xPos;
        newSegment.yPos = lastSegment.yPos + 1;
    }
    body.push(newSegment);
}

var id = setInterval(function() {
    if (gameStarted) {
        // Clear the canvas.
        project.clear();

        // Move the "head" according to the current direction.
        var prevHeadX = body[0].xPos;
        var prevHeadY = body[0].yPos;
        if (currentDirection === 'right') {
            body[0].xPos += 1;
        } else if (currentDirection === 'left') {
            body[0].xPos -= 1;
        } else if (currentDirection === 'up') {
            body[0].yPos -= 1;
        } else if (currentDirection === 'down') {
            body[0].yPos += 1;
        }

        // Check if the player has eaten some food.
        if (body[0].xPos === foodXPosition && body[0].yPos === foodYPosition) {
            getFoodLocation();
            addBodySegment();
        }

        // Draw the snake
        for (var i = body.length - 1; i > 1; i--) {
            var newXPos = body[i - 1].xPos;
            var newYPos = body[i - 1].yPos;
            body[i].xPos = newXPos;
            body[i].yPos = newYPos;
            var rect = new Path.Rectangle(new Point(body[i].xPos * scalingFactor, body[i].yPos * scalingFactor), 25);
            rect.fillColor = '#d3dae5';
        }
        if (body.length > 1) {
            body[1].xPos = prevHeadX;
            body[1].yPos = prevHeadY;
            var rect = new Path.Rectangle(new Point(body[1].xPos * scalingFactor, body[1].yPos * scalingFactor), 25);
            rect.fillColor = '#d3dae5';

        }

        var rect = new Path.Rectangle(new Point(body[0].xPos * scalingFactor, body[0].yPos * scalingFactor), 25);
        rect.fillColor = '#d3dae5';

        // Draw the current food.
        var food = new Path.Rectangle(new Point(foodXPosition * scalingFactor, foodYPosition * scalingFactor), 25);
        food.fillColor = '#d3dae5';
    }
}, BASE_SPEED);

/**
 * Update the snake head's direction based on the key press.
 */
tool.onKeyDown = function(event) {
    if (event.key === 'up' || event.key === 'down' ||
          event.key === 'left' || event.key === 'right') {
        currentDirection = event.key;
    } else if (event.key === 'space') {
        if (!gameStarted) {
            gameStarted = true;
        }
    }
}