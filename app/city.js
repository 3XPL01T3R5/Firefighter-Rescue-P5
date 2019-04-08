class City {
    constructor() {
        this.graph = new Graph();
        this.houses = [];
        this.housesOnFire = [];
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

        for (var i = 0; i < 18; i++) {
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


        // console.log(this.lastBlock);
        // console.log(this.graph);
    }

    buildHouses() {
        this.houses.push(new House(this.graph.getVertexById(13), Block.SIDE_LEFT, 10));
        this.houses.push(new House(this.graph.getVertexById(98), Block.SIDE_TOP, 4));
        this.houses.push(new House(this.graph.getVertexById(118), Block.SIDE_LEFT, 3));
        this.houses.push(new House(this.graph.getVertexById(131), Block.SIDE_RIGHT, 8));
        this.houses.push(new House(this.graph.getVertexById(143), Block.SIDE_TOP, 9));
        this.houses.push(new House(this.graph.getVertexById(161), Block.SIDE_RIGHT, 1));
        this.houses.push(new House(this.graph.getVertexById(173), Block.SIDE_BOTTOM, 4));
        this.houses.push(new House(this.graph.getVertexById(195), Block.SIDE_RIGHT, 7));
        this.houses.push(new House(this.graph.getVertexById(201), Block.SIDE_LEFT, 3));
        this.houses.push(new House(this.graph.getVertexById(205), Block.SIDE_TOP, 2));
    }

    buildCorporations() {
        this.corporations.push(new FirefighterCorporation(this.graph.getVertexById(128), Block.SIDE_LEFT, FirefighterCorporation.ALGORITHM_A_STAR));
        this.corporations.push(new FirefighterCorporation(this.graph.getVertexById(190), Block.SIDE_LEFT, FirefighterCorporation.ALGORITHM_IDA_STAR));
    }

    getRandomCorporation() {
        const index = Math.floor(Math.random() * this.corporations.length);
        return this.corporations[index];
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
    }
}