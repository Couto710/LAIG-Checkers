function MyPatch(scene, args) {
	this.args = args.split(" ").map(Number);

	this.degree1 = this.args[0];
	this.degree2 = this.args[1];
	this.controlvertexes = this.args[2];
	this.translation = this.args[3];
	
	this.makeSurface(degree1,degree2,controlvertexes,translation);
			
};

MyPatch.prototype.getKnotsVector = function(degree) {
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;  
}


MyPatch.prototype.makeSurface = function (degree1, degree2, controlvertexes, translation) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2);
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); // TODO  (CGF 0.19.3): remove knots1 and knots2 from CGFnurbsSurface method call. Calculate inside method.
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	//var obj = new CGFnurbsObject(this, getSurfacePoint, 20, 20 );
	//this.surfaces.push(obj);
}      
	
	