/**
* Animation
* @constructor
*/
class Animation{
	constructor(graph, id, type){
		this.graph = graph;
		this.id = id;
		this.span = 0;
		this.type = type;
	}

	getSpan(){
		return this.span;
	}
	
}