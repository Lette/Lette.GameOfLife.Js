/// <reference path="config.js" />

var Cell = function(isAlive, age) {
    this.isAlive = isAlive;
    this.age = age;
}

var State = function() {

    this.state = new Array(Settings.gridSize);
    for (var i = 0; i < Settings.gridSize; i++) {
        this.state[i] = new Array(Settings.gridSize);
        for (var j = 0; j < Settings.gridSize; j++) {
            this.state[i][j] = new Cell(false, 0);
        }
    }

    this.getCell = function(x, y) {
        if (Settings.wrapAroundEdges) {
            return this.state[(x + Settings.gridSize) % Settings.gridSize][(y + Settings.gridSize) % Settings.gridSize].isAlive;    
        }

        if (x < 0 || x >= Settings.gridSize || y < 0 || y >= Settings.gridSize) {
            return false;
        }

        return this.state[x][y].isAlive;
    }

    this.setCell = function(x, y, isAlive, wasAlive, age) {
        var cell = this.state[x][y];
        cell.isAlive = isAlive;

        if (Settings.maximumAge > 0) {
            if (!isAlive) {
                cell.age = 0;
            } else if (wasAlive) {
                cell.age = age + 1;
            }
            if (cell.age + Math.floor(Math.random() * (Settings.maximumAgeDelta * 2 + 1)) - Settings.maximumAgeDelta > Settings.maximumAge) {
                cell.isAlive = false;
                cell.age = 0;
            }
        }
    }

    this.getNextState = function() {
        var nextState = new State();

        var neighborOffsets = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1]
        ];

        for (var x = 0; x < Settings.gridSize; x++) {
            for (var y = 0; y < Settings.gridSize; y++) {

                var neighbors = 0;

                for (var d = 0; d < neighborOffsets.length; d++) {
                    if (this.getCell(x + neighborOffsets[d][0], y + neighborOffsets[d][1])) {
                        neighbors++;
                    }
                }

                var cell = this.state[x][y];
                var wasAlive = cell.isAlive;
                var age = cell.age;

                if (neighbors == 2) {
                    nextState.setCell(x, y, wasAlive, wasAlive, age);
                } else if (neighbors == 3 /*|| neighbors == 6*/) {
                    nextState.setCell(x, y, true, wasAlive, age);
                } else { // ( neighbors < 2 || neighbors > 3) {
                    nextState.setCell(x, y, false, wasAlive, age);
                }
            }
        }

        return nextState;
    }
}
