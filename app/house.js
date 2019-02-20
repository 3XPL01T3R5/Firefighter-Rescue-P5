class House {
    static BURNING_LEVEL_NONE = 0;
    static BURNING_LEVEL_LOW = 1;
    static BURNING_LEVEL_MEDIUM = 2;
    static BURNING_LEVEL_HIGH = 3;

    constructor(block, side, residents) {
        this.block = block;
        this.side = side;
        this.burningLevel = House.BURNING_LEVEL_NONE;
        this.residents = residents;
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
        if (this.burningLevel === House.BURNING_LEVEL_NONE)
            this.drawWithImage(houseImg);
        else if (this.burningLevel === House.BURNING_LEVEL_LOW)
            this.drawWithImage(houseFireImg1);
        else if (this.burningLevel === House.BURNING_LEVEL_MEDIUM)
            this.drawWithImage(houseFireImg2);
        else if (this.burningLevel === House.BURNING_LEVEL_HIGH)
            this.drawWithImage(houseFireImg3);

        push();
        const offsetX = this.side === Block.SIDE_LEFT ? -blockSize : Block.SIDE_RIGHT ? blockSize : 0;
        const offsetY = this.side === Block.SIDE_TOP ? -blockSize : Block.DIR_DOWN ? blockSize : 0;
        translate(this.block.x * blockSize + offsetX, this.block.y * blockSize + offsetY);
        text(this.residents, 0, 0);
        pop();
    }
}