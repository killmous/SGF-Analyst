function Goban(canvas, boardsize) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.boardsize = boardsize;
    this.currentMove = 0;
    this.board = new Array(boardsize);
    for (var i = 0; i < this.board.length; i++) {
        this.board[i] = new Array(boardsize);
        for (var j = 0; j < this.board[i].length; j++) {
            this.board[i][j] = '';
        }
    }
}

Goban.prototype.drawLine = function(x1, y1, x2, y2) {
    this.context.strokeStyle = "#000000";
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
}

Goban.prototype.drawStone = function(x, y, radius, color) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2*Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.strokeStyle = "#000000";
    this.context.stroke();
}

Goban.prototype.draw = function() {
    this.context.fillStyle = "#f4a460";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 1; i < this.boardsize + 1; ++i) {
        this.drawLine(i * this.canvas.width / (this.boardsize + 1),
                      this.canvas.height / (this.boardsize + 1),
                      i * this.canvas.width / (this.boardsize + 1),
                      this.boardsize * this.canvas.height / (this.boardsize + 1));
        this.drawLine(this.canvas.width / (this.boardsize + 1),
                      i * this.canvas.height / (this.boardsize + 1),
                      this.boardsize * this.canvas.width / (this.boardsize + 1),
                      i * this.canvas.height / (this.boardsize + 1));
    }
}

Goban.prototype.placeStone = function(x, y, color) {
    this.drawStone((x + 1) * this.canvas.width / (this.boardsize + 1),
                   (y + 1) * this.canvas.height / (this.boardsize + 1),
                   this.canvas.width / (this.boardsize + 1) / 2,
                   color);
}

Goban.prototype.placeLastStoneIdentifier = function(x, y) {
    this.context.strokeStyle = "#FF0000";
    this.context.strokeRect((x + 0.75) * this.canvas.width / (this.boardsize + 1),
                            (y + 0.75) * this.canvas.height / (this.boardsize + 1),
                            0.5 * this.canvas.width / (this.boardsize + 1),
                            0.5 * this.canvas.height / (this.boardsize + 1)
                            );
}

Goban.prototype.getMoves = function(sgf) {
    this.moves = [];
    var regex = /;([WB])\[([a-z]?[a-z]?)\]/g;

    var currentgroup;
    while(currentgroup = regex.exec(sgf)) {
        this.moves.push({color: currentgroup[1],
                  move: currentgroup[2]});
    }
}

Goban.prototype.goToMove = function(move) {
    this.canvas.width = this.canvas.width;
    this.draw();
    for (var i = 0; i < this.boardsize; i++) {
        for (var j = 0; j < this.boardsize; j++) {
            this.board[i][j] = '';
        }
    }

    for (var i = 0; i < move; i++) {
        if(this.moves[i].move != 'tt' && this.moves[i].move != '') { // not pass
            var x = 'abcdefghijklmnopqrs'.indexOf(this.moves[i].move[0]);
            var y = 'abcdefghijklmnopqrs'.indexOf(this.moves[i].move[1]);
            var color = this.moves[i].color == "B" ? 'black' : 'white';
            this.board[x][y] = color;
            this.capture(x, y);
        }
    };
    this.currentMove = move;

    for (var i = 0; i < this.boardsize; i++) {
        for (var j = 0; j < this.boardsize; j++) {
            if(this.board[i][j] != '') {
                this.placeStone(i,
                                j,
                                this.board[i][j]);
            }
        }
    }

    if(this.moves[move - 1].move == 'tt' || this.moves[move - 1].move == '') { //pass
        this.context.fillStyle = "#FF0000";
        this.context.font = this.canvas.width / this.boardsize / 3 + "px Arial";
        this.context.textBaseline = 'top';
        this.context.fillText("Pass", 0, 0);
    } else {
        var x = 'abcdefghijklmnopqrstuvwxyz'.indexOf(this.moves[move - 1].move[0]);
        var y = 'abcdefghijklmnopqrstuvwxyz'.indexOf(this.moves[move - 1].move[1]);
        this.placeLastStoneIdentifier(x, y);
    }

    this.sliceGraph();
}

Goban.prototype.nextMove = function() {
    if(this.currentMove != this.moves.length) {
        this.currentMove++;
    }
    this.goToMove(this.currentMove);
}

Goban.prototype.prevMove = function() {
    if(this.currentMove != 0)
    {
        this.currentMove--;
    }
    this.goToMove(this.currentMove);
}

Goban.prototype.capture = function(x, y) {
    var captured = [];
    var neighbors = this.getIntersections(x, y);
    for (var i = 0; i < neighbors.length; i++) {
        var state = this.board[neighbors[i][0]][neighbors[i][1]];
        if (state != '' && state != this.board[x][y]) {
            var group = this.getGroup(neighbors[i][0], neighbors[i][1]);
            if (group["liberties"] == 0) {
                captured.push(group);
            }
        }
    }
    for (var i = 0; i < captured.length; i++) {
        for(var j = 0; j < captured[i]["stones"].length; j++) {
            this.board[captured[i]["stones"][j][0]][captured[i]["stones"][j][1]] = '';
        }
    };
}

Goban.prototype.getIntersections = function(x, y) {
    var neighbors = [];
    if (x > 0)
        neighbors.push([x - 1, y]);
    if (y < this.boardsize - 1)
        neighbors.push([x, y + 1]);
    if (x < this.boardsize - 1)
        neighbors.push([x + 1, y]);
    if (y > 0)
        neighbors.push([x, y - 1]);
    return neighbors;
};

Goban.prototype.getGroup = function(x, y) {
    var color = this.board[x][y];
    if (color == '')
        return null;

    var visited = {}; // for O(1) lookups
    var visited_list = []; // for returning
    var queue = [[x, y]];
    var count = 0;

    while (queue.length > 0) {
        var stone = queue.pop();
        if (visited[stone])
            continue;

        var neighbors = this.getIntersections(stone[0], stone[1]);
        var self = this;
        for (var i = 0; i < neighbors.length; i++) {
            var state = self.board[neighbors[i][0]][neighbors[i][1]];
            if (state == '')
                count++;
            if (state == color)
                queue.push([neighbors[i][0], neighbors[i][1]]);
        };

        visited[stone] = true;
        visited_list.push(stone);
    }

    return {
        "liberties": count,
        "stones": visited_list
    };
}

Goban.prototype.setMoveAnalysisData = function(moveAnalysisData) {
    this.moveData = moveAnalysisData;
}

Goban.prototype.sliceGraph = function() {
    var start = this.currentMove - 2 <= 0 ? 0 : this.currentMove >= this.moves.length - 2 ? this.moves.length - 4: this.currentMove - 2;
    var self = this;
    $('#slice-graph').highcharts({
        chart: {
            type: "spline"
        },
        title: {
            text: "5 Move Slice",
            x: -20
        },
        yAxis: {
            title: {
                text: 'Game Score'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            plotBands: [{
                from: 0,
                to: 100,
                color: 'rgba(0,0,0,1)'
            }]
        },
        xAxis: {
            title: {
                text: 'Move'
            }
        },
        tooltip: {
            headerFormat: '',
            valueSuffix: ' points'
        },
        plotOptions: {
            line: {
                enableMouseTracking: false
            },
            marker: {
                enabled: false
            },
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function(e) {
                            self.goToMove(this.x);
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Score',
            data: [
                {x: start,      y: this.moveData[start],        marker: {fillColor: start == this.currentMove ? 'red' : 'blue'}},
                {x: start + 1,  y: this.moveData[start + 1],    marker: {fillColor: start + 1 == this.currentMove ? 'red' : 'blue'}},
                {x: start + 2,  y: this.moveData[start + 2],    marker: {fillColor: start + 2 == this.currentMove ? 'red' : 'blue'}},
                {x: start + 3,  y: this.moveData[start + 3],    marker: {fillColor: start + 3 == this.currentMove ? 'red' : 'blue'}},
                {x: start + 4,  y: this.moveData[start + 4],    marker: {fillColor: start + 4 == this.currentMove ? 'red' : 'blue'}}
            ]
        }]
    });
}