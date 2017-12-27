var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 * @constructor
 */
function XMLscene(interface) {
    CGFscene.call(this);

    this.interface = interface;

    this.lightValues = {};

    var strDate = new Date();
    this.sceneStrTime = strDate.getTime() * 0.001;

    this.selectableNodes = "None";

}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
 */
XMLscene.prototype.init = function(application) {
    CGFscene.prototype.init.call(this, application);

    this.shader = new CGFshader(this.gl, "shaders/uScale.vert", "shaders/uScale.frag");
    this.shader.setUniformsValues({red: 1.0, green: 0.0, blue: 1.0}); 
    
    this.initCameras();

    this.enableTextures(true);
    
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    
    this.axis = new CGFaxis(this);

    //setting update period
    this.setUpdatePeriod(10);
    this.time = 0;

    this.setPickEnabled(true);

    this.player = 'w';
    this.pickedPiece = null;
    this.pickedPosition = null;

}

XMLscene.prototype.updateFactorTime = function(date){
    this.shader.setUniformsValues({timeFactor: date});
}

/**
 * Initializes the scene lights with the values read from the LSX file.
 */
XMLscene.prototype.initLights = function() {
    var i = 0;
    // Lights index.
    
    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
        if (i >= 8)
            break;              // Only eight lights allowed by WebGL.

        if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];
            
            this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
            this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
            this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
            this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
            
            this.lights[i].setVisible(true);
            if (light[0])
                this.lights[i].enable();
            else
                this.lights[i].disable();
            
            this.lights[i].update();
            
            i++;
        }
    }
    
}

/**
 * Initializes the scene cameras.
 */
XMLscene.prototype.initCameras = function() {
    this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(6, 20, 30),vec3.fromValues(6, 0, 5));
}

/* Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop
 */
XMLscene.prototype.onGraphLoaded = function() 
{
    this.camera.near = this.graph.near;
    this.camera.far = this.graph.far;
    this.axis = new CGFaxis(this,this.graph.referenceLength);
    
    this.setGlobalAmbientLight(this.graph.ambientIllumination[0], this.graph.ambientIllumination[1], 
    this.graph.ambientIllumination[2], this.graph.ambientIllumination[3]);
    
    this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    
    this.initLights();

    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);
    // Adds shader group.
    this.interface.addShaderNodes(this.graph.selectableNodes);
}

/**
 * Displays the scene.
 */
XMLscene.prototype.display = function() {
    // ---- BEGIN Background, camera and axis setup
    this.logPicking();
    this.clearPickRegistration();
    
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();
    
    if (this.graph.loadedOk) 
    {        
        // Applies initial transformations.
        this.multMatrix(this.graph.initialTransforms);

		// Draw axis
		this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        var actualDate = new Date();
        var actualDateTime = actualDate.getTime() * 0.001;
        if(this.sceneStrTime == null){
            this.sceneStrTime = actualDateTime;
        }
        var deltaTime = actualDateTime - this.sceneStrTime;
        this.updateFactorTime(deltaTime);

        // Displays the scene.
        this.graph.displayScene();

    }
	else
	{
		// Draw axis
		this.axis.display();
	}
    

    this.popMatrix();
    
    // ---- END Background, camera and axis setup
    
}

//override update to handle animations
XMLscene.prototype.update = function(currTime){
    var timedif = (currTime - this.time) * 0.001;
    this.time = currTime;
    for(var node in this.graph.nodes)
        this.graph.nodes[node].updateAnimation(timedif);
}


XMLscene.prototype.logPicking = function() {

    if(this.pickMode == false){
        if(this.pickResults != null && this.pickResults.length > 0){
            for(var i = 0; i < this.pickResults.length; i++){
                var obj = this.pickResults[i][0];
                if(obj){
                    var pid = this.pickResults[i][1];
                    console.log("picked object:  " + obj + " ------ pick id: " + pid);
                    
                    if(obj instanceof Piece && obj.type.toLowerCase() == this.player){
                        console.log("Piece position:   " + obj.position[0] + ", " + obj.position[1]);
                        this.pickedPiece = obj;
                    }

                    if(this.pickedPiece && obj instanceof MyQuad){
                        console.log("Destiny Position: " + Math.floor(pid/10) + ", " + pid%10);
                        this.pickedPosition = [Math.floor(pid/10), pid%10];
                        this.sendRequest([this.pickedPiece.position[0], this.pickedPiece.position[1]], [this.pickedPosition[0], this.pickedPosition[1]]);
                    }
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
}

XMLscene.prototype.sendRequest = function (pos, despos) {
    var request = new XMLHttpRequest();
    request.scene=this;
    request.open('POST', 'http://localhost:8001/', true);

    request.onload = this.handleReply;
    request.onerror = function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    var str = this.getGameState();
    var body = "";
    for (var i = 0; i < str.length; i++) {
        for (var j = 0; j < str[i].length; j++) {
            body+=str[i][j];
        };
        body+='\n';
    };
    body+= pos[0] + " " + pos[1] + "\n";
    body+= despos[0] + " " + despos[1] + "\n";

    request.send(body);
    console.log("request sent---------------------------------");
};

XMLscene.prototype.getGameState = function () {
    var ret = [
    ['*','*','*','*','*','*','*','*','*','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*',' ',' ',' ',' ',' ',' ',' ',' ','*'],
    ['*','*','*','*','*','*','*','*','*','*']
    ];

    for(var i=0;i<this.graph.blackpieces.length;i++) {
        ret[this.graph.blackpieces[i].position[0]][this.graph.blackpieces[i].position[1]] = this.graph.blackpieces[i].type;
    }
    for(var i=0;i<this.graph.whitepieces.length;i++) {
        ret[this.graph.whitepieces[i].position[0]][this.graph.whitepieces[i].position[1]] = this.graph.whitepieces[i].type;
    }
    return ret;
};
