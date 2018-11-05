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

    this.liveCells = 0;
    this.aggLiveCells = 0;
    this.aggCells = 0;

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
                } else if (neighbors == 3 || (neighbors >= 6 && neighbors <= 7)) {
                    nextState.setCell(x, y, true, wasAlive, age);
                } else { // ( neighbors < 2 || neighbors > 3) {
                    nextState.setCell(x, y, false, wasAlive, age);
                }

                var nextCellIsAlive = nextState.getCell(x, y);
                if (nextCellIsAlive) {
                    nextState.liveCells++;
                }
            }
        }

        nextState.aggLiveCells += nextState.liveCells;
        nextState.aggCells += (Settings.gridSize ** 2);

        return nextState;
    }

    this.countLiveCells = function() {
        var result = 0;

        for (var x = 0; x < Settings.gridSize; x++) {
            for (var y = 0; y < Settings.gridSize; y++) {
                if (this.getCell(x, y)) {
                    result++;
                }
            }
        }

        return result;
    }

}

var StateFactory = (function () {

    var createRandom = function() {
        var state = new State();
    
        for (var x = 0; x < Settings.gridSize; x++) {
            for (var y = 0; y < Settings.gridSize; y++) {
                if (Math.random() < Settings.randomizedLiveCellRatio) {
                    state.setCell(x, y, true); 
                }
            }
        }

        state.liveCells = state.aggLiveCells = state.countLiveCells();
        state.aggCells = (Settings.gridSize ** 2);

        return state;
    };

    var createStateFromMask = function(mask) {
        var state = new State();

        var width = mask[0].length;
        var height = mask.length;

        var startX = Math.round((Settings.gridSize - width) / 2);
        var startY = Math.round((Settings.gridSize - height) / 2);

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                if (mask[y][x]) {
                    state.setCell(x + startX, y + startY, true, false, 0);
                }
            }
        }

        state.liveCells = state.aggLiveCells = state.countLiveCells();
        state.aggCells = (Settings.gridSize ** 2);

        return state;
    }

    var createMaskFromStrings = function(ss) {
        var mask = [];
        for (var i = 0; i < ss.length; i++) {
            var cs = ss[i].split("");
            var is = [];
            for (var j = 0; j < cs.length; j++) {
                is.push(cs[j] == " " ? 0 : 1);
            }
            mask.push(is);
        }
        return mask;
    }

    var createDone = function() {
        var done = [
            "xxx    xx   x   x  xxxx  x",
            "x  x  x  x  xx  x  x     x",
            "x  x  x  x  x x x  xxx   x",
            "x  x  x  x  x  xx  x      ",
            "xxx    xx   x   x  xxxx  x",
        ];

        return createStateFromMask(createMaskFromStrings(done));
    };


    var createLogo = function() {
        var logo = [
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "x                                   x",
            "x   xxx                             x",
            "x  x   x   xxx    x xx xx     xxx   x",
            "x  x          x    x  x  x   x   x  x",
            "x  x  xxx   xxx    x  x  x   xxxx   x",
            "x  x   x   x  x    x  x  x   x      x",
            "x   xxxx    xx x  x   x  x    xxxx  x" ,
            "x                                   x",
            "x                    xx             x",
            "x             xx    x               x",
            "x            x  x  xxxx             x",
            "x            x  x   x               x",
            "x             xx    x               x",
            "x                  x                x",
            "x                       xxx   xxx   x",
            "x       xx      x      x   x x      x",
            "x      xx             x     x       x",
            "x       x      xx   xxxxxxxxxx      x",
            "x       x       x    x     x        x",
            "x       x    x  x    x     x        x",
            "x      xxxxxx    x   x     x        x",
            "x                   x     x         x",
            "x                 xx    xx          x",
            "x                                   x",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        ];

        return createStateFromMask(createMaskFromStrings(logo));
    };

    return {
        createRandom: createRandom,
        createDone: createDone,
        createLogo: createLogo
    };
})();