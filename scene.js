/// <reference path="config.js" />

var Scene = function(/* context2d */ _) {

    var cellSize = Settings.cellSize;
    var gridSize = Settings.gridSize;
    var width = Settings.width;
    var height = Settings.height;

    this.drawGrid = function() {
        _.lineWidth = 1;
        _.strokeStyle = "#222222";
        //_.setLineDash([1, cellSize / 5]);

        for (var i = 0; i <= gridSize; i++) {
            _.moveTo(0, i * cellSize + 0.5);
            _.lineTo(width, i * cellSize + 0.5);
            _.moveTo(i * cellSize + 0.5, 0);
            _.lineTo(i * cellSize + 0.5, height);
        }

        _.stroke();
    }

    this.fillCell = function(x, y, isAlive, age) {
        var colorFromAge = function(age) {
            if (age >= Settings.maximumAge) {
                return "red";
            }

            var color = 255 - Math.floor(255 * age / Settings.maximumAge);
            return "rgb(255, " + color + ", " + color + ")";
        }

        if (isAlive) {
            _.fillStyle = colorFromAge(age);
        } else {
            _.fillStyle = "black";
        }

        var margin = Settings.cellMargin;
        _.fillRect(x * cellSize + margin, y * cellSize + margin, cellSize + 1 - 2 * margin, cellSize + 1 - 2 * margin);
    }

    this.update = function(state) {
        for (var x = 0; x < gridSize; x++) {
            for (var y = 0; y < gridSize; y++) {
                var cell = state.state[x][y];
                this.fillCell(x, y, cell.isAlive, cell.age);
            }
        }
    }

    this.Init = function() {
        _.fillStyle = "black";
        _.fillRect(0, 0, width, height);

        this.drawGrid();
    }

    this.Init();
}