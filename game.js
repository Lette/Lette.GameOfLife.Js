/// <reference path="jquery-3.7.1.js" />
/// <reference path="config.js" />
/// <reference path="state.js" />
/// <reference path="scene.js" />

var App = function(scene) {
    this.scene = scene;
    this.state = new State();
    this.timeoutId = 0;

    this.randomize = function() {
        this.state = StateFactory.createRandom();
        this.scene.update(this.state);
    }

    this.showDone = function() {
        this.state = StateFactory.createDone();
        this.scene.update(this.state);
    }

    this.step = function() {
        this.state = this.state.getNextState();
        return this.scene.update(this.state);
    }

    this.keepPlaying = function(app) {
        if (app.timeoutId == 0) {
            return;
        }
        if (app.step()) {
            app.timeoutId = setTimeout(app.keepPlaying, Settings.speed, app);
        } else {
            app.stop();
            app.showDone();
        }
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

    this.togglePlay = function()
    {
        if (this.timeoutId == 0) {
            this.play();
        } else {
            this.stop();
        }
    }

    this.showLogo = function() {
        this.stop();
        this.state = StateFactory.createLogo();
        this.scene.update(this.state);
    }
}

$(function() {
    var canvas = $("#canvas");
    canvas.attr("width", Settings.width);
    canvas.attr("height", Settings.height);
    var context = canvas[0].getContext("2d");
    var ratioSpan = $("#ratio");

    var scene = new Scene(context, ratioSpan);
    var app = new App(scene);

    app.showLogo();

    $("#randomizeButton").on("click", function() {
        app.randomize();
    });

    $("#stepButton").on("click", function() {
        app.step();
    });

    $("#playButton").on("click", function() {
        app.play();
    });

    $("#stopButton").on("click", function() {
        app.stop();
    });

    $(document).on("keypress", function(e) {
        if (e.which === 114) {
            app.randomize();
        } else if (e.which === 115) {
            app.step();
        } else if (e.which === 112) {
            app.togglePlay();
        } else if (e.which === 108) {
            app.showLogo();
        }
    });

    var controls = $("#controls");
    controls.show();
});
