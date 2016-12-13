
var Settings = new (function (){

    this.cellSize = 9;
    this.gridSize = 100;
    this.cellMargin = 2;

    this.randomizedLiveCellCount = 4800;

    this.height = this.width = this.cellSize * this.gridSize + 1;

    this.speed = 0;
    this.wrapAroundEdges = true;

    this.maximumAge = 20;
    this.maximumAgeDelta = 8;

})();