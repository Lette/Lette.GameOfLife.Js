
var Settings = new (function (){

    this.cellSize = 12;
    this.gridSize = 60;
    this.cellMargin = 2;

    this.randomizedLiveCellRatio = 0.4;

    this.height = this.width = this.cellSize * this.gridSize + 1;

    this.speed = 0;
    this.wrapAroundEdges = true;

    this.maximumAge = 9;
    this.maximumAgeDelta = 8;

})();