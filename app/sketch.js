var city = undefined;
var houseImg, corporationImg, truckImg, houseFireImg1, houseFireImg2, houseFireImg3, sirenSound, callback, btnStart;

function start() {
    // Setting houses on fire
    for (let i = 0; i < 3; i++) {
        let houseIndex = floor(random(0, city.houses.length));
        let house = city.houses[houseIndex];
        house.burningLevel = floor(random(House.BURNING_LEVEL_LOW, House.BURNING_LEVEL_HIGH + 1));
        if (!city.housesOnFire.find(h => h.block.id === house.block.id))
            city.housesOnFire.push(house);
    }

    city.corporations.forEach(corp => {
        const ret = findPaths(city.graph, city.housesOnFire, corp.block.id);
        corp.housesOnFire = ret['sortedHouses'];
        corp.paths = ret['paths'];
    });

    callback = city.corporations[0].callbackTruckGarage.bind(city.corporations[0]);

    city.corporations.forEach(corp => {
        corp.sendTrucks(corp.housesOnFire.shift());
    });

    btnStart.disabled = true;
    btnStart.style.opacity = 0.5;
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

    // paths = findPaths(city.graph, city.houses, city.corporations[0].block.id);

    // Object.keys(paths).forEach(key => {
    //    housesOnFire.push(city.graph.getVertexById(id))
    // });
}

function draw() {
    background('rgba(150,214,150, 1)');
    push();
    translate(20, 23);
    city.draw();
    if (city.corporations[0].truck) {
        city.corporations[0].truck.draw();
        city.corporations[0].truck.updatePosition();
    }
    pop();
}
