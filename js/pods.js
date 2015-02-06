var scene, camera, renderer, objects;

var video, videocanvas, videocanvasctx;

var pointLight;

var sphere, spheretexture, sphereMesh, material;

init();


function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 15, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 100, 150, 5000 );
	camera.target = new THREE.Vector3( 0, 150, 0 );

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xf0f0f0 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// creating video element to hold video
	video = document.createElement( 'video' );
	video.loop = true;
	video.src = "textures/givemeskin.mp4";
	video.load(); // must call after setting/changing source
	video.play();
	
	// make video canvas
	videocanvas = document.createElement( 'canvas' );
	videocanvasctx = videocanvas.getContext( '2d' );

	// set its size
	videocanvas.width = 320;
	videocanvas.height = 380;

	// draw black rectangle so spheres don't start out transparent
	videocanvasctx.fillStyle = "#000000";
	videocanvasctx.fillRect( 0, 0, 380, 380 );

	// add canvas to new texture
	spheretexture = new THREE.Texture(videocanvas, new THREE.SphericalReflectionMapping());

	// add texture to material that will be wrapped around the sphere
	var material = new THREE.MeshPhongMaterial( {
		color: 0xffffff, //the base color of the object, white here
		ambient: 0xffffff, //ambient color of the object, also white
		specular: 0x050505, //color for specular highlights, a dark grey here
		shininess: 50,
		map: spheretexture //the texture you created from the video
		} );
	// Spheres

	objects = [];

	sphere = new THREE.SphereGeometry( 100, 32, 32 );


	 // modify UVs to accommodate MatCap texture
	var faceVertexUvs = sphere.faceVertexUvs[ 0 ];
	for ( i = 0; i < faceVertexUvs.length; i ++ ) {

		var uvs = faceVertexUvs[ i ];
		var face = sphere.faces[ i ];

		for ( var j = 0; j < 3; j ++ ) {

			uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
			uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;

		}

	}
	

	for ( var i = 0; i < 1; i ++ ) {

		sphereMesh = new THREE.Mesh( sphere, material );


		sphereMesh.rotation.z = 0;

	






		// sphereMesh.position.x = Math.random() * 1000 - 500;
		// sphereMesh.position.y = Math.random() * 1000 - 500;
		// sphereMesh.position.z = Math.random() * 1000 - 500;

		// sphereMesh.rotation.x = Math.random() * 200 - 100;
		// sphereMesh.rotation.y = Math.random() * 200 - 100;
		// sphereMesh.rotation.z = Math.random() * 200 - 100;

		sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = 1;

		objects.push( sphereMesh );

		scene.add( sphereMesh );

	}

	
	// Lights

	var ambientLight = new THREE.AmbientLight( 0x202020 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.x = 0.5;
	directionalLight.position.y = 0.5;
	directionalLight.position.z = 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xff0000, 1 );
	scene.add( pointLight );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function render() {

	camera.lookAt( camera.target );


	for ( var i = 0, l = objects.length; i < l; i++ ) {

		var object = objects[ i ];

		
		object.position.y = Math.sin( object.rotation.y ) * 200;


	}

	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

		videocanvasctx.drawImage( video, 0, 0 );

		spheretexture.needsUpdate = true;
	}

		renderer.render( scene, camera );

		window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);