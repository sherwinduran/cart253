/**
 * Catch the Buzz
 * Sherwin Duran
 * 
 * A game about catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch the black fly to gain a point (50 max)
 * - Catching the red fly will reduce a point
 * - Catching the yellow fly (bee) will give a jumpscare
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// The frog
const frog = {
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        state: "idle"
    }
};

// Current score
let score = 0;

// Current state
let state = "title";
let jumpscare = false;

// Message variables
let message = "";
let messageDuration = 0;
const MESSAGE_LIFETIME = 60;
const messages = ["Yummy!", "Delicious!", "Amazing!", "Great!", "Perfect!"];
const disgustMessages = ["Ew!", "Disgusting!", ":(", "Sobbing..."];
let isNegativeMessage = false;

// Font and image variables
let titleFont;
let titleBackground;
let jumpscareImage;
let gameBackground;

function preload() {
    titleFont = loadFont('assets/fonts/Stardew_Valley.ttf');
    titleBackground = loadImage('assets/images/titleBackground.jpg');
    jumpscareImage = loadImage('assets/images/bee.jpg');
    gameBackground = loadImage('assets/images/blueBackground.jpg');
}

// The flies
const flies = [
    {
        x: 0,
        y: 200,
        size: 20,
        speed: 3,
        color: "#000000", // black fly
        movementPattern: "zigzag"
    },
    {
        x: 0,
        y: 200,
        size: 25,
        speed: 2,
        color: "#F95D5D", // red fly
        movementPattern: "zigzag"
    },
    {
        x: 0,
        y: 200,
        size: 25,
        speed: 4,
        color: "#FCB564", // yellow fly (bee)
        movementPattern: "zigzag"
    }
];

// Define the margins
const topMargin = 30;
const sideMargin = 30; // left and right margins
const frogMargin = 20; // margin around the frog

function setup() {
    createCanvas(640, 480);
    resetFlies();
}

function draw() {
    if (jumpscare) {
        drawJumpscare();
    } else if (state === "title") {
        title();
    } else if (state === "game") {
        game();
    } else if (state === "congratulations") {
        congratulations();
    }
}

/** 
 * Create the Title Page
*/

function title() {
    push();
    image(titleBackground, 0, 0, width, height);
    fill(255); // white color font
    textFont(titleFont);
    textSize(84);
    textAlign(CENTER, TOP);
    text("Catch the Buzz", width / 2, height / 9);
    textSize(34);
    text("Click to Play!", width / 2, height / 3.5);
    pop();
}

/**
 * Create the Game
 */

function game() {
    image(gameBackground, 0, 0, width, height);
    for (let fly of flies) {
        moveFly(fly);
        drawFly(fly);
    }
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    drawScore();

    // Draw the progress bar
    drawProgressBar();

    // Draw the message if it exists
    if (messageDuration > 0) {
        drawMessage();
        messageDuration--;
    }

    // This will check if the score has reached 50 and switch to the "congratulations" state
    if (score >= 50) {
        state = "congratulations";
    }
}

/**
 * Create the Congratulations Page
 */

function congratulations() {
    push();
    image(gameBackground, 0, 0, width, height);
    fill(255);
    textFont(titleFont);
    textSize(58);
    textAlign(CENTER, CENTER);
    text("Congratulations!", width / 2, height / 3);
    textSize(42);
    text("You caught 50 flies!", width / 2, height / 2);
    textSize(34);
    text("Click to Restart!", width / 2, height * 0.75);
    pop();
}


/**
 * Draw the Progress Bar
 */ 

function drawProgressBar() {
    const barWidth = 300; 
    const barHeight = 10; 
    const progress = map(score, 0, 50, 0, barWidth);

    push();
    // Draw the background of the progress bar
    fill(240);
    noStroke();
    rect((width - barWidth) / 2, topMargin + 5, barWidth, barHeight);

    // Draw the filled part of the progress bar
    fill('#76B142');
    rect((width - barWidth) / 2, topMargin + 5, progress, barHeight);
    pop();
}

/**
 * Create the movement of the fly
 */

function moveFly(fly) {
    if (fly.movementPattern === "zigzag") {
        fly.x += fly.speed;
        fly.y += sin(frameCount * 0.05) * 1;
    }

    if (fly.x > width) {
        resetFly(fly);
    }
}

/**
 * Draw the fly
 */

function drawFly(fly) {
    push();
    noStroke();
    fill(fly.color);
    ellipse(fly.x, fly.y, fly.size); // Body of the fly

    // Draw the wings
    const wingSize = fly.size * 0.6; // Size of the wings relative to the fly's body
    fill(255, 255, 255, 150);

    // Save the current transformation matrix
    translate(fly.x, fly.y); // Move to fly's position

    // Draw left wing
    push();
    rotate(sin(frameCount * 0.1) * 0.3);
    ellipse(-wingSize / 2, -wingSize / 4, wingSize, wingSize * 0.4);
    pop();

    // Draw right wing
    push();
    rotate(-sin(frameCount * 0.1) * 0.3);
    ellipse(wingSize / 2, -wingSize / 4, wingSize, wingSize * 0.4);
    pop();

    pop();
}

function resetFlies() {
    for (let fly of flies) {
        resetFly(fly);
    }
}

function resetFly(fly) {
    fly.x = 0;
    fly.y = random(topMargin + fly.size / 2 + frogMargin, height - frog.body.size / 2 - frogMargin);
}

/**
 * Create the movement of the frog
 */

function moveFrog() {
    frog.body.x = constrain(mouseX, frog.body.size / 2 + frogMargin, width - frog.body.size / 2 - frogMargin);
}

//Movement of the tongue
function moveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") {
       
    } else if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= topMargin) {
            frog.tongue.state = "inbound";
        }
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= 480) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Create the Score Counter
 */

function drawScore() {
    push();
    fill(255);
    noStroke();
    textFont(titleFont);
    textSize(64);
    textAlign(RIGHT, TOP);
    text(score, width - 50, 10);
    pop();
}

/**
 * Draw the Frog
 */

function drawFrog() {
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    push();
    stroke("#E26969");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    push();
    fill("#A9D15E");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

function checkTongueFlyOverlap() {
    for (let fly of flies) {
        const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
        const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
        if (eaten) {
            if (fly.color === "#F95D5D") {
                score = max(0, score - 1);
                setMessage(random(disgustMessages), true); // Set a random disgust message
            } else if (fly.color === "#FCB564") { // bee
                triggerJumpscare();
            } else {
                score = min(50, score + 1); // Cap the score at 50
                setMessage(random(messages), false); // Set a random normal message
            }
            resetFly(fly);
            frog.tongue.state = "inbound";
        }
    }
}

/**
 * Create a Bee Jumpscare Page
 */

function triggerJumpscare() {
    jumpscare = true;
    setTimeout(() => {
        jumpscare = false;
    }, 3000); // 3 seconds of bee jumpscare
}

function drawJumpscare() {
    background(0);
    image(jumpscareImage, 0, 0, width, height);
}

/**
 * Create the Messages on top of the screen
 */

function setMessage(msg, negative) {
    message = msg;
    isNegativeMessage = negative; // this will track if the message is negative
    messageDuration = MESSAGE_LIFETIME; // reset the message duration
}

function drawMessage() {
    push();
    // this will set the text color based on the message type
    fill(isNegativeMessage ? "#F95D5D" : 0); 
    textFont(titleFont);
    textSize(32);
    textAlign(LEFT, TOP);
    text(message, 30, 25);
}

function mousePressed() {
    if (state === "title") {
        state = "game";
        score = 0;  
        resetFlies();
    } else if (state === "game") {
        frog.tongue.state = "outbound";
    } else if (state === "congratulations") {
        state = "title"; 
        score = 0; 
        resetFlies(); 
    }
}

function mouseReleased() {
    if (state === "game") {
        frog.tongue.state = "inbound"; // this will retract the tongue
    }
}
