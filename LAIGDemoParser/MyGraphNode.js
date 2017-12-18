/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/

function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;
    
    // IDs of child nodes.
    this.children = [];

    // IDs of child leaf nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    //animations
    this.animations = [];

    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);

    this.atime = 0;
    this.aind = 0;
    this.asec = 0;

    this.selectable = false;

}
/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

//updates animation, requests new matrix
MyGraphNode.prototype.updateAnimation = function(timedif){

    this.atime += timedif;

    if(this.aind < this.animations.length){
        
        var nowani = this.graph.animations[this.animations[this.aind]];
        this.animationMatrix = nowani.calcMatrix(this.atime, this.asec);

        if(this.atime >= nowani.getSpan()){
            this.aind++;
            this.asec = 0;
            this.atime = 0;
        }
        else if (this.atime >= nowani.sectionTimes[this.asec])
            this.asec++;
    }
}


