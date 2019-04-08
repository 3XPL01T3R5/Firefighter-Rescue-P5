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
                for (let i = path.length - 2; i >= 1; i-=2) {
                    path.splice(i, 1);
                }

                objectivePath = path;
                break;
            }
        }
    }

    return {'path': objectivePath, 'score': fitness(objective, objectivePath.length)};
}

function fitness(house, distance) {
    return (house.residents / 5) + (house.burningLevel / 5) + (5 / distance);
}

