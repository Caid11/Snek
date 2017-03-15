// Scaling factor for the game board
var scalingFactor = 25;

// The current direction of travel for the snake.
var currentDirection = 'right';

// The speed at which the game is played (increases as the player eats more food).
var gameSpeed = 1;

// The game's "base speed"
var baseSpeed = 250;

// The current location of the snake's food.
var foodXPosition = null;
var foodYPosition = null;

// The top and right edges of the game board
var maxXPosition = view.size.width / 25;
var maxYPosition = view.size.height / 25;

// The main loop for the game.
var gameInterval = null;

// Whether or not the game is currently running.
var gameStarted = false;

function getFoodLocation() {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var foodPoint = maxPoint * randomPoint;
    foodXPosition = Math.floor(foodPoint.x / scalingFactor);
    foodYPosition = Math.floor(foodPoint.y / scalingFactor);
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

function gameLoop() {
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
        if (baseSpeed > 100) {
            clearInterval(gameInterval);
            baseSpeed -= 10;
            gameInterval = setInterval(gameLoop, baseSpeed);
        }
    }

    // Make sure the player hasn't died.
    if (body[0].xPos >= maxXPosition || body[0].yPos >= maxYPosition
            || body[0].xPos < 0 || body[0].yPos < 0) {
        endGame();
        return;
    }
    for (var i = 1; i < body.length; i++) {
        if (body[i].xPos === body[0].xPos && body[i].yPos === body[0].yPos) {
            endGame();
            return;
        }
    }

    // Draw the snake
    for (var i = body.length - 1; i > 1; i--) {
        var newXPos = body[i - 1].xPos;
        var newYPos = body[i - 1].yPos;
        body[i].xPos = newXPos;
        body[i].yPos = newYPos;
        var rect = new Path.Rectangle(new Point(body[i].xPos * scalingFactor, body[i].yPos * scalingFactor), 25);
        rect.fillColor = '#5faf60';
    }
    if (body.length > 1) {
        body[1].xPos = prevHeadX;
        body[1].yPos = prevHeadY;
        var rect = new Path.Rectangle(new Point(body[1].xPos * scalingFactor, body[1].yPos * scalingFactor), 25);
        rect.fillColor = '#5faf60';

    }

    var rect = new Path.Rectangle(new Point(body[0].xPos * scalingFactor, body[0].yPos * scalingFactor), 25);
    rect.fillColor = '#5faf60';

    // Draw the current food.
    var food = new Path.Rectangle(new Point(foodXPosition * scalingFactor, foodYPosition * scalingFactor), 25);
    food.fillColor = '#d3dae5';
}

function endGame() {
    // Stop the execution of the game loop.
    clearInterval(gameInterval);
    baseSpeed = 250;

    // Clear the canvas.
    project.clear();

    currentDirection = 'right';

    // Reset the values for the snake and food.
    body[0].xPos = 1;
    body[0].yPos = 1;
    body.splice(1);
    getFoodLocation();

    gameStarted = false;
}

var opposites = {
    'left': 'right',
    'right': 'left',
    'up': 'down',
    'down': 'up'
};

function isOppositeDirection(newDirection, currentDirection) {
    return newDirection === opposites[currentDirection];
}

/**
 * Update the snake head's direction based on the key press.
 */
tool.onKeyDown = function(event) {
    if ((event.key === 'up' || event.key === 'down' ||
          event.key === 'left' || event.key === 'right') &&
          !isOppositeDirection(event.key, currentDirection)) {
        currentDirection = event.key;
    } else if (event.key === 'space') {
        if (!gameStarted) {
            gameInterval = setInterval(gameLoop, baseSpeed);
            gameStarted = true;
        }
    }
}