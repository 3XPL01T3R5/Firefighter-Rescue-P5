class FirefighterTruck {
    static TRUCK_AT_GARAGE = 4;
    static TRUCK_AT_CORPORATION = 3;
    static TRUCK_ON_THE_WAY = 2;
    static TRUCK_ARRIVED = 1;
    static TRUCK_RETURNING = 0;

    constructor(path, graph) {
        this.graph = graph;
        this.available = true;
        this.block = this.graph.getVertexById(path[0]);
        this.x = this.block.x * blockSize;
        this.y = this.block.y * blockSize;
        this.path = path;
        this.currentDir = null;
        this.location = 0;
        this.state = FirefighterTruck.TRUCK_AT_GARAGE;
        this.target = null;
    }

    send() {
        if (sirenSound.isPlaying())
            sirenSound.stop();
        sirenSound.play();
        sirenSound.jump(floor(random(0,91)));
        sirenSound.setVolume(1, 1);
        this.state = FirefighterTruck.TRUCK_ON_THE_WAY;
    }

    goBack() {
        this.target.burningLevel = House.BURNING_LEVEL_NONE;
        this.state = FirefighterTruck.TRUCK_RETURNING;
    }

    draw() {
        if (this.state === FirefighterTruck.TRUCK_AT_GARAGE)
            return;
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
            translate(this.x + quarterBlockSize, this.y + eighthBlockSize);
            rotate(HALF_PI);
        } else if(this.currentDir === Block.DIR_LEFT) {
            translate(this.x - quarterBlockSize, this.y - eighthBlockSize);
            rotate(PI + HALF_PI);
        } else if(this.currentDir === Block.DIR_DOWN) {
            translate(this.x - eighthBlockSize, this.y + quarterBlockSize);
            rotate(PI);
        }  else {
            translate(this.x + eighthBlockSize, this.y - quarterBlockSize);
        }
        image(truckImg, 0, 0, quarterBlockSize, halfBlockSize);
        pop();
    }

    updatePosition() {
        let value = 0;
        if (this.state === FirefighterTruck.TRUCK_ARRIVED || this.state === FirefighterTruck.TRUCK_AT_CORPORATION)
            return;
        if (this.state === FirefighterTruck.TRUCK_ON_THE_WAY)
            value = 1;
        else if (this.state === FirefighterTruck.TRUCK_RETURNING)
            value = -1;
        let block = this.graph.getVertexById(this.path[this.location]);
        let nextBlock = this.graph.getVertexById(this.path[this.location + value]);
        if (!block)
            return;
        //this.x = block.x;
        //this.y = block.y;
        if (!nextBlock){
            if (this.state === FirefighterTruck.TRUCK_ON_THE_WAY) {
                this.state = FirefighterTruck.TRUCK_ARRIVED;
                setTimeout(this.goBack.bind(this), 4500);
            } else if (this.state === FirefighterTruck.TRUCK_RETURNING) {
                this.state = FirefighterTruck.TRUCK_AT_GARAGE;
                setTimeout(callback, 1243);
                sirenSound.setVolume(0, 0.5);
            }

            return;
        }
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
        this.x += deltax * 4;
        this.y += deltay * 4;
        if (this.x > nextBlock.x * blockSize && this.currentDir === Block.DIR_RIGHT || this.x < nextBlock.x * blockSize && this.currentDir === Block.DIR_LEFT || this.y > nextBlock.y * blockSize && this.currentDir === Block.DIR_DOWN || this.y < nextBlock.y * blockSize && this.currentDir === Block.DIR_UP) {
            this.x = nextBlock.x * blockSize;
            this.y = nextBlock.y * blockSize;
            this.location += value;
        }
    }
}

