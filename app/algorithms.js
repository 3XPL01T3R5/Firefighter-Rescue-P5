function findPaths(graph, objectives, start) {
    let path = {};
    let neighbors = graph.adjList[start];
    let parent = Array(neighbors.length).fill(start);
    let visited = Array(graph.vertices.length).fill(false);

    path[start] = [];
    visited[start] = true;

    while (neighbors.length !== 0) {
        let n = neighbors.shift();
        let p = parent.shift();

        if (!visited[n[0]]) {
            visited[n[0]] = true;
            neighbors = neighbors.concat(graph.adjList[n[0]]);
            parent = parent.concat(Array(graph.adjList[n[0]].length).fill(n[0]));
            path[n[0]] = path[p].concat([p, n[0]]);
        }
    }
    Object.keys(path).forEach(p => {
        for (let i = path[p].length - 2; i >= 1; i-=2) {
            path[p].splice(i, 1);
        }
    });
    console.log(path);
    return path;
}

function fitness(house, distance) {
    return (house.residents / 100) + (house.burningLevel / 10) + 10 / distance;
}

function sortByFitness(houses, distances) {
    houses = houses.sort((h1, h2) => {
        let f1 = fitness(h1, distances[h1.block.id]);
        let f2 = fitness(h2, distances[h2.block.id]);

        if (f1 < f2)
            return 1;
        if (f1 > f2)
            return -1;
        return 0
    });

    return houses;
}

