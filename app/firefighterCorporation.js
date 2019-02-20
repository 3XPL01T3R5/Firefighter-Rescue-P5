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