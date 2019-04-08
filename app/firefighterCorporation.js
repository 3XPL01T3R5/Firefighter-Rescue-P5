class FirefighterCorporation extends House {
    static ALGORITHM_A_STAR = 0;
    static ALGORITHM_IDA_STAR = 1;
    static STATUS_RECEIVING_CALLS = 0;
    static STATUS_EXCHANGING_INFORMATION = 1;
    static STATUS_ON_RESCUE = 2;

    constructor(block, side, algorithm) {
        super(block, side);
        this.truck = null;
        this.paths = {};
        this.queue = [];
        this.algorithm = algorithm;
        this.status = FirefighterCorporation.STATUS_RECEIVING_CALLS;
    }

    draw() {
        this.drawWithImage(corporationImg);
    }

    sendTrucks() {
        const house = this.getNextHouse();
        if (house) {
            this.truck = new FirefighterTruck(this.paths[house.block.id], city.graph);
            this.truck.target = house;
            this.truck.send();
        }
    }

    callbackTruckGarage() {
        if (this.queue.length === 0){
            btnStart.disabled = false;
            btnStart.style.opacity = 1;
            return;
        }
        this.sendTrucks();
    }

    call(house) {
        console.log('[' + this.id + '] Receiving call from house ' + house.block.id);

        const ret = this.findPath(house);
        this.paths[house.block.id] = ret['path'];
        this.queue.push({
            house, 'score': ret['score'], 'corpId': this.id
        });
    }

    findPath(house) {
        if (this.algorithm === FirefighterCorporation.ALGORITHM_A_STAR) {
            return aStar(city.graph, house, this.id);
        } else if (this.algorithm === FirefighterCorporation.ALGORITHM_IDA_STAR) {
            return aStar(city.graph, house, this.id);
        }

        return -1;
    }

    getNextHouse() {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].corpId === this.id) {
                return this.queue.splice(i, 1)[0].house;
            }
        }
        return undefined;
    }
}
