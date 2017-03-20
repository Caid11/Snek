// Scaling factor for the game board
var scalingFactor = 25;

// The current direction of travel for the snake.
var currentDirection = 'right';

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

var inDeathScreen = false;

var body = [{'xPos': 3, 'yPos': 1}, {'xPos': 2, 'yPos': 1}, {'xPos': 1, 'yPos': 1}];

var score = 0;

function setScoreText(newScore) {
    var scorePoint = new Point(view.size.width - 14, 34);
    var scoreText = new PointText(scorePoint);
    scoreText.fontSize = 24;
    scoreText.justification = 'right';
    scoreText.fillColor = '#d3dae5';
    scoreText.fontWeight = 'bold';
    scoreText.content = newScore;
}

function getFoodLocation() {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var foodPoint = maxPoint * randomPoint;
    foodXPosition = Math.floor(foodPoint.x / scalingFactor);
    foodYPosition = Math.floor(foodPoint.y / scalingFactor);
    // Check that the food hasn't spawned on any part of the snake. If it has,
    // respawn the food.
    for (var i = 0; i < body.length; i++) {
        if (body[i].xPos === foodXPosition & body[i].yPos === foodYPosition) {
            console.log('respawning food');
            getFoodLocation();
            return;
        }
    }
}
getFoodLocation();

function showTitleText() {
    var midPoint = new Point(view.size.width / 2, view.size.height / 2);
    var titleText = new PointText(midPoint);
    titleText.justification = 'center';
    titleText.fontSize = 96;
    titleText.fontWeight = 'bold';
    titleText.content = 'Feed Snek';
    titleText.fillColor = '#d3dae5';
    while (!titleText.isInside(view.bounds)) {
        titleText.fontSize -= 10;
    }

    var instructionPoint = midPoint + new Point(0, titleText.fontSize / 2);
    var instructionText = new PointText(instructionPoint);
    instructionText.justification = 'center';
    instructionText.fontSize = titleText.fontSize / 2;
    instructionText.content = 'Press space to play';
    instructionText.fillColor = '#d3dae5';
}
showTitleText();

function showDeathScreen(score) {
    var midPoint = new Point(view.size.width / 2, view.size.height / 2);
    var mainText = new PointText(midPoint);
    mainText.justification = 'center';
    mainText.fontSize = 96;
    mainText.fontWeight = 'bold';
    mainText.content = 'Snek is Kill';
    mainText.fillColor = '#d3dae5';
    while (!mainText.isInside(view.bounds)) {
        mainText.fontSize -= 10;
    }

    var subPoint = midPoint + new Point(0, mainText.fontSize / 2);
    var subText = new PointText(subPoint);
    subText.justification = 'center';
    subText.fontSize = mainText.fontSize / 2;
    if (score > 1 || score === 0) {
        subText.content = 'You scored ' + score + ' points. Play again?';
    } else {
        subText.content = 'You scored ' + score + ' point. Play again?';
    }
    subText.fillColor = '#d3dae5';
    while (!subText.isInside(view.bounds)) {
        subText.fontSize -= 10;
    }

}


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
        score++;
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

    // Update the score.
    setScoreText(score);
}

function endGame() {
    // Stop the execution of the game loop.
    clearInterval(gameInterval);
    baseSpeed = 250;

    // Clear the canvas.
    project.clear();

    currentDirection = 'right';

    // Reset the values for the snake and food.
    for (var i = 0; i < 3; i++) {
        body[i].xPos = 3 - i;
        body[i].yPos = 1;
    }
    body.splice(3);
    getFoodLocation();

    // Display the title text.
    showDeathScreen(score);

    score = 0;

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
          !isOppositeDirection(event.key, currentDirection) &&
          gameStarted) {
        currentDirection = event.key;
    } else if (event.key === 'space') {
        if (!gameStarted) {
            gameInterval = setInterval(gameLoop, baseSpeed);
            gameStarted = true;
        }
    }
}