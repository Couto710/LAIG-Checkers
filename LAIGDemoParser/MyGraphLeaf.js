/**
 * MyGraphLeaf class, representing a leaf in the scene graph.
 * @constructor
**/

function MyGraphLeaf(graph, xmlelem, args, id) {
	
	this.graph = graph;
	this.primitive = null;
	this.type = xmlelem;

	if(id != "noid")
		this.id= id;

	switch(xmlelem)
	{
		case "rectangle":
		this.primitive = new MyQuad(this.graph.scene, args);
		console.log
		break;

		case "cylinder":
		this.primitive = new MyFullCylinder(this.graph.scene, args);
		break;

		case "sphere":
		this.primitive = new MySphere(this.graph.scene, args);
		break;

		case "triangle":
		this.primitive = new MyTriangle(this.graph.scene, args);
		break;

		case "patch":
		this.primitive = new MyPatch(this.graph.scene, args);
		break;
	}
}

MyGraphLeaf.prototype.display = function(){

	if(this.primitive != null)
		this.primitive.display();
}
