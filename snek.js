var scalingFactor = 25;

var baseSpeed = 250;

var foodXPosition = null;
var foodYPosition = null;

var maxXPosition = view.size.width / 25;
var maxYPosition = view.size.height / 25;

var game = {
    score: 0,
    gameStarted: false,
    gameInterval: null
}

var snake = {
    currentDirection: 'right',
    nextDirection: 'right',
    body: [
        {'xPos': 3, 'yPos': 1},
        {'xPos': 2, 'yPos': 1},
        {'xPos': 1, 'yPos': 1}
    ]
}

var food = {
    xPos: null,
    yPos: null
}

/**
 * Run through one step of the game loop.
 *
 * Handle the snake's movement, food generation and depletion (i.e. getting eaten by
 * the snake), and game board rendering.
 */
function gameLoop() {
    // Clear the canvas.
    project.clear();

    // Move the "head" according to the current direction.
    var prevHeadX = snake.body[0].xPos;
    var prevHeadY = snake.body[0].yPos;
    if (snake.nextDirection === 'right') {
        snake.body[0].xPos += 1;
    } else if (snake.nextDirection === 'left') {
        snake.body[0].xPos -= 1;
    } else if (snake.nextDirection === 'up') {
        snake.body[0].yPos -= 1;
    } else if (snake.nextDirection === 'down') {
        snake.body[0].yPos += 1;
    }

    // Check if the player has eaten some food.
    if (snake.body[0].xPos === food.xPos && snake.body[0].yPos === food.yPos) {
        getFoodLocation();
        addBodySegment();
        game.score++;
        if (baseSpeed > 100) {
            clearInterval(game.gameInterval);
            baseSpeed -= 10;
            game.gameInterval = setInterval(gameLoop, baseSpeed);
        }
    }

    // Make sure the player hasn't died.
    if (snake.body[0].xPos >= maxXPosition || snake.body[0].yPos >= maxYPosition
            || snake.body[0].xPos < 0 || snake.body[0].yPos < 0) {
        endGame();
        return;
    }
    for (var i = 1; i < snake.body.length; i++) {
        if (snake.body[i].xPos === snake.body[0].xPos && snake.body[i].yPos === snake.body[0].yPos) {
            endGame();
            return;
        }
    }

    // Draw the snake
    for (var i = snake.body.length - 1; i > 1; i--) {
        var newXPos = snake.body[i - 1].xPos;
        var newYPos = snake.body[i - 1].yPos;
        snake.body[i].xPos = newXPos;
        snake.body[i].yPos = newYPos;
        var rect = new Path.Rectangle(new Point(snake.body[i].xPos * scalingFactor, snake.body[i].yPos * scalingFactor), 25);
        rect.fillColor = '#5faf60';
    }
    if (snake.body.length > 1) {
        snake.body[1].xPos = prevHeadX;
        snake.body[1].yPos = prevHeadY;
        var rect = new Path.Rectangle(new Point(snake.body[1].xPos * scalingFactor, snake.body[1].yPos * scalingFactor), 25);
        rect.fillColor = '#5faf60';

    }

    var rect = new Path.Rectangle(new Point(snake.body[0].xPos * scalingFactor, snake.body[0].yPos * scalingFactor), 25);
    rect.fillColor = '#5faf60';

    // Draw the current food.
    var foodSquare = new Path.Rectangle(new Point(food.xPos * scalingFactor, food.yPos * scalingFactor), 25);
    foodSquare.fillColor = '#d3dae5';

    // Update the score.
    setScoreText(game.score);

    // Update the snake's last direction.
    snake.currentDirection = snake.nextDirection;
}

function setScoreText(newScore) {
    var scorePoint = new Point(view.size.width - 14, 34);
    var scoreText = new PointText(scorePoint);
    scoreText.fontSize = 24;
    scoreText.justification = 'right';
    scoreText.fillColor = '#d3dae5';
    scoreText.fontWeight = 'bold';
    scoreText.shadowColor = '#000000';
    scoreText.shadowBlur = 2;
    scoreText.shadowOffset = new Point(0, 0);
    scoreText.content = newScore;
}

function getFoodLocation() {
    var maxPoint = new Point(view.size.width, view.size.height);
    var randomPoint = Point.random();
    var foodPoint = maxPoint * randomPoint;
    food.xPos = Math.floor(foodPoint.x / scalingFactor);
    food.yPos = Math.floor(foodPoint.y / scalingFactor);
    // Check that the food hasn't spawned on any part of the snake. If it has,
    // respawn the food.
    for (var i = 0; i < snake.body.length; i++) {
        if (snake.body[i].xPos === food.xPos & snake.body[i].yPos === food.yPos) {
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

    var lastSegment = snake.body[snake.body.length - 1];

    if (snake.body.length === 1) {
        direction = snake.nextDirection;
    } else {
        var secondToLast = snake.body[snake.body.length - 2];

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
    snake.body.push(newSegment);
}

function endGame() {
    // Stop the execution of the game loop.
    clearInterval(game.gameInterval);
    baseSpeed = 250;

    // Clear the canvas.
    project.clear();

    snake.currentDirection = 'right';
    snake.nextDirection = 'right';

    // Reset the values for the snake and food.
    for (var i = 0; i < 3; i++) {
        snake.body[i].xPos = 3 - i;
        snake.body[i].yPos = 1;
    }
    snake.body.splice(3);
    getFoodLocation();

    // Display the title text.
    showDeathScreen(game.score);

    game.score = 0;

    game.gameStarted = false;
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
          !isOppositeDirection(event.key, snake.currentDirection) &&
          game.gameStarted) {
        snake.nextDirection = event.key;
    } else if (event.key === 'space') {
        if (!game.gameStarted) {
            game.gameInterval = setInterval(gameLoop, baseSpeed);
            game.gameStarted = true;
        }
    }
}