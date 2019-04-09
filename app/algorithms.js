function aStar(graph, objective, start) {
    let allPaths = {};
    let objectivePath;
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

            const house = objective.block.id === n[0];
            if (house) {
                let path = allPaths[n[0]];
                // Removing duplicate entries
                for (let i = path.length - 2; i >= 1; i -= 2) {
                    path.splice(i, 1);
                }

                objectivePath = path;
                break;
            }
        }
    }

    return {'path': objectivePath, 'score': fitness(objective, objectivePath.length)};
}

function innerIdaStar(graph, objective, start, visited, path, i) {
    if (start === objective) {
        return path;
    }

    if (graph.adjList[start].length === 0) {
        return;
    }

    graph.adjList[start].forEach(neighbor => {
        if (!visited[neighbor[0]]) {
            visited[neighbor[0]] = true;
            path.push(neighbor[0]);
            let currentPath = innerIdaStar(graph, objective, neighbor[0], visited, Object.assign([], path), i + 1);
            if (currentPath) {
                path = currentPath;
            } else {
                visited[neighbor[0]] = false;
                path.splice(path.length - 1, 1);
            }
        }
    });

    return path;
}

function idaStar(graph, objective, start) {
    let objectivePath = [start];

    let visited = {start: true};

    objectivePath = innerIdaStar(graph, objective, start, visited, Object.assign([], objectivePath), 1);

    return {'path': objectivePath, 'score': fitness(objective, objectivePath.length)};
}

function dijkstra(graph, objective, start) {
    let paths = {};
    let objectivePath;
    let neighbors = Object.assign([], graph.adjList[start]);
    let weights = Array(neighbors.length).fill(getBalancedWeight(neighbors));
    let parent = Array(neighbors.length).fill(start);
    let visited = Array(graph.vertices.length).fill(false);

    paths[start] = [];
    visited[start] = true;

    while (neighbors.length !== 0) {
        let n = neighbors.shift();
        let p = parent.shift();

        if (!visited[n[0]]) {
            visited[n[0]] = true;
            neighbors = neighbors.concat(graph.adjList[n[0]]);
            sortNeighborsByWeight(neighbors, weights);
            parent = parent.concat(Array(graph.adjList[n[0]].length).fill(n[0]));
            paths[n[0]] = paths[p].concat([p, n[0]]);

            const house = objective.block.id === n[0];
            if (house) {
                let path = paths[n[0]];
                for (let i = path.length - 2; i >= 1; i -= 2) {
                    path.splice(i, 1);
                }

                objectivePath = path;
                break;
            }
        }
    }

    return {'path': objectivePath, 'score': fitness(objective, objectivePath.length)};
}

function sortNeighborsByWeight(neighbors, weights) {
    let bertona = [];
    for (let i = 0; i < neighbors.length; i++) {
        bertona.push([neighbors[i] , weights[i]]);
    }

    bertona.sort((a,b) => {
        if (a[1] === b[1])
            return 0;
        if (a[1] > b[1])
            return -1;
        return 1;
    });

    return bertona;
}

function fitness(house, distance) {
    return (house.residents / 5) + (house.burningLevel / 5) + (5 / distance);
}

