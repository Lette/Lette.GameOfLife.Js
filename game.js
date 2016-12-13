/// <reference path="jquery-3.1.1.js" />
/// <reference path="config.js" />
/// <reference path="state.js" />
/// <reference path="scene.js" />


var createRandomState = function(liveCellCount) {
    var state = new State();

    var getRandom = function(max) {
        return Math.floor(Math.random() * max);
    }

    for (var i = 0; i < liveCellCount; i++) {
        var x = getRandom(Settings.gridSize);
        var y = getRandom(Settings.gridSize);

        state.setCell(x, y, true); 
    }

    return state;
}

var randomize = function(n) {
    var state = createRandomState(n);

}

var App = function(scene) {
    this.scene = scene;
    this.state = new State();
    this.timeoutId = 0;

    this.randomize = function(liveCellCount) {
        this.state = createRandomState(liveCellCount);
        this.scene.update(this.state);
    }

    this.step = function() {
        this.state = this.state.getNextState();
        this.scene.update(this.state);
    }

    this.keepPlaying = function(app) {
        if (app.timeoutId == 0) {
            return;
        }
        app.step();
        app.timeoutId = setTimeout(app.keepPlaying, Settings.speed, app);
    }

    this.play = function() {
        if (this.timeoutId != 0) {
            return;
        }
        this.step();
        this.timeoutId = setTimeout(this.keepPlaying, Settings.speed, this);
    }

    this.stop = function() {
        if (this.timeoutId == 0) {
            return;
        }
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
    }
}

$(document).ready(function() {
    var canvas = $("#canvas");
    canvas.attr("width", Settings.width);
    canvas.attr("height", Settings.height);
    var context = canvas[0].getContext("2d");

    var scene = new Scene(context);
    var app = new App(scene);

    app.randomize(Settings.randomizedLiveCellCount);    

    $("#randomizeButton").click(function() {
        app.randomize(Settings.randomizedLiveCellCount);    
    });

    $("#stepButton").click(function() {
        app.step();
    });

    $("#playButton").click(function() {
        app.play();
    });

    $("#stopButton").click(function() {
        app.stop();
    });

    var controls = $("#controls");
    controls.show();
});
