var init = function(){
	Othello.init();
}

/**
 * Piece
 */
var Piece = function() {
	arguments.callee.prototype.toString = function(){//this.toString = function() {
		switch(this){
			case Piece.BLACK:
				return "Black";
			case Piece.WHITE:
				return "White";
		}
		return "";
	};

	arguments.callee.prototype.getOpposite = function(){
		switch(this){
			case Piece.BLACK:
				return Piece.WHITE;
			case Piece.WHITE:
				return Piece.BLACK;
		}
		return null;
	};
};

Piece = {
	BLACK : new Piece(),
	WHITE : new Piece(),
	EMPTY : new Piece()
};

/*
 * Board
 */
var Board = function(){
	var cells = new Array(8);
	for ( var x = 0; x < cells.length; x++){
		cells[x] = new Array(8);
		for ( var y = 0; y < cells[x].length; y++){
			cells[x][y] = Piece.EMPTY;
		}
	}
	//setter
	this.setPiece = function(piece, x, y){
		if(!piece || !(0 <= x) || !(x <= 7) || !(0 <= y) || !(y <= 7))
			return false;// Check parameter
		cells[x][y] = piece;
		return true;
	}
	//getter
	this.getPiece = function(x, y){
		if(!(0 <= x) || !(x <= 7) || !(0 <= y) || !(y <= 7))
			return null;// Check parameter
		return cells[x][y];
	}
}
/*
 * View
 */

var View = {};
(function(){
	var board;
	var othello;

	function setBoard(_board){
		board = _board;
	}
	View.setBoard = setBoard;

	function setOthello(_othello){
		othello = _othello;
	}
	View.setOthello = setOthello;
	/*
	 * Paint
	 */
	function paint(){
		if(!board)
			throw new Error("board is null or undefined. Call setBoard() method befor paint.");
		var board_element = document.getElementById("board");

		for ( var y = 0; y < 8; y++){
		for ( var x = 0; x < 8; x++){
			var nType;
			switch( board.getPiece(x, y) ){
				case Piece.BLACK:
					nType="black"
					break;
				case Piece.WHITE:
					nType="white"
					break;
				case Piece.EMPTY:
					nType="empty"
					break;
				default:
			}
				var id = "cell" + (x + 1 + y * 8);
				var bElement = document.getElementById(id);
				if(bElement){
					var bType = bElement.className;
				}
				if(nType && bType == nType)
					continue;
				else{
					if(bElement)
						board_element.removeChild(bElement);
				}
				var nElement = makeElement(nType, id, x, y);
				if(nElement){
					board_element.appendChild(nElement);
				}
		}
		}
	}
	View.paint = paint;
	/*
	 * makeElement()
	 */
	function makeElement(type,id,x,y){
		var element;
		if(type != "black" && type != "white" && type != "empty"){
			throw new Error("illegal argument type: " + type);
		}else{
			element = document.getElementById(type).cloneNode(true);
			if(!element)
				throw new Error("You couldn't clone DOM element which id is " + type);
		}
		element.style.left = 61 * x + "px";
		element.style.top = 61 * y + "px";
		if(othello){
			(function(){
				var _x = x, _y = y, _othello = othello;
				element.onclick = function(){
					_othello.selectEvent(_x,_y);
				};
			})();
		}

		element.id = id;
		return element;
	}
	/*
	 * message
	 */
	function message(str, br){
		if(br == undefined) br = true;
		var mes_dom = document.getElementById("message");
		arguments.callee.mes_num = arguments.callee.mes_num || 0;
		if(br){
			arguments.callee.mes_num++;
			if(5 < arguments.callee.mes_num){
				mes_dom.removeChild(mes_dom.lastChild);
			}
			mes_dom.innerHTML = "<div>"+str+"</div>"+mes_dom.innerHTML;
		}else{
			var recent = mes_dom.firstChild;
			if(recent){
				recent.innerHTML += str;
			}else{
				arguments.callee(str, true);
			}
		}
	}
	View.message = message;
	/*
	 * highlight
	 */
	function highlight(x,y,color){
		if( !board )
			throw new Error("board is null/undefined. please call setBoard method before paint.");


		var board_element = document.getElementById("board");
		//var element = getElement(x,y);
		//var element = board.getPiece(x,y);
		var id = "cell" + (x + 1 + y * 8);
		var bElement = document.getElementById(id);

		//if( element && board_element){
		if( bElement && board_element){
			//board_element.removeChild(bElement);
			bElement.style.backgroundColor = color;
			//bElement.style.border= "solid 5px" + color;
			//child = bElement;
			//var child = element.firstChild;
			//while (child.nodeType != 1 && child){
			//	child = child.nextSibling;
			//}
				//var nElement = makeElement(nType, id, x, y);
				//if(nElement){
				//	board_element.appendChild(nElement);
				//}
			//child.style.left = "2px";
			//child.style.top = "2px";
			//child.style.width = "29px";
			//child.style.height = "29px";
			//board_element.appendChild(bElement);
		}
	}
	View.highlight = highlight;
	/*
	* unhighlightAll
	*/
    function unhighlightAll(){
	(function(){
	for(i = 0; i < 8; i++){
	for(j = 0; j < 8; j++){
		var id = "cell" + (i + 1 + j * 8);
		var element = document.getElementById(id);
		element.style.backgroundColor = "#00ee00";
	}
	}
	})();
	}
	View.unhighlightAll = unhighlightAll;
	/*
	 * putAssist
	 */
	function putAssist(piece){
		for( var y = 0; y < 8; y ++){
		for( var x = 0; x < 8; x ++){
			//var piece = turn.getPiece();
			if( 0 < othello.checkPiece(piece, x, y)){
				highlight(x,y,"rgba(0,238,0,.5)");
			}
		}
		}
	}
	View.putAssist = putAssist;
})();

/*
 * Othello
 */
var Othello = {};
(function(){
	var board;
	var view;
	var p1,p2;
	var turn;
	var skip;

	function init(){
		board = new Board();
		board.setPiece(Piece.WHITE, 3, 3);
		board.setPiece(Piece.WHITE, 4, 4);
		board.setPiece(Piece.BLACK, 3, 4);
		board.setPiece(Piece.BLACK, 4, 3);

		/*
		 * Handycaps
		 */
		//board.setPiece(Piece.WHITE, 0, 0);
		//board.setPiece(Piece.WHITE, 1, 0);
		//board.setPiece(Piece.WHITE, 2, 0);
		//board.setPiece(Piece.WHITE, 3, 0);
		//board.setPiece(Piece.WHITE, 4, 0);
		//board.setPiece(Piece.WHITE, 5, 0);
		//board.setPiece(Piece.WHITE, 6, 0);
		//board.setPiece(Piece.WHITE, 7, 0);

		view = View;
		view.setOthello(this);
		view.setBoard(board);
		view.paint();
		//player = Player
		//computer = Computer/ComputerEx/ComputerOri/ComputerLv2
		p1 = new ComputerLv2(Piece.BLACK, "Black");
		p1.setOthello(this);
		p2 = new ComputerOri(Piece.WHITE, "White");
		p2.setOthello(this);
		turn = p1;
		view.message("Game start!");
		turn = (turn == p1 ? p2 : p1);
		changeTurn();
	}
	Othello.init = init;
	/*
	 * changeTurn()
	 */
	function changeTurn(){
		turn = (turn == p1 ? p2 : p1);
		for( var y = 0; y < 8; y++){
		for( var x = 0; x < 8; x++){
			var piece = turn.getPiece();
			if(0 < checkPiece(piece, x, y)){
				view.message(turn+"'s turn ("+piece+")");

				skip = 0;
				turn.turn();
				return;
			}
		}
		}
		skip++;
		if(skip == 2){
			view.unhighlightAll();
			endGame();
		}else{
			view.message(turn + "(" + piece + ")" + "passed!");
			changeTurn();
		}
	}
	/*
	 * checkPiece()
	 */
	function checkPiece(piece,x,y){
		if( board.getPiece(x,y) != Piece.EMPTY)
			return 0;
		if(piece != Piece.BLACK && piece != Piece.WHITE)
			return 0;
		var oppositePiece = piece.getOpposite();
		var pieceNum = 0;

		for(var dy = -1;dy <= 1; dy++){
		for(var dx = -1;dx <= 1; dx++){
			if(dx == 0 && dy == 0)
				continue;
			var num = 0;
			var nx = x + dx;
			var ny = y + dy;
			var nextPiece = board.getPiece(nx,ny);
			while(nextPiece == oppositePiece){
				num++;
				nx += dx;
				ny += dy;
				nextPiece = board.getPiece(nx,ny);
			}
			if(0 < num && nextPiece == piece){
				pieceNum += num;
			}
		}
		}
		return pieceNum;
	}
	Othello.checkPiece = checkPiece;
	/*
	 * doFlip()
	 */
	function doFlip(player,x,y){
		if(player != turn)
			return 0;
		var piece = player.getPiece();
		var oppositePiece = piece.getOpposite();
		var flip = checkPiece(piece, x, y);
		if( !(0 < flip) )
			return 0

		board.setPiece(piece,x,y);
		for( var dy = -1; dy <= 1; dy++){
		for( var dx = -1; dx <= 1; dx++){
			if(dx==0 && dy==0)
				continue;
			var num = 0;
			var nx = x + dx;
			var ny = y + dy;
			var nextPiece = board.getPiece(nx,ny);
			while(nextPiece == oppositePiece){
				num++;
				nx += dx;
				ny += dy;
				nextPiece = board.getPiece(nx,ny);
			}
			if (0 < num && nextPiece == piece){
				var nx = x + dx;
				var ny = y + dy;
				var nextPiece = board.getPiece(nx,ny);
				while(nextPiece == oppositePiece){

					board.setPiece(piece, nx, ny);
					nx += dx;
					ny += dy;
					nextPiece = board.getPiece(nx,ny);
				}
			}
		}
		}

		view.message(player +" got " + flip + " pieces");
		view.paint();
		view.unhighlightAll();
		view.highlight(x,y,"#00a000");
		changeTurn();
		return flip;
	}
	Othello.doFlip = doFlip;
	/*
	 * endGame()
	 */
	function endGame(){
		var piece;
		var black=0,white=0;//Score
		for(var y = 0; y < 8; y++){
		for(var x = 0; x < 8; x++){
			piece = board.getPiece(x,y);
			if(piece == Piece.BLACK)
				black++;
			else if(piece == Piece.WHITE)
				white++;
		}
		}
		view.message("Game end!");
		if(black == white){
			view.message("same!"+ black +":"+ white);
		}else{
			var win = (black > white ? Piece.BLACK : Piece.WHITE);
			var winplayer = (win == p1.getPiece() ? p1 : p2);
			view.message(winplayer+"("+win+") Won!\n " + "Black-> " + black +"\n" + "White -> " + white); 
		}
	}
	/*
	 * selectEvent()
	 */
	function selectEvent(x,y){
		turn.selectEvent(x,y);
	}
	Othello.selectEvent = selectEvent;
})();

/*
 * Player
 */
var Player = function(piece, name){
	var othello;
	var isAssist = true;

	this.toString = function(){
		return name;
	};
	this.getPiece = function(){
		return piece;
	};
	this.turn = function(){
		if( isAssist ){
			View.putAssist(piece);
		}
	};
	this.setOthello = function(_othello){
		othello = _othello;
	};
	this.getOthello = function(){
		return othello;
	};
	/*
	 * selectEvent()
	 */
	this.selectEvent = function(x,y){
		if(othello)
			othello.doFlip(this, x, y);
	};
};

/*
 * Computer
 */
var Computer = function(piece, name){
	Player.call(this, piece, name);

	this.selectEvent = function(){};//Delete function by overwritting

	this.timer = false;

	this.turn = function(){

		if(this.timer == false){
			var self = this;
			(function(){
				var _self = self;
				setTimeout(function(){
					_self.timer = true;
					_self.turn();
					_self.timer = false;
				}, 300);
			})();
			return;
		} else{
			this.timer = false;
		}
		this.algorism();
	};
	/*
	 * Algorism
	 */
	this.algorism = function(){
		var othello = this.getOthello();
		for(var y = 0; y < 8; y++){
		for(var x = 0; x < 8; x++){
			if(0 < othello.doFlip(this, x, y) ){
			   return;
			}
		}
		}
	};
};
Computer.prototype = new Player();
Computer.prototype.constructor = Computer;
/*
 * ComputerEx
 */
var ComputerEx = function(piece, name){
	Computer.call(this, piece, name);
	this.algorism = function(){
		var othello = this.getOthello(),
			maxNum = 0,
			maxX = -1,
			maxY = -1;
			for(var y = 0; y < 8; y++){
			for(var x = 0; x < 8; x++){
				var num = othello.checkPiece(piece,x,y);
				if(maxNum < num){
					maxNum = num;
					maxX = x;
					maxY = y;
				}

			}
			}
			if(0 < maxNum)
				if( othello.doFlip(this, maxX, maxY) != maxNum )
					throw new Error("Error occured in ComputerEx");
	};
};
ComputerEx.prototype = new Computer();
ComputerEx.prototype.constructor = ComputerEx;
/*
 * ComputerOri
 */
var ComputerOri = function(piece, name){
	Computer.call(this, piece, name);

	this.algorism = function(){
		var othello = this.getOthello(),
			maxNum = 0,
			maxX = -1,
			maxY = -1;

			// Put corner
			if( othello.doFlip(this, 0, 0) || 
			    othello.doFlip(this, 0, 7) || 
			    othello.doFlip(this, 7, 0) || 
			    othello.doFlip(this, 7, 7) ){
				return;
			}

			for(var y = 0; y < 8; y++){
			for(var x = 0; x < 8; x++){
				var num = othello.checkPiece(piece,x,y);
				if(((x == 1 && y == 1)  || 
				    (x == 1 && y == 6)  || 
				    (x == 6 && y == 1)  || 
				    (x == 6 && y == 6)  ||

				    (x == 0 && y == 1)  ||
				    (x == 0 && y == 6)  ||
				    (x == 1 && y == 0)  ||
				    (x == 1 && y == 7)  ||
				    (x == 6 && y == 0)  ||
				    (x == 6 && y == 7)  ||
				    (x == 7 && y == 1)  ||
				    (x == 7 && y == 6)  
				   ) && 0 < num ){
					num = 0.5;
				}

				if(maxNum < num){
					maxNum = num;
					maxX = x;
					maxY = y;
				}
			}
			}
			if(0 < maxNum)
			//		if( othello.doFlip(this, maxX, maxY) != maxNum )
			//			throw new Error("Error occured in ComputerOri");
					if( !othello.doFlip(this, maxX, maxY) )
						throw new Error("Error occured in ComputerOri");
	};
};
ComputerOri.prototype = new Computer();
ComputerOri.prototype.constructor = ComputerOri;
/*
 * ComputerLv2
 */
var ComputerLv2 = function(piece, name){
	Computer.call(this, piece, name);

	this.algorism = function(){
		var othello = this.getOthello(),
			minNum = 9999,
			minX = -1,
			minY = -1;

			// Put corner
			if( othello.doFlip(this, 0, 0) || 
			    othello.doFlip(this, 0, 7) || 
			    othello.doFlip(this, 7, 0) || 
			    othello.doFlip(this, 7, 7) ){
				return;
			}

			for(var y = 0; y < 8; y++){
			for(var x = 0; x < 8; x++){

				var num = othello.checkPiece(piece,x,y);

				if(((x == 1 && y == 1)  || 
				    (x == 1 && y == 6)  || 
				    (x == 6 && y == 1)  || 
				    (x == 6 && y == 6)  ||

				    (x == 0 && y == 1)  ||
				    (x == 0 && y == 6)  ||
				    (x == 1 && y == 0)  ||
				    (x == 1 && y == 7)  ||
				    (x == 6 && y == 0)  ||
				    (x == 6 && y == 7)  ||
				    (x == 7 && y == 1)  ||
				    (x == 7 && y == 6)  
				   ) && 0 < num ){
					num = 100;
				}

				if( 0 < num && num < minNum){
					minNum = num;
					minX = x;
					minY = y;
				}
			}
			}
			if(0 < minNum < 1000)
					if( !othello.doFlip(this, minX, minY) ){
						throw new Error("Error occured in ComputerLv2");
					}
	};
};
ComputerLv2.prototype = new Computer();
ComputerLv2.prototype.constructor = ComputerLv2;






