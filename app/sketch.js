var city = undefined;
var houseImg, corporationImg, truckImg, houseFireImg1, houseFireImg2, houseFireImg3, sirenSound, callback = {},
    btnStart;

function start() {
    console.clear();
    btnStart.disabled = true;
    btnStart.style.opacity = 0.5;

    city.houses.forEach(h => {
        h.residents = floor(random(1, 10));
    });

    // Setting houses on fire
    const housesOnFire = [];
    for (let i = 0; i < 5; i++) {
        let houseIndex = floor(random(0, city.houses.length));
        let house = city.houses[houseIndex];
        house.burningLevel = floor(random(House.BURNING_LEVEL_LOW, House.BURNING_LEVEL_HIGH + 1));
        if (!housesOnFire.find(h => h.block.id === house.block.id)) {
            housesOnFire.push(house);
            city.getRandomCorporation().call(house);
        }
    }

    city.corporations.forEach(corp => {
        corp.status = FirefighterCorporation.STATUS_ON_RESCUE;
        callback[corp.id] = corp.callbackTruckGarage.bind(corp);
        corp.sendTrucks();
    });
}

function enableBtnStart() {
    for (let corp of city.corporations) {
        if (corp.status !== FirefighterCorporation.STATUS_RECEIVING_CALLS) {
            return;
        }
    }
    btnStart.disabled = false;
    btnStart.style.opacity = 1;
}

function preload() {
    sirenSound = loadSound('assets/siren_fire.mp3');
    btnStart = document.getElementById('btnStart');
}

function setup() {
    createCanvas(1200, 810);
    frameRate(600);
    houseImg = loadImage('assets/house.png');
    houseFireImg1 = loadImage('assets/house_fire_1.png');
    houseFireImg2 = loadImage('assets/house_fire_2.png');
    houseFireImg3 = loadImage('assets/house_fire_3.png');
    corporationImg = loadImage('assets/corporation.png');
    truckImg = loadImage('assets/truck.png');
    curves = [
        {start: PI + HALF_PI, end: 0},
        {start: 0, end: HALF_PI},
        {start: HALF_PI, end: PI},
        {start: PI, end: PI + HALF_PI}
    ];
    city = new City();
    city.buildCity();
    city.buildHouses();
    city.buildCorporations();
}

function draw() {
    background('rgba(150,214,150, 1)');
    push();
    translate(30, 23);
    city.draw();
    city.corporations.forEach(corp => {
        if (corp.truck) {
            corp.truck.draw();
            corp.truck.updatePosition();
        }
    });
    pop();
}
