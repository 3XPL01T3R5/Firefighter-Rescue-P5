class FirefighterCorporation extends House {
    constructor(block, side) {
        super(block, side);
        this.truck = null;
        this.housesOnFire = [];
        this.paths = [];
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
}