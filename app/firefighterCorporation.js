class FirefighterCorporation extends House {
    static ALGORITHM_A_STAR = 0;
    static ALGORITHM_IDA_STAR = 1;
    static STATUS_RECEIVING_CALLS = 0;
    static STATUS_EXCHANGING_INFORMATION = 1;
    static STATUS_ON_RESCUE = 2;

    constructor(block, side, algorithm) {
        super(block, side);
        this.truck = null;
        this.housesOnFire = [];
        this.paths = [];
        this.queue = [];
        this.algorithm = algorithm;
        this.status = FirefighterCorporation.STATUS_RECEIVING_CALLS;
    }

    draw() {
        this.drawWithImage(corporationImg);
    }

    sendTrucks(house) {
        this.truck = new FirefighterTruck(this.paths[house.block.id], city.graph);
        this.truck.target = house;
        this.truck.send();
    }

    callbackTruckGarage() {
        if (this.housesOnFire.length === 0){
            btnStart.disabled = false;
            btnStart.style.opacity = 1;
            return;
        }
        this.sendTrucks(this.housesOnFire.shift());
    }

    call(house) {
        this.queue.push({
            house, 'score': this.fitness(house), 'id': this.block.id
        });
    }

    fitness(house) {
        if (this.algorithm === FirefighterCorporation.ALGORITHM_IDA_STAR) {
            // TODO calc of fitness
        } else if (this.algorithm === FirefighterCorporation.ALGORITHM_IDA_STAR) {
            // TODO calc of fitness
        }

        return -1;
    }
}