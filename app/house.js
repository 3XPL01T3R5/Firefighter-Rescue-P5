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
        push();
        if (this.side === Block.SIDE_RIGHT) {
            rotate(HALF_PI);
        } else if (this.side === Block.SIDE_LEFT) {
            rotate(-HALF_PI);
        } else if (this.side === Block.SIDE_BOTTOM) {
            rotate(PI);
        }
        image(img, -halfBlockSize, -halfBlockSize, blockSize, blockSize);
        pop();
        if (this.residents) {
            fill(255, 0, 0);
            noStroke();
            push();
            if (this.side == Block.SIDE_RIGHT)
                translate(blockSize, 0);
            else if (this.side == Block.SIDE_BOTTOM)
                translate(blockSize, blockSize);

            ellipse(-halfBlockSize, -halfBlockSize, 20, 20);
            fill(255);
            if (this.residents >= 10)
                text(this.residents, -halfBlockSize - 7, -halfBlockSize + 5);
            else
                text(this.residents, -halfBlockSize - 3, -halfBlockSize + 5);
            pop();
        }
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

    }
}