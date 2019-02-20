var city = undefined;
var houseImg, corporationImg, truckImg, paths;

function setup() {
    createCanvas(1200, 810);
    frameRate(2);
    houseImg = loadImage('assets/house.png');
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

    paths = findPaths(city.graph, city.houses, city.corporations[0].block.id);

    city.truck = new FirefighterTruck(paths[13], city.graph);
}

function draw() {
    background('rgba(150,214,150, 1)');
    push();
    translate(20, 23);
    city.draw();
    pop();
}
