/**
* ComboAnimation
* @constructor
*/
class ComboAnimation extends Animation{
	constructor(graph, id, animations, type){

		super(graph, id, type);
		this.animationids = animations;
		this.animations = []
		this.connectorMatrixes = [];
		this.sectionTimes = [];

		this.matrix = mat4.create();
		this.connectorMatrixes.push(this.matrix);

		var totaltime = 0;
		for(var i = 0; i < this.animationids.length; i++){
			
			var anim = this.graph.animations[this.animationids[i]];
			this.animations.push(anim);

			totaltime += anim.span;
			this.sectionTimes.push(totaltime);			

			this.connectorMatrixes.push(anim.calcMatrix(anim.span, anim.sectionTimes.length));
		}		
		this.span = totaltime;
	}

	calcMatrix(time, section){

		var ntime = time;
		if (section > 0)
			ntime -= this.sectionTimes[section-1]

		var argsection = 0;
		if(this.animations[section].type = "linear"){
			var ns = this.animations[section].sectionTimes.length - 2;
			while (ns >= 0){
				if (ntime > this.animations[section].sectionTimes[ns]){
					argsection = ns + 1;
					break;
				}
				ns--;
			}
		}

		var mat = this.animations[section].calcMatrix(ntime, argsection);

		mat4.identity(this.matrix);
		mat4.multiply(this.matrix, mat, this.connectorMatrixes[section]);
		return this.matrix;
	}
}
