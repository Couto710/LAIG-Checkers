/**
 * Board
 * @constructor
 */

function Board(scene) {
 	CGFobject.call(this, scene);

 	this.scene = scene;

 	this.positions = [];

 	for(var i = 0; i < 8; i++){
 		var col = [];
 		for(var j = 0; j < 8; j++){
 			var pos = new MyQuad(this.scene, "0 1 1 0");
 			col.push(pos);
 		}
 		this.positions.push(col);
 	}
 };

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function() {

 	for(var i = 0; i < 8; i++){
 		for(var j = 0; j < 8; j++){
 			this.scene.pushMatrix();

 			this.scene.translate(i*5, 0.001, j*5);
 			this.scene.scale(5, 0, 5);
 			this.scene.rotate(-Math.PI/2, 1, 0, 0);

 			var pid = (i+1)*10 + j+1;
 			this.scene.registerForPick(pid, this.positions[i][j]);

 			this.positions[i][j].display();

 			this.scene.popMatrix(); 
 		}
 	}
 };