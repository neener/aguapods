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

		// var degrees=25;

		// sphereMesh.rotation.y = degrees * (Math.PI / 180);

		sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = 1;
		
		// sphereMesh.clickURL = "http://youtu.be/TbZmVfs7MiM";
		

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

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );

}



function onDocumentMouseDown(event){
	event.preventDefault();

	var vector = new THREE.Vector3();
	var raycaster = new THREE.Raycaster();
	var dir = new THREE.Vector3();

	vector.set(
		( event.clientX / window.innerWidth ) * 2 - 1,
		- (event.clientY / window.innerHeight ) * 2 + 1,
		0.5 );

	vector.unproject(camera);

	raycaster.set(camera.position, vector.sub(camera.position).normalize());
	
	var intersects = raycaster.intersectObjects(scene.children, false);
	window.location = "http://youtu.be/TbZmVfs7MiM";

	if (intersects.length > 0){
		console.log('object is selected!');
	}
}




function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

// function onDocumentTouchStart( event ) {

// 	event.preventDefault();

// 	event.clientX = event.touches[0].clientX;
// 	event.clientY = event.touches[0].clientY;
// 	onDocumentMouseDown( event );
// }

// function onDocumentMouseDown( event ) {

// 	event.preventDefault();

// 	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
// 	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

// 	// raycaster.setFromCamera( mouse, camera );

// 	var intersects = raycaster.intersectObjects( scene.children );
// 	window.open = intersects[0].clickUrl
	
// }

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