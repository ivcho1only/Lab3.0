export default class Algs {
    constructor(alg, start, end, walls, bounds, settings, checkComponents) {
        this.alg = alg;
        this.start = start;
        this.end = end;
        this.walls = walls;
        this.bounds = bounds;

        this.speed = settings.speed;
        this.stayInbounds = settings.stayInbounds,
        this.runNoPath = settings.runNoPath,


        this.checkComponents = checkComponents;

        this.algList = {
            0: 'BFS',
            1: 'Dijkstra',
            2: 'AStar',
            3: 'GBFS',
            4: 'DFS',
            5: 'BSwarm'
        }

        this.init();
    }


    init() {
        this.running = true;
        this.skip = false;
        this.finished = false;

        this.queue = [];
        this.checked = [];
        this.pathInd = -1;

        this.queue.push({
            x: this.start.x,
            y: this.start.y,
            path: []
        });


        // let bounds = {
        //     minX: Math.min(this.start.x, this.end.x),
        //     minY: Math.min(this.start.y, this.end.y),
        //     maxX: Math.max(this.start.x, this.end.x),
        //     maxY: Math.max(this.start.y, this.end.y)
        // }

        // this.walls.forEach((wall) => {
        //     if (wall.x < bounds.minX) {
        //         bounds.minX = wall.x;
        //     }
        //     if (wall.x > bounds.maxX) {
        //         bounds.maxX = wall.x;
        //     }

        //     if (wall.y < bounds.minY) {
        //         bounds.minY = wall.y;
        //     }
        //     if (wall.y > bounds.maxY) {
        //         bounds.maxY = wall.y;
        //     }
        // });

        // this.bounds = {
        //     minX: bounds.minX - 1,
        //     minY: bounds.minY - 1,
        //     maxX: bounds.maxX + 1,
        //     maxY: bounds.maxY + 1,
        // }


        this[this.algList[this.alg]]();
    }


    BFS = async () => {

        let exitFound = false;
        let noExit = false;

        while (this.queue.length > 0) {

            let curr = this.queue.shift();

            const neighbors = [
                {
                    x: curr.x + 1,
                    y: curr.y,
                    path: curr.path
                },
                {
                    x: curr.x - 1,
                    y: curr.y,
                    path: curr.path
                },
                {
                    x: curr.x,
                    y: curr.y + 1,
                    path: curr.path
                },
                {
                    x: curr.x,
                    y: curr.y - 1,
                    path: curr.path
                }
            ]
            
            if (this.finished) {
                return;
            }
            if (!this.running) {
                this.queue.unshift(curr);
                return;
            }

            if (curr.x != this.start.x || curr.y != this.start.y) {
                this.checkComponents(curr.x, curr.y, 'checked');
            }
            
            for (let i = 0; i < neighbors.length; i++) {
                const x = neighbors[i].x;
                const y = neighbors[i].y;

                if (this.walls.some(e => e.x === x && e.y === y) || this.checked.some(e => e.x === x && e.y === y)) {
                    continue;
                }
                
                if (x == this.start.x && y == this.start.y) {
                    continue;
                }
                if (x == this.end.x && y == this.end.y) {
                    exitFound = true;
                    continue;
                }

                if (this.stayInbounds && (x < this.bounds.minX || y < this.bounds.minY || x > this.bounds.maxX || y > this.bounds.maxY)) {
                    // boundCross++;
                    continue;
                }
                
                let newPath = neighbors[i].path.slice();

                newPath.push({
                    x: x,
                    y: y
                });
                this.queue.push({
                    x: x,
                    y: y,
                    path: newPath
                });
                this.checked.push({
                    x: x,
                    y: y,
                });

                if (!this.running) {
                    this.queue.unshift(curr);
                    return;
                }

                this.checkComponents(x, y, 'current');
                
                if (this.skip) {
                    continue;
                }

                await this.waitForSecs(this.speed);
                
            }
                        
            if (exitFound) {
                
                let path = curr.path;

                for (let i = Math.max(this.pathInd, 0); i < path.length; i++) {

                    if (!this.running) {
                        this.queue.unshift(curr);
                        this.pathInd = i;
                        return;
                    }

                    this.checkComponents(path[i].x, path[i].y, 'path');
    
                    await this.waitForSecs(100);
                }

                this.finished = true;

                return;
            }

        }

        return;



    }


    AStar = async () => {

    }

    waitForSecs(milisecs) {
        return new Promise(resolve => {
            setTimeout(resolve, milisecs);
        });
    }

    
    // close
    closeRun(){
        this.running = false;
    }

    // restart
    restartRun() {
        this.running = false;
        
        setTimeout(() => {
            this.init();
        }, 100)

    }

    // skip
    skipRun() {
        this.skip = true;
        
        if (!this.running) {
            this.running = true;
            this[this.algList[this.alg]]();
        }

    }

    // pause
    pauseRun() {
        this.running = false;
        // this.BFS()
    }

    // continue
    continueRun() {
        this.running = true;
        this[this.algList[this.alg]]();
    }


    updateSettings(value) {
        this.speed = value['speed'];
        this.stayInbounds = value['stayInbounds'];
        this.runNoPath = value['runNoPath'];

        console.log(value)
    }

}