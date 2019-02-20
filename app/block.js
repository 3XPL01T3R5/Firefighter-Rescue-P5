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