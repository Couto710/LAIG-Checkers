/**
 * Piece
 * @constructor
 */

function Piece(scene, material, texture, position) {
	CGFobject.call(this, scene);

	this.scene = scene;
	this.material = material;
	this.texture = texture;
	this.primitive = new MyFullCylinder(this.scene, "1 2 2 10 20");
	this.position = position;
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