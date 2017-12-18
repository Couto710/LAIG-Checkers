/**
* BezierAnimation
* @constructor
*/
class BezierAnimation extends Animation{	
	constructor(graph, id, speed, controlPoints, type){

		super(graph, id, type);
		this.controlPoints = controlPoints;
		this.speed = speed;
		this.matrix = mat4.create();
		this.sectionTimes = [];

		this.p1 = this.controlPoints[0];
		this.p2 = this.controlPoints[1];
		this.p3 = this.controlPoints[2];
		this.p4 = this.controlPoints[3];

		var p12 = [(this.p1[0] - this.p2[0]) / 2, (this.p1[1] - this.p2[1]) / 2, (this.p1[2] - this.p2[2]) / 2];
		var p23 = [(this.p2[0] - this.p3[0]) / 2, (this.p2[1] - this.p3[1]) / 2, (this.p2[2] - this.p3[2]) / 2];
		var p34 = [(this.p3[0] - this.p4[0]) / 2, (this.p3[1] - this.p4[1]) / 2, (this.p3[2] - this.p4[2]) / 2];

		var p123 = [(p12[0] - p23[0]) / 2, (p12[1] - p23[1]) / 2, (p12[2] - p23[2]) / 2];
		var p234 = [(p23[0] - p34[0]) / 2, (p23[1] - p34[1]) / 2, (p23[2] - p34[2]) / 2];

		var p1234 = [(p123[0] - p234[0]) / 2, (p123[1] - p234[1]) / 2, (p123[2] - p234[2]) / 2];

		this.distance = this.getDistance(this.p1, p12) + this.getDistance(p12, p123) + this.getDistance(p123, p1234) + this.getDistance(p1234, p234) + this.getDistance(p234, p34) + this.getDistance(p34, this.p4);
		this.span = this.distance / this.speed;
		this.sectionTimes.push(this.span);
	}

	getDistance(p1, p2){
		return Math.sqrt(
			Math.pow(p2[0] - p1[0], 2) + 
			Math.pow(p2[1] - p1[1], 2) + 
			Math.pow(p2[2] - p1[2], 2));
	}

	calcMatrix(time, section){

		if(time <= this.span){

			var tratio = time / this.span;
			var invT = 1 - tratio;

			var x = this.p1[0] * Math.pow(invT, 3) +
					this.p2[0] * 3 * tratio * Math.pow(invT, 2) +
					this.p3[0] * 3 * invT * Math.pow(tratio, 2) + 
					this.p4[0] * Math.pow(tratio, 3);

			var y = this.p1[1] * Math.pow(invT, 3) +
					this.p2[1] * 3 * tratio * Math.pow(invT, 2) +
					this.p3[1] * 3 * invT * Math.pow(tratio, 2) + 
					this.p4[1] * Math.pow(tratio, 3);

			var z = this.p1[2] * Math.pow(invT, 3) +
					this.p2[2] * 3 * tratio * Math.pow(invT, 2) +
					this.p3[2] * 3 * invT * Math.pow(tratio, 2) + 
					this.p4[2] * Math.pow(tratio, 3);

			mat4.identity(this.matrix);
			mat4.translate(this.matrix, this.matrix, [x, y, z]);
		}
		return this.matrix;
	}
}
