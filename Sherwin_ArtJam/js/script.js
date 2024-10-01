/**
 * Art Jam: Pizza Time
 * Sherwin Duran
 * 
 * This interactive project lets the player move the pizza around and
 * feed it to the person by clicking on them
 * 
 * Controls:
 * -mouse to move the pizza
 * -click to feed the person
 * 
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 * 
 */

"use strict";

let humanHappiness = 0;  // Track the happiness level
let pizzaCount = 0;      // Track the number of pizzas fed
const maxPizza = 50;     // Maximum number of pizzas
let pizzaPos;            // Position of the pizza

function setup() {
  createCanvas(400, 400);
   // Initial position of the pizza
  pizzaPos = createVector(mouseX, mouseY);
}

function draw() {
  // Sky blue background
  background(135, 206, 235); 

  // Draw grass
  drawGrass();

  // Draw cloud
  drawCloud();

  // Update pizza position based on mouse
  pizzaPos.set(mouseX, mouseY);
  
  // Draw the human
  drawHuman();

  // Draw the pizza
  drawPizza(pizzaPos.x, pizzaPos.y);

  // Instructions
  fill(11, 53, 94);
  textSize(16);
  text("I am so hungry. Please feed me!", 10, 20);
  text("Pizza count: " + pizzaCount, 10, 40);
}

/**
* Draws the person
*/
function drawHuman() {
  // Map happiness to color and size
  let humanColor = map(humanHappiness, 0, maxPizza, 150, 255);

   // Size increases with happiness
  let humanSize = map(humanHappiness, 0, maxPizza, 50, 200);
  
  // Draws a person (circle)
  fill(humanColor, 100, 150);
  ellipse(width / 2, height / 2, humanSize, humanSize);
  
  // Draws the eyes
  fill(0);
  ellipse(width / 2 - 10, height / 2 - 10, 10, 10);
  ellipse(width / 2 + 10, height / 2 - 10, 10, 10);
  
  // Draws a mouth based on happiness
  fill(139, 0, 0);
  let mouthWidth = 20;
  let mouthHeight = 10;
  let mouthY = height / 2 + 10;

  if (humanHappiness > 0) {
    // Smiling mouth
    arc(width / 2, mouthY, mouthWidth, mouthHeight, 0, PI);
  } else {
    // Frowning mouth
    arc(width / 2, mouthY + 5, mouthWidth, mouthHeight, PI, 0);
  }
}

/**
* Draws the pizza
*/
function drawPizza(x, y) {
  fill(255, 174, 51);
  let pizzaSize = 30;
  triangle(x, y, x - pizzaSize, y + pizzaSize / 6, x - pizzaSize, y - pizzaSize / 6);
}


/**
* Draws the white cloud
*/
function drawCloud() {
  fill(255); 
  noStroke();

  // Cloud body
  ellipse(100, 80, 60, 40); 
  ellipse(130, 80, 60, 40);
  ellipse(70, 80, 60, 40);
}

/**
* Draws the grass at the bottom
*/
function drawGrass() {
  fill(34, 139, 34); 
  
   // Grass at the bottom
  rect(0, height - 50, width, 50);
}

/**
* Check if the pizza is close enough to the person to feed them
*/
function mousePressed() {
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if (pizzaCount < maxPizza && d < 50) {
    pizzaCount++;
    // Increase happiness up to maxPizza
    humanHappiness = constrain(humanHappiness + 1, 0, maxPizza); 
  }
}
