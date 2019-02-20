class Graph {
    constructor() {
        this.adjList = {};
        this.vertices = [];
    }

    addVertex(u) {
        this.vertices.push(u);
        this.adjList[u.id] = [];
    }

    getVertexById(id) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].id === id) {
                return this.vertices[i];
            }
        }
        return null;
    }

    addEdge(u, v, dir) {
        v.x = u.x + (dir === 'right' ? 1 : dir === 'left' ? -1 : 0);
        v.y = u.y + (dir === 'up' ? -1 : dir === 'down' ? 1 : 0);

        try {
            this.adjList[u.id].push([v.id, dir]);
        } catch (e) {
            this.addVertex(u);
            this.adjList[u.id].push([v.id, dir]);
        }

        let opposite = {'up': 'down', 'down': 'up', 'right': 'left', 'left': 'right'};
        try {
            this.adjList[v.id].push([u.id, opposite[dir]]);
        } catch (e) {
            this.addVertex(v);
            this.adjList[v.id].push([u.id, opposite[dir]]);
        }
    }

    getIntersectionDirs(id) {
        var neigh = this.adjList[id];
        var arr = [0, 0, 0, 0];
        arr[0] = !!neigh.find(n => n[1] === 'up');
        arr[1] = !!neigh.find(n => n[1] === 'right');
        arr[2] = !!neigh.find(n => n[1] === 'down');
        arr[3] = !!neigh.find(n => n[1] === 'left');
        return arr;
    }
}