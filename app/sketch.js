var curves = [];

class Street {
	blocks = [];
		
}

class Graph {
	
}

function setup() {
	createCanvas(1024, 768);
	curves = [{start: PI + HALF_PI, end: 0}, {start: 0, end: HALF_PI}, {start: HALF_PI, end: PI}, {start: PI, end: PI + HALF_PI}];
}

function drawStreetBlock(x, y, pos) {
	push();
	translate(x, y);
	if (pos) {
		rotate(HALF_PI);
	}
	stroke(0);
	strokeWeight(4);
	line(-20, -20, -20, 20);
	line(20, -20, 20, 20);
	stroke(255);
	line(0, -5, 0, 5);
	pop();
}

function drawStreetCorner(x, y, quad) {
	push();
	translate(x, y);
	noFill();
	strokeWeight(4);
	var curve = curves[quad];
	arc(20, 20, 80, 80, curve.start, curve.end);
	pop();
}





function draw() {
	background(200);
	var x = width/2, y = height/2;
	for (var i = 0; i < 10; i++) {
		drawStreetBlock(x, y, false);
		y += 40;
	}
	drawStreetBlock(width/2 + 40, height/2 - 40, true);
	drawStreetCorner(width/2, height/2 - 40, 3);
	var x = width/2 + 80;
	var y = height/2 - 40;
	for (var i = 0; i < 5; i++) {
		drawStreetBlock(x, y, true);
		x += 40;
	}
	x -= 40;
	drawStreetCorner(x, height/2 - 40, 0);
}