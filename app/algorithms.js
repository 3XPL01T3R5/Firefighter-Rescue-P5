function findPaths(graph, objectives, start) {
    let allPaths = {};
    let objectivesPath = {};
    let neighbors = Object.assign([], graph.adjList[start]);
    let parent = Array(neighbors.length).fill(start);
    let visited = Array(graph.vertices.length).fill(false);

    allPaths[start] = [];
    visited[start] = true;

    while (neighbors.length !== 0) {
        let n = neighbors.shift();
        let p = parent.shift();

        if (!visited[n[0]]) {
            visited[n[0]] = true;
            neighbors = neighbors.concat(graph.adjList[n[0]]);
            parent = parent.concat(Array(graph.adjList[n[0]].length).fill(n[0]));
            allPaths[n[0]] = allPaths[p].concat([p, n[0]]);

            const house = objectives.find(h => h.block.id === n[0]);
            if (house) {
                let path = allPaths[n[0]];
                // Removing duplicate entries
                for (let i = path.length - 2; i >= 1; i-=2) {
                    path.splice(i, 1);
                }

                objectivesPath[n[0]] = path;
            }
        }
    }

    let sortedHouses = sortByFitness(objectives, objectivesPath);
    return {'sortedHouses': sortedHouses, 'paths': objectivesPath};
}

function fitness(house, distance) {
    return house.residents / 5 + house.burningLevel / 10 + 10 / distance;
}

function sortByFitness(houses, distances) {
    houses = houses.sort((h1, h2) => {
       return fitness(h2, distances[h2.block.id]) - fitness(h1, distances[h1.block.id]);
    });

    return houses;
}

