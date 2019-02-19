let curves = [], id = 0, blockSize = 40, halfBlockSize = blockSize / 2, quarterBlockSize = blockSize/4, eighthBlockSize = blockSize / 8;
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
    static DIR_LEFT = 0;
    static DIR_RIGHT = 1;
    static DIR_DOWN = 2;
    static DIR_UP = 3;

    constructor(x, y, orientation, type) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.type = type;
        this.id = id++;
    }

    drawStreetBlock() {
        var x = this.x * blockSize;
        var y = this.y * blockSize;
        push();
        translate(x, y);
        if (this.orientation === Block.ORIENTATION_HORIZONTAL) {
            rotate(HALF_PI);
        }
        noStroke();
        fill(200);
        rect(-halfBlockSize, -halfBlockSize, blockSize, blockSize);
        stroke(0);
        strokeWeight(4);
        line(-halfBlockSize, -halfBlockSize, -halfBlockSize, halfBlockSize);
        line(halfBlockSize, -halfBlockSize, halfBlockSize, halfBlockSize);
        stroke(255);
        line(0, -eighthBlockSize, 0, eighthBlockSize);
        pop();
    }

    drawStreetCorner(graph) {
        var x = this.x * blockSize;
        var y = this.y * blockSize;
        push();
        translate(x, y);
        var hasNeigh = graph.getIntersectionDirs(this.id);
        noStroke();
        fill(200);
        rect(-halfBlockSize, -halfBlockSize, blockSize, blockSize);
        strokeWeight(4);
        if (!hasNeigh[0]) {
            stroke(0);
            line(-halfBlockSize, -halfBlockSize, halfBlockSize, -halfBlockSize);
        }
        else {
            stroke(255);
            line(0, 0, 0, -eighthBlockSize);
        }
        if (!hasNeigh[1]) {
            stroke(0);
            line(halfBlockSize, -halfBlockSize, halfBlockSize, halfBlockSize);
        }
        else {
            stroke(255);
            line(0, 0, eighthBlockSize, 0);
        }
        if (!hasNeigh[2]) {
            stroke(0);
            line(-halfBlockSize, halfBlockSize, halfBlockSize, halfBlockSize);
        }
        else {
            stroke(255);
            line(0, 0, 0, eighthBlockSize);
        }
        if (!hasNeigh[3]) {
            stroke(0);
            line(-halfBlockSize, -halfBlockSize, -halfBlockSize, halfBlockSize);
        }
        else {
            stroke(255);
            line(-eighthBlockSize, 0, 0, 0);
        }
        pop();
    }

    draw(graph) {
        if (this.type === Block.TYPE_STRAIGHT) {
            this.drawStreetBlock();
        } else {
            this.drawStreetCorner(graph);
        }
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

    drawWithImage(img) {
        push();
        if (this.side === Block.SIDE_RIGHT) {
            translate(this.block.x * blockSize + blockSize, this.block.y * blockSize);
        } else if (this.side === Block.SIDE_LEFT) {
            translate(this.block.x * blockSize - blockSize, this.block.y * blockSize);
        } else if (this.side === Block.SIDE_BOTTOM) {
            translate(this.block.x * blockSize, this.block.y * blockSize + blockSize);
        } else {
            translate(this.block.x * blockSize, this.block.y * blockSize - blockSize);
        }
        if (this.side === Block.SIDE_RIGHT) {
            rotate(HALF_PI);
        } else if (this.side === Block.SIDE_LEFT) {
            rotate(-HALF_PI);
        } else if (this.side === Block.SIDE_BOTTOM) {
            rotate(PI);
        }
        image(img, -halfBlockSize, -halfBlockSize, blockSize, blockSize);
        pop();
    }

    draw() {
        this.drawWithImage(houseImg);
    }
}

class FirefighterTruck {
    constructor(path, graph) {
        this.graph = graph;
        this.available = true;
        this.block = this.graph.getVertexById(path[0]);
        this.x = this.block.x;
        this.y = this.block.y;
        this.path = path;
        this.currentDir = undefined;
        this.displacement = undefined;
    }

    draw() {
        let nextNextBlock = this.graph.getVertexById(this.path[1]);
        let sharpCurve = false;
        if (nextNextBlock) {
            let deltax = nextNextBlock - this.x;
            let deltay = nextNextBlock.y - this.y;
            if (this.currentDir === Block.DIR_UP && deltax > 0 ||
                this.currentDir === Block.DIR_DOWN && deltax < 0 ||
                this.currentDir === Block.DIR_RIGHT && deltay > 0 ||
                this.currentDir === Block.DIR_LEFT && deltay < 0) {
                sharpCurve = true;
            }
        }
        push();

        if(this.currentDir === Block.DIR_RIGHT) {
            translate(this.x * blockSize - quarterBlockSize, this.y * blockSize + eighthBlockSize);

            rotate(HALF_PI);
        } else if(this.currentDir === Block.DIR_LEFT) {
            translate(this.x * blockSize - quarterBlockSize, this.y * blockSize - eighthBlockSize);
            rotate(PI + HALF_PI);
        } else if(this.currentDir === Block.DIR_DOWN) {
            translate(this.x * blockSize - eighthBlockSize, this.y * blockSize + quarterBlockSize);
            rotate(PI);
        }  else {
            translate(this.x * blockSize + eighthBlockSize, this.y * blockSize - quarterBlockSize);
        }
        image(truckImg, 0, 0, quarterBlockSize, halfBlockSize);
        pop();
    }

    updatePosition() {
        let block = this.graph.getVertexById(this.path.shift());
        let nextBlock = this.graph.getVertexById(this.path[0]);
        if (!block)
            return;
        this.x = block.x;
        this.y = block.y;
        if (!this.path.length)
            return;
        let deltax = nextBlock.x - block.x;
        let deltay = nextBlock.y - block.y;
        if (deltax < 0) {
            this.currentDir = Block.DIR_LEFT;
        } else if (deltax > 0) {
            this.currentDir = Block.DIR_RIGHT;
        } else if (deltay > 0) {
            this.currentDir = Block.DIR_DOWN;
        } else if (deltay < 0) {
            this.currentDir = Block.DIR_UP;
        }
        this.displacement = 8;
    }
}

class FirefighterCorporation extends House {
    constructor(block, side) {
        super(block, side);
        this.trucks = [];
        this.emergenceList = [];
    }

    draw() {
        this.drawWithImage(corporationImg);
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
        for (let i = 0; i < this.vertices.length; i++) {
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

    getIntersectionDirs(id) {
        var neigh = this.adjList[id];
        var arr = [0, 0, 0, 0];
        arr[0] = !!neigh.find(n => n[1] === 'up');
        arr[1] = !!neigh.find(n => n[1] === 'right');
        arr[2] = !!neigh.find(n => n[1] === 'down');
        arr[3] = !!neigh.find(n => n[1] === 'left');
        return arr;
    }
}

class City {
    constructor() {
        this.graph = new Graph();
        this.houses = [];
        this.corporations = [];
        this.truck = undefined;
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
    }

    buildCorporations() {
        this.corporations.push(new FirefighterCorporation(this.graph.getVertexById(166), Block.SIDE_LEFT));
    }

    draw() {
        this.graph.vertices.forEach(b => {
            b.draw(this.graph);
        });

        this.houses.forEach(h => {
            h.draw();
        });

        this.corporations.forEach(c => {
            c.draw();
        });

        this.truck.draw();
        this.truck.updatePosition();

    }
}

/********************************************************************************************/
var city = undefined;
var houseImg, corporationImg, truckImg, paths;

function setup() {
    createCanvas(1200, 810);
    frameRate(2);
    houseImg = loadImage('assets/house.png');
    corporationImg = loadImage('assets/corporation.png');
    truckImg = loadImage('assets/truck.png');
    curves = [
        {start: PI + HALF_PI, end: 0},
        {start: 0, end: HALF_PI},
        {start: HALF_PI, end: PI},
        {start: PI, end: PI + HALF_PI}
    ];
    city = new City();
    city.buildCity();
    city.buildHouses();
    city.buildCorporations();

    paths = findDistances(city.graph, city.houses, city.corporations[0].block.id);
    console.log('path: ', paths[13]);
    city.truck = new FirefighterTruck(paths[13], city.graph);
}

function draw() {
    background('rgba(150,214,150, 1)');
    push();
    translate(20, 23);
    city.draw();
    pop();
}
