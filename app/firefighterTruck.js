class FirefighterTruck {
    constructor(path, graph) {
        this.men = 10;
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
        push();
        translate(this.x * blockSize - this.displacement + 15, this.y * blockSize - 5);
        if(this.currentDir === Block.SIDE_RIGHT) {
            rotate(HALF_PI);
        } else if(this.currentDir === Block.SIDE_BOTTOM) {
            rotate(PI);
        } else if(this.currentDir === Block.SIDE_LEFT) {
            rotate(PI + HALF_PI);
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
            this.currentDir = Block.SIDE_LEFT;
        } else if (deltax > 0) {
            this.currentDir = Block.SIDE_RIGHT;
        } else if (deltay > 0) {
            this.currentDir = Block.SIDE_BOTTOM;
        } else if (deltay < 0) {
            this.currentDir = Block.SIDE_TOP;
        }
        this.displacement = 8;
    }
}

