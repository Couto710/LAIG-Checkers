/**
 * Piece
 * @constructor
 */

 function Piece(scene, material, texture, position, type) {
 	CGFobject.call(this, scene);

 	this.scene = scene;
 	this.material = material;
 	this.texture = texture;
 	this.primitive = new MyFullCylinder(this.scene, "1 2 2 10 20");
 	this.position = position;
 	this.type = type; 

 	this.animation = null;

 	this.animationMatrix = mat4.create();
 	mat4.identity(this.animationMatrix);

 	this.atime = 0;
 	this.asec = 0;
 	this.playing = false;
 }

 Piece.prototype = Object.create(CGFobject.prototype);
 Piece.prototype.constructor = Piece;

 Piece.prototype.display = function() {

 	this.scene.pushMatrix();
 	this.scene.rotate(-Math.PI/2, 1, 0, 0);
 	this.material.setTexture(this.texture[0]);
 	this.material.apply();
 	this.primitive.display();
 	this.scene.popMatrix();

 }

 Piece.prototype.updateAnimation = function(timedif){

 	if(this.playing){
 		this.atime += timedif;
 		if(this.atime <= this.animation.getSpan()){ 
 			this.animationMatrix = this.animation.calcMatrix(this.atime, this.asec);
 			console.log(this.animationMatrix[12] + "    " + this.animationMatrix[13] + "    " + this.animationMatrix[14] + "    ");
 			if (this.atime >= this.animation.sectionTimes[this.asec])
 				this.asec++;
 		}
 		else if(this.atime > this.animation.getSpan()){
 			this.asec = 0;
 			this.atime = 0;
 			this.playing = false;
 		}

 	}
 }