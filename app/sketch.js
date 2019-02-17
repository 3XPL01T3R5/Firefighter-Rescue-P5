let curves = [], id = 0, blockSize = 40;
let initialX = 1, initialY = 0;

class Block {
	static ORIENTATION_HORIZONTAL = 0;
	static ORIENTATION_VERTICAL = 1;
	static TYPE_STRAIGHT = 0;
	static TYPE_INTERSECTION = 1;
	static SIDE_LEFT = 0;
	static SIDE_RIGHT = 1;
	static SIDE_BOTTOM = 2;
	static SIDE_TOP = 3;

	constructor(x, y, orientation, type) {
		this.x = x;
		this.y = y;
		this.orientation = orientation;
		this.type = type;
		this.id = id++;
	}
}

let dirToOrientation = {
							'up': Block.ORIENTATION_VERTICAL,
							'down': Block.ORIENTATION_VERTICAL,
							'right': Block.ORIENTATION_HORIZONTAL,
							'left': Block.ORIENTATION_HORIZONTAL
						};

class House {
	constructor(block, side) {
		this.block = block;
		this.side = side;
    this.isBurning = false;
	}
}

class FirefighterTruck {
	constructor(block, side) {
		this.men = 10;
		this.available = true;
		this.block = block;
		this.side = side;
	}
}

class FirefighterCorporation extends House {
	constructor(block, side) {
		super(block, side);
		this.trucks = [];
		this.emergenceList = [];
	}
}

class Graph {
	constructor() {
		this.adjList = {};
		this.vertices = [];
	}
	
	addVertex(u) {
		this.vertices.push(u);
    this.adjList[u.id] = [];
	}
	
	getVertexById(id) {
		for (var i = 0; i < this.vertices.length; i++) {
			if (this.vertices[i].id === id) {
				return this.vertices[i];
			}
		}
		return null;
	}
	
	addEdge(u, v, dir) {
		v.x = u.x + (dir === 'right' ? 1 : dir === 'left' ? -1 : 0);
		v.y = u.y + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0);
    
    try {
			this.adjList[u.id].push([v.id, dir]);
    } catch (e) {
      this.addVertex(u);
      this.adjList[u.id].push([v.id, dir]);
    }
		
		let opposite = {'up': 'down', 'down': 'up', 'right': 'left', 'left': 'right'};
    try {
			this.adjList[v.id].push([u.id, opposite[dir]]);
    } catch (e) {
      this.addVertex(v);
      this.adjList[v.id].push([u.id, opposite[dir]]);
    }
	}
}

class City {
	constructor() {
        this.graph = new Graph();
        this.houses = [];
        this.corporations = [];
        this.lastBlock = null;
  }
  
  setLastBlockById(id) {
    this.lastBlock = this.graph.getVertexById(id);
  }

  setInitialBlock(x, y, orientation, type) {
		this.lastBlock = new Block(x, y, orientation, type);
	}

	buildBlock(dir, type) {
		//  constructor(x, y, orientation, type)
		let block = new Block(this.lastBlock.x + dir === 'right' ? 1 : dir === 'left' ? -1 : 0,
			this.lastBlock.y + dir === 'down' ? 1 : dir === 'up' ? -1 : 0, dirToOrientation[dir], type);
		this.graph.addEdge(this.lastBlock, block, dir);
		this.lastBlock = block;
	}
  
  buildIntersectionWith(id, dir) {
    this.graph.addEdge(this.lastBlock, this.graph.getVertexById(id), dir);
    this.lastBlock = this.graph.getVertexById(id);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
  }
	
	buildCity() {
		this.setInitialBlock(initialX, initialY, Block.ORIENTATION_VERTICAL, Block.TYPE_STRAIGHT);
		
		for (var i = 0; i < 19; i++) {
			this.buildBlock('down', Block.TYPE_STRAIGHT);
		}
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 27; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 18; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 26; i++) {
      this.buildBlock('left', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(1, 'left');
    
    this.setLastBlockById(5);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 15; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 3; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(76, 'up');
    
    this.setLastBlockById(100);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 3; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(81, 'up');
    
    this.setLastBlockById(11);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 4; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 5; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(94, 'up');
    
    this.setLastBlockById(97);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 13; i++) {
      this.buildBlock('down', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(26, 'down');
    
    this.setLastBlockById(15);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 6; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(130, 'right');
    
    this.setLastBlockById(126);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 19; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(54, 'right');
    
    this.setLastBlockById(145);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 5; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(103, 'up');
    
    this.setLastBlockById(145);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 7; i++) {
      this.buildBlock('down', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(32, 'down');
    
    this.setLastBlockById(168);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 4; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 4; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(149, 'up');
    
    this.setLastBlockById(150);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 9; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(73, 'up');
    
    this.setLastBlockById(153);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 9; i++) {
      this.buildBlock('up', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(70, 'up');
    
    this.setLastBlockById(153);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 7; i++) {
      this.buildBlock('down', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(40, 'down');
    
    this.setLastBlockById(200);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 5; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(50, 'right');
    
    this.setLastBlockById(192);
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    for (i = 0; i < 4; i++) {
      this.buildBlock('right', Block.TYPE_STRAIGHT);
    }
    this.lastBlock.type = Block.TYPE_INTERSECTION;
    
    for (i = 0; i < 4; i++) {
      this.buildBlock('down', Block.TYPE_STRAIGHT);
    }
    this.buildIntersectionWith(157, 'down');
    
    
    console.log(this.lastBlock);
    console.log(this.graph);
	}
  
  buildHouses() {
    this.houses.push(new House(this.graph.getVertexById(13), Block.SIDE_LEFT));
    this.houses.push(new House(this.graph.getVertexById(98), Block.SIDE_TOP));
    this.houses.push(new House(this.graph.getVertexById(118), Block.SIDE_LEFT));
    this.houses.push(new House(this.graph.getVertexById(131), Block.SIDE_RIGHT));
    this.houses.push(new House(this.graph.getVertexById(143), Block.SIDE_TOP));
    this.houses.push(new House(this.graph.getVertexById(161), Block.SIDE_RIGHT));
    this.houses.push(new House(this.graph.getVertexById(173), Block.SIDE_BOTTOM));
    this.houses.push(new House(this.graph.getVertexById(195), Block.SIDE_RIGHT));
    this.houses.push(new House(this.graph.getVertexById(201), Block.SIDE_LEFT));
    this.houses.push(new House(this.graph.getVertexById(205), Block.SIDE_TOP));
    
    console.log(this.houses);
  }
  
  buildCorporations() {
    this.corporations.push(this.graph.getVertexById(166), Block.SIDE_LEFT);
  }
}

/********************************************************************************************/

function setup() {
	createCanvas(1200, 800);
	curves = [{start: PI + HALF_PI, end: 0}, {start: 0, end: HALF_PI}, {start: HALF_PI, end: PI}, {start: PI, end: PI + HALF_PI}];
  
  let city = new City();
  city.buildCity();
  city.buildHouses();
  city.buildCorporations();
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
