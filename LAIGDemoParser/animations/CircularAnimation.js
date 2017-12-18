/**
* CircularAnimation
* @constructor
*/
class CircularAnimation extends Animation{
	constructor(graph, id, speed, center, radius, startang, rotang, type){
		super(graph, id, type);
		this.speed = speed;
		this.center = center;
		this.radius = radius;
		this.startang = startang;
		this.rotang = rotang;
		this.sectionTimes = [];


		this.matrix = mat4.create();

		this.span = Math.abs(this.rotang - this.startang) * Math.PI / 180 * this.radius / this.speed;
		this.sectionTimes.push(this.span);
	}

	calcMatrix(time, section){

		var rotratio = time / this.span;

		if(time <= this.span){

			mat4.identity(this.matrix);
			mat4.translate(this.matrix, this.matrix, this.center);
			mat4.rotate(this.matrix, this.matrix, this.startang*(Math.PI/180) + rotratio*this.rotang*(Math.PI/180), [0,1,0]);
			mat4.translate(this.matrix, this.matrix, [this.radius, 0, 0]);
			if(this.rotang > this.startang)
				mat4.rotate(this.matrix, this.matrix, Math.PI/2, [0,1,0]);
			else if (this.rotang < this.startang)
				mat4.rotate(this.matrix, this.matrix, -Math.PI/2, [0,1,0]);

		}
		return this.matrix;
	}
}

