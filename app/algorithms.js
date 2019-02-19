function findDistances(graph, objectives, start) {
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
    return path;
}

