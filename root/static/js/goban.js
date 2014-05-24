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
	this.board[x][y] = color;
	this.drawStone((x + 1) * this.canvas.width / (this.boardsize + 1),
				   (y + 1) * this.canvas.height / (this.boardsize + 1),
				   this.canvas.width / (this.boardsize + 1) / 2,
				   color);

}

Goban.prototype.getMoves = function(sgf) {
	this.moves = [];
	var regex = /([WB])\[([a-z]{2})\]/g;

	var currentgroup;
	while(currentgroup = regex.exec(sgf)) {
		this.moves.push({color: currentgroup[1],
				  move: currentgroup[2]});
	}
}

Goban.prototype.goToMove = function(move) {
	for (var i = 0; i < move; i++) {
		var x = 'abcdefghijklmnopqrstuvwxyz'.indexOf(this.moves[i].move[0]);
		var y = 'abcdefghijklmnopqrstuvwxyz'.indexOf(this.moves[i].move[1]);
		var color = this.moves[i].color == "B" ? 'black' : 'white';
		this.placeStone(x,
						y,
						color);
	};
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
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.draw();
	this.goToMove(this.currentMove);
}