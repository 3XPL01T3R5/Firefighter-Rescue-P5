class FirefighterCorporation extends House {
    static ALGORITHM_A_STAR = 0;
    static ALGORITHM_IDA_STAR = 1;
    static STATUS_RECEIVING_CALLS = 0;
    static STATUS_EXCHANGING_INFORMATION = 1;
    static STATUS_SHARING_SCORES = 2;
    static STATUS_ON_RESCUE = 3;

    constructor(block, side, algorithm) {
        super(block, side);
        this.truck = null;
        this.paths = {};
        this.privateQueue = [];
        this.queue = [];
        this.otherCorporations = [];
        this.algorithm = algorithm;
        this.status = FirefighterCorporation.STATUS_RECEIVING_CALLS;
    }

    draw() {
        this.drawWithImage(corporationImg);
    }

    sendTrucks() {
        const house = this.getNextHouse();
        if (house) {
            this.broadcastRescue(house);
            this.truck = new FirefighterTruck(this.paths[house.block.id], city.graph);
            this.truck.target = house;
            this.truck.send();
        } else {
            this.queue.length = 0;
            this.status = FirefighterCorporation.STATUS_RECEIVING_CALLS;
            this.emitLog('Now accepting calls');
            enableBtnStart();
        }
    }

    callbackTruckGarage() {
        this.sendTrucks();
    }

    call(house) {
        this.emitLog('Receiving call from house ' + house.block.id);

        const ret = this.findPath(house);
        this.paths[house.block.id] = ret['path'];
        this.privateQueue.push({
            house, 'score': ret.score, 'corpId': this.id
        });
    }

    findPath(house) {
        if (this.algorithm === FirefighterCorporation.ALGORITHM_A_STAR) {
            return aStar(city.graph, house, this.id);
        } else if (this.algorithm === FirefighterCorporation.ALGORITHM_IDA_STAR) {
            return aStar(city.graph, house, this.id);
        }

        return -1;
    }

    getNextHouse() {
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].corpId === this.id) {
                return this.queue.splice(i, 1)[0].house;
            }
        }
        return undefined;
    }

    shareInfo() {
        for (const corp of this.otherCorporations) {
            this.emitLog('Houses on fire: ' + this.queueToString(this.privateQueue),corp.id);
            corp.receiveInfo(this.privateQueue);
        }
    }

    receiveInfo(info) {
        for (const e of info) {
            const ret = this.findPath(e.house);
            this.paths[e.house.block.id] = ret['path'];
            this.queue.push({'house': e.house, 'score': ret.score, 'corpId': this.id});
        }
    }

    shareScores() {
        for (const corp of this.otherCorporations) {
            this.emitLog('My scores: ' + this.scoresToString(this.privateQueue),corp.id);
            corp.receiveScores(this.privateQueue);
        }
    }

    receiveScores(info) {
        this.queue = this.queue.concat(info);
    }

    emitLog(message, dest) {
        let str = '';
        if (dest) {
            str = '[' + this.id + '] -> [' + dest + '] ' + message;
        } else {
            str = '[' + this.id + '] ' + message;
        }

        console.log(str);
        log += str + '\n';
    }

    queueToString(queue) {
        let str = '[', first = true;
        for (const info of queue) {
            str += (first ? '' : ', ') + info.house.block.id;
            first = false;
        }
        str += ']';
        return str;
    }

    scoresToString(queue) {
        let str = '[', first = true;
        for (const info of queue) {
            str += (first ? '' : ', ') + '(h: ' + info.house.block.id + '; score: ' + info.score + ')';
            first = false;
        }
        str += ']';
        return str;
    }

    fillPrivateQueue() {
        this.privateQueue = this.privateQueue.concat(this.queue);
        this.queue.length = 0;
    }

    fillAndSortQueue() {
        this.queue = this.queue.concat(this.privateQueue);
        this.privateQueue.length = 0;

        this.queue.sort((a, b) => {
            if (a.score === b.score)
                return 0;
            if (a.score > b.score)
                return -1;
            return 1;
        });
    }

    broadcastRescue(house) {
        for (const corp of this.otherCorporations) {
            this.emitLog('Rescuing house ' + house.block.id, corp.id);
            corp.receiveRescueBroadcast(house);
        }
    }

    receiveRescueBroadcast(house) {
        const idxList = [];
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].house.block.id === house.block.id) {
                idxList.push(i);
            }
        }

        for (let i = 0; i < idxList.length; i++) {
            this.queue.splice(idxList[i] - i, 1);
        }
    }
}
