/**
 * Pellet Dash
 * Sherwin Duran
 * 
 * This is a game about collecting 10 pellets. It has three game modes:
- The Rush: A ghost pursues the player while they attempt to collect all 10 pellets.
- The Double: Similar to The Rush, but with two ghosts chasing the player.
- The Hunt: A straightforward game mode where the pellets randomly spawn, and the player collects them without any ghosts.

I was inspired to create this game because of Pac-Man. I’ve always enjoyed the challenge of
avoiding ghosts while collecting items, and I wanted to bring that fun experience into a new game
with different modes and challenges.
 * 
 * Instructions:
 * - Move with the arrow keys
 * - You need to collect 10 pellets
 * - Avoid the ghosts
 * 
 * Made with p5
 * https://p5js.org/
 */

// Declaring the variables

let player;
let ghost1, ghost2; // Two ghosts for the "Double" mode
let pellets = [];
let collectedPellets = 0;
let totalPellets = 10;
let gameOver = false;
let gameWon = false;


let inTitleScreen = true;
let gameType = null;
let titleHeight = 100;
let titleSpacing = 60;

let titleFont;
let playerImage;
let ghostImage;

// My assets

function preload() {
    titleFont = loadFont('assets/fonts/Stardew_Valley.ttf');
    playerImage = loadImage('assets/images/dariusFace.png');
    ghostImage = loadImage('assets/images/simonFace.png');

}


function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (inTitleScreen) {
    drawTitleScreen();
  } else if (gameType === "rush") {
    rushGameLogic();
  } else if (gameType === "hunt") {
    huntGameLogic();
  } else if (gameType === "double") {
    doubleGameLogic();
  }
  
}

// Title screen
function drawTitleScreen() {
    background('#2d8a93'); 
  
  let titles = ["The Rush", "The Hunt", "The Double"];
  
textFont(titleFont);

  // Loop to draw all the game titles
  for (let i = 0; i < titles.length; i++) {
    textSize(42);
    fill(0);
    textAlign(CENTER, CENTER);
    text(titles[i], width / 2, titleHeight + i * titleSpacing);
  }
  
  // Check if mouse is over any of the titles and change cursor to HAND
  if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
    if (mouseY > titleHeight - 24 && mouseY < titleHeight + 24) {
      cursor(HAND); // Change cursor to hand if it's over "The Rush"
    } else if (mouseY > titleHeight + titleSpacing - 24 && mouseY < titleHeight + titleSpacing + 24) {
      cursor(HAND); // Change cursor to hand if it's over "The Hunt"
    } else if (mouseY > titleHeight + 2 * titleSpacing - 24 && mouseY < titleHeight + 2 * titleSpacing + 24) {
      cursor(HAND); // Change cursor to hand if it's over "The Double"
    } else {
      cursor(ARROW);
    }
  } else {
    cursor(ARROW);
  }
}

// Mouse click event to select the game type
function mousePressed() {
  if (inTitleScreen) {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > titleHeight - 24 && mouseY < titleHeight + 24) {
        // "The Rush" selected
        inTitleScreen = false;
        gameType = "rush";
        startRushGame();
      } else if (mouseY > titleHeight + titleSpacing - 24 && mouseY < titleHeight + titleSpacing + 24) {
        // "The Hunt" selected
        inTitleScreen = false;
        gameType = "hunt";
        startHuntGame();
      } else if (mouseY > titleHeight + 2 * titleSpacing - 24 && mouseY < titleHeight + 2 * titleSpacing + 24) {
        // "The Double" selected
        inTitleScreen = false;
        gameType = "double";
        startDoubleGame();
      }
    }
  }
}

// The Rush game
function rushGameLogic() {
  background(220);
  drawProgressBar();

  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    textSize(16);
    text('Press any key to restart', width / 2, height / 2 + 40);
    return;
  }

  if (gameWon) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Congratulations!', width / 2, height / 2);
    return;
  }

  fill('#1a2231');
  for (let i = 0; i < pellets.length; i++) {
    ellipse(pellets[i].x, pellets[i].y, 10, 10);
  }

  player.update();
  player.display();

  ghost1.update();
  ghost1.display();

  for (let i = pellets.length - 1; i >= 0; i--) {
    if (dist(player.x, player.y, pellets[i].x, pellets[i].y) < 15) {
      pellets.splice(i, 1);
      collectedPellets++;
    }
  }

  if (dist(player.x, player.y, ghost1.x, ghost1.y) < 15) {
    gameOver = true;
  }

  if (collectedPellets === totalPellets) {
    gameWon = true;
  }
}

// The Hunt game
function huntGameLogic() {
  background(220);
  drawProgressBar();

  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    textSize(16);
    text('Press any key to restart', width / 2, height / 2 + 40);
    return;
  }

  if (gameWon) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Congratulations!', width / 2, height / 2);
    return;
  }

  fill('#1a2231');
  if (pellet) {
    ellipse(pellet.x, pellet.y, 10, 10);
  }

  player.update();
  player.display();

  if (pellet && dist(player.x, player.y, pellet.x, pellet.y) < 15) {
    collectedPellets++;
    pellet = createPellet();
  }

  if (collectedPellets === totalPellets) {
    gameWon = true;
  }
}

// The Double game
function doubleGameLogic() {
  background(220);
  drawProgressBar();

  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    textSize(16);
    text('Press any key to restart', width / 2, height / 2 + 40);
    return;
  }

  if (gameWon) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Congratulations!', width / 2, height / 2);
    return;
  }

  fill('#1a2231');
  for (let i = 0; i < pellets.length; i++) {
    ellipse(pellets[i].x, pellets[i].y, 10, 10);
  }

  player.update();
  player.display();

  ghost1.update();
  ghost1.display();
  ghost2.update();
  ghost2.display();

  for (let i = pellets.length - 1; i >= 0; i--) {
    if (dist(player.x, player.y, pellets[i].x, pellets[i].y) < 15) {
      pellets.splice(i, 1);
      collectedPellets++;
    }
  }

  if (dist(player.x, player.y, ghost1.x, ghost1.y) < 15 || dist(player.x, player.y, ghost2.x, ghost2.y) < 15) {
    gameOver = true;
  }

  if (collectedPellets === totalPellets) {
    gameWon = true;
  }
}

// Player class
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 3;
    this.size = 30;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x = max(this.x - this.speed, 0);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x = min(this.x + this.speed, width);
    }
    if (keyIsDown(UP_ARROW)) {
      this.y = max(this.y - this.speed, 20);
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y = min(this.y + this.speed, height);
    }
  }

  display() {
    imageMode(CENTER); 
    let smallerSize = 50; 
    image(playerImage, this.x, this.y, smallerSize, smallerSize); 
  }
}

// Ghost class
class Ghost {
  constructor(player) {
    this.x = random(width);
    this.y = random(20, height); // Ensure the ghost starts below the progress bar
    this.speed = 1; // Slower ghost speed
    this.player = player;
    this.size = 30;
  }

  update() {
    let angle = atan2(this.player.y - this.y, this.player.x - this.x);
    this.x += this.speed * cos(angle);
    this.y += this.speed * sin(angle);
  }

  display() {
    imageMode(CENTER); 
    let smallerSize = 50;
    image(ghostImage, this.x, this.y, smallerSize, smallerSize);
  }
}

// Function to create a new pellet
function createPellet() {
  return createVector(random(width), random(20, height)); // Avoid spawning in the top area
}

// Function to start the Rush game
function startRushGame() {
  player = new Player();
  ghost1 = new Ghost(player);

  pellets = [];
  collectedPellets = 0;

  // Create pellets at random positions (below the progress bar)
  for (let i = 0; i < totalPellets; i++) {
    pellets.push(createVector(random(width), random(20, height))); // Avoid the top area
  }

  gameOver = false;
  gameWon = false;
}

// Function to start the Hunt game
function startHuntGame() {
  player = new Player();
  
  pellet = createPellet();
  collectedPellets = 0;
  
  gameOver = false;
  gameWon = false;
}

// Function to start the Double game
function startDoubleGame() {
  player = new Player();
  
  ghost1 = new Ghost(player);
  ghost2 = new Ghost(player);

  pellets = [];
  collectedPellets = 0;

  // Create pellets at random positions
  for (let i = 0; i < totalPellets; i++) {
    pellets.push(createVector(random(width), random(20, height)));
  }

  gameOver = false;
  gameWon = false;
}

// Key press to restart the game after game over
function keyPressed() {
  if (gameOver || gameWon) {
    if (gameType === "rush") {
      startRushGame();
    } else if (gameType === "hunt") {
      startHuntGame();
    } else if (gameType === "double") {
      startDoubleGame();
    }
  }
}

// Function to draw the progress bar
function drawProgressBar() {
  let progress = map(collectedPellets, 0, totalPellets, 0, width);

  // Draw the progress background
  fill(200);
  noStroke();
  rect(0, 0, width, 20);

  // Draw the progress fill
  fill(0, 255, 0);
  rect(0, 0, progress, 20);

  // Draw the progress text
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Pellets: ${collectedPellets} / ${totalPellets}`, 10, 5);
}