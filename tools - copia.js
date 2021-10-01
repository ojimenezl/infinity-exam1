import * as THREE from './build/three.module.js';
import Stats from './jsm/libs/stats.module.js';
import { FlyControls } from './jsm/controls/FlyControls.js';
import { Lensflare, LensflareElement } from './jsm/objects/Lensflare.js';


// const THREE = require('./build/three.module.js');
// const Stats = require('./jsm/libs/stats.module.js');
// const FlyControls = require('../models/task');
// const Lensflare, LensflareElement = require('../models/task');

//base
// const Planetas = require('../models/task');
//

let container, stats;
let camera, scene, renderer;
let controls, group;
let INTERSECTED;
let theta = 0;
let enableSelection = false;
const pointer = new THREE.Vector2();
const radius = 100;
const objects = [];
var user_id;

let mesh;
const clock = new THREE.Clock();
const mouse = new THREE.Vector2(),
    raycaster = new THREE.Raycaster();
const text_box = document.getElementById('text-box');
const element = document.getElementById('info');
init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // camera

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
    camera.position.z = 250;
    camera.position.x = -0.2008547008547008;
    camera.position.y = 0.1097560975609756;

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background, 3500, 15000);

    //const loader = new THREE.CubeTextureLoader();
    //const texture = loader.load([
    //    './resources/poosx.jpg',
    //    './resources/noegx.jpg',
    //    './resources/poosy.jpg',
    //    './resources/noegy.jpg',
    //    './resources/poosz.jpg',
    //    './resources/noegz.jpg',
    //]);
    //texture.encoding = THREE.sRGBEncoding;
    //texture.setHSL(0.5, 0.5, 1)
    //scene.background = texture;
    //scene.fog = new THREE.Fog(scene.background, 3500, 15000);

    //group
    group = new THREE.Group();
    scene.add(group);


    // world

    const s = 250;





    // stars

    // const geometry = new THREE.BoxGeometry(s, s, s);
    const geometrystars = new THREE.SphereGeometry(5, 32, 16);
    const materialstars = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 50 });

    for (let i = 0; i < 100; i++) {

        mesh = new THREE.Mesh(geometrystars, materialstars);

        mesh.position.x = 5000 * (2.0 * Math.random() - 1.0);
        mesh.position.y = 5000 * (2.0 * Math.random() - 1.0);
        mesh.position.z = 5000 * (2.0 * Math.random() - 1.0);

        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add(mesh);

    }




    //planets

    // const geometry = new THREE.BoxGeometry(s, s, s);
    // 850, 36, 14
    //const geometryplanet = new THREE.SphereGeometry(850, 3, 32,0,6.3,3,6.3); //radio, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float

    const geometryplanet = new THREE.SphereGeometry(850, 3, 32,0,6.3,3,6.3);
    const materialplanet = new THREE.MeshPhongMaterial({ color: 0x4f49d,emissive:0x0, specular: 0xa33e62, shininess: 50,flatShading:true});

    for (let j = 0; j < 1; j++) {

        mesh = new THREE.Mesh(geometryplanet, materialplanet);
        var t,r,e;
        t=Math.random();
	r=Math.random();
	e=Math.random();

        mesh.position.x = 5000 * (2.0 * t - 1.0);
        mesh.position.y = 5000 * (2.0 * r - 1.0);
        mesh.position.z = 5000 * (2.0 * e - 1.0);

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        mesh.castShadow = true;
        mesh.receiveShadow = true;
	addLight( 0.08, 0.8, 0.5, ((5000 * (2.0 * t - 1.0))), ((5000 * (2.0 * r - 1.0))),  ((5000 * (2.0 * e - 1.0))) );

        scene.add(mesh);
    }



//ring

const geometryRing = new THREE.RingGeometry( 850*3, 850*1.3, 300 );
const materialRing = new THREE.MeshBasicMaterial( { color: 0x4f49d,wireframe:true, side: THREE.DoubleSide } );
//const materialRing = new THREE.MeshBasicMaterial( { color: 0x4f49d,emissive:0x0, specular: 0xa33e62, shininess: 50,flatShading:true});
const meshRing = new THREE.Mesh( geometryRing, materialRing );
meshRing.position.x = 5000 * (2.0 * t - 1.0);
meshRing.position.y = 5000 * (2.0 * r - 1.0);
meshRing.position.z = 5000 * (2.0 * e - 1.0);
scene.add( meshRing );


    //sun
   // const color = new THREE.Color("#19FF24");
    // const geometry = new THREE.IcosahedronGeometry(850, 15);
   // const geometry = new THREE.SphereGeometry(850, 32, 16);
   // const material = new THREE.MeshBasicMaterial({ color: color });
   // const sphere = new THREE.Mesh(geometry, material);
   // sphere.position.set(250, -0.2008547008547008, 0.1097560975609756);
    
    //sphere.layers.set(1);
    //scene.add(sphere);


    //earth geometry
    const earthgeometry = new THREE.SphereGeometry(850, 32, 16);
    //earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: THREE.ImageUtils.loadTexture("texture/earthmap1.jpg"),
        bumpMap: THREE.ImageUtils.loadTexture("texture/bump.jpg"),
        bumpScale: 0.3,
    });




    //earthMesh
    const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
    // earthMesh.layers.set(0);
    const m = Math.random();
    const n = Math.random();
    const o = Math.random();
    // earthMesh.position.x = 5000 * (2.0 * m - 1.0);
    // earthMesh.position.y = 5000 * (2.0 * n - 1.0);
    // earthMesh.position.z = 5000 * (2.0 * o - 1.0);
    //  addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );
    earthMesh.position.z = 250;
    earthMesh.position.x = -0.2008547008547008;
    earthMesh.position.y = 0.1097560975609756
    //console.log("ram= ", m)



    earthMesh.matrixAutoUpdate = false;
    earthMesh.updateMatrix();

    scene.add(earthMesh);

    //select
    // raycaster = new THREE.Raycaster();

    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // container.appendChild(renderer.domElement);

    // stats = new Stats();
    // container.appendChild(stats.dom);



    //

    // window.addEventListener('resize', onWindowResize);



    //

    //cloud geometry
    // const cloudgeometry = new THREE.SphereGeometry(1, 32, 32);
    const cloudgeometry = new THREE.SphereGeometry(850, 232, 16);

    //cloud material
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture("texture/earthCloud.png"),
        transparent: true,
    });

    //cloudMesh
    const cloud = new THREE.Mesh(cloudgeometry, cloudMaterial);
    earthMesh.layers.set(0);
    //cloud.position.z = 5000 * (2.0 * m - 1.0);
    //cloud.position.x = 5000 * (2.0 * n - 1.0);
    //cloud.position.y = 5000 * (2.0 * m - 1.0)

    cloud.position.z = 250;
    cloud.position.x = -0.2008547008547008;
    cloud.position.y = 0.1097560975609756
    // console.log("ram= ", m)

    //cloud.rotation.x = Math.random() * Math.PI;
    //cloud.rotation.y = Math.random() * Math.PI;
    //cloud.rotation.z = Math.random() * Math.PI;

    cloud.matrixAutoUpdate = false;
    cloud.updateMatrix();
    scene.add(cloud);



    //moon geometry
    // const moongeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const moongeometry = new THREE.SphereGeometry(450, 52, 36);

    //moon material
    const moonMaterial = new THREE.MeshPhongMaterial({
        roughness: 5,
        metalness: 0,
        map: THREE.ImageUtils.loadTexture("texture/moonmap4k.jpg"),
        bumpMap: THREE.ImageUtils.loadTexture("texture/moonbump4k.jpg"),
        bumpScale: 0.02,
    });

    //moonMesh
    const moonMesh = new THREE.Mesh(moongeometry, moonMaterial);
    moonMesh.receiveShadow = true;
    moonMesh.castShadow = true;
    // moonMesh.position.x = 20;
    // moonMesh.layers.set(0);



    moonMesh.position.x = 5000 * (2.0 * Math.random() - 1.0);
    moonMesh.position.y = 5000 * (2.0 * Math.random() - 1.0);
    moonMesh.position.z = 5000 * (2.0 * Math.random() - 1.0);

    moonMesh.rotation.x = Math.random() * Math.PI;
    moonMesh.rotation.y = Math.random() * Math.PI;
    moonMesh.rotation.z = Math.random() * Math.PI;

    moonMesh.matrixAutoUpdate = false;
    moonMesh.updateMatrix();

    scene.add(moonMesh);

    // var moonPivot = new THREE.Object3D();
    // earthMesh.add(moonPivot);
    // moonPivot.add(moonMesh);

    // var cameraPivot = new THREE.Object3D();
    // earthMesh.add(cameraPivot);
    // cameraPivot.add(camera);












    // lights

    const dirLight = new THREE.DirectionalLight(0xffffff, 5.05);
    dirLight.position.set(0, - 1, 10).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    // lensflares
   // const textureLoader = new THREE.TextureLoader();

   // const textureFlare0 = textureLoader.load('textures/lensflare/lensflare0.png');
   // const textureFlare3 = textureLoader.load('textures/lensflare/lensflare3.png');
    addLight( 0.55, 0.9, 0.5, 5000, 0, - 1000 );
    addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );
    addLight( 0.995, 0.5, 0.9, 5000, 5000, - 1000 );


    //addLight(0.55, 0.3, 0.3, 10000, 5000, 2000);
    //addLight(0.08, 0.8, 0.5, 10000, 5000, 1000);
    //addLight(0.995, 0.5, 0.9, 10000, 5000, 2000);

    function addLight(h, s, l, x, y, z) {
	const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load('textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('textures/lensflare/lensflare3.png');

        const light = new THREE.PointLight(0xffffff, 1.5, 2000 );
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        console.log("x: ",x,"y: ",y,"z: ",z)
        scene.add(light);

        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        light.add(lensflare);

    }

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;


    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    //

    controls = new FlyControls(camera, renderer.domElement);

    controls.movementSpeed = 1500;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    // stats

    stats = new Stats();
    container.appendChild(stats.dom);

    // events
    //document.addEventListener('click', onClick);
    //document.addEventListener('mousemove', onPointerMove);

    window.addEventListener('resize', onWindowResize);
    //window.addEventListener('keydown', onKeyDown);
    //window.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown, false);
   
    //var projector = new THREE.Projector();

}


function onMouseDown(e) {
   
 event.preventDefault();


}


function onKeyDown(event) {

    enableSelection = (event.keyCode === 16) ? true : false;

}

function onKeyUp() {

    enableSelection = false;

}

function onClick(event) {

    event.preventDefault();
    //console.log("enable=", enableSelection)
    if (enableSelection === true) {



        // const draggableObjects = controls.getObjects();
        // draggableObjects.length = 0;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObjects(objects, true);

        if (intersections.length > 0) {


            const object = intersections[0].object;

            if (group.children.includes(object) === true) {

                mesh.material.emissive.set(0x000000);
                scene.attach(mesh);

            } else {
                alert("hola")
                mesh.material.emissive.set(0xaaaaaa);
                group.attach(mesh);

            }

            controls.transformGroup = true;
            // draggableObjects.push(group);

        } else {
            alert("hola2= ", mesh);
        }

        // if (group.children.length === 0) {

        //     controls.transformGroup = false;
        //     draggableObjects.push(...objects);

        // }

    }

    render();

}

//

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


}

//

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {



    const delta = clock.getDelta();

    theta += 0.1;

    // camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    // camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    // camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
    // camera.lookAt(scene.position);

    // camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera(pointer, camera);
    //console.log("ray: ",raycaster.setFromCamera(pointer, camera))
    const intersects = raycaster.intersectObjects(scene.children);
    //console.log("Inter: ",intersects)

    if (intersects.length > 0) {

        if (INTERSECTED != intersects[0].object) {
		//borrar ifs =INTERSECTED.currentHex 
            if (INTERSECTED && INTERSECTED.currentHex) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
	
            INTERSECTED = intersects[0].object;
	    console.log("--",INTERSECTED.material.emissive)
	    if(INTERSECTED.currentHex){
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
	    }
            // console.log("mmm= ", pointer)

            // element.innerHTML = `<form action="tapworld.php" method="get"> <input id="2"type="hidden" name="2" value="${pointer.x}" ></input> </form>`;
	    const position = new THREE.Vector3();
            position.setFromMatrixPosition( mesh.matrixWorld );
            //alert(position.x + ',' + position.y + ',' + position.z);
	    //console.log(mesh.id)
            //console.log("position: ",position)
            //console.log("INTERS: ",INTERSECTED.id)
	
		
		var opcion,idplanet;
		opcion = 5;
    		idplanet=INTERSECTED.id;

		
    		tablaUsuarios = $('#tablaUsuarios').DataTable({  
   		"destroy":true,
		"searching":false,
                "paging":false,
                "info":false,
		"ajax":{            
     		   "url": "crud_2020_ajax/bd/crud.php", 
     		   "method": 'POST', //usamos el metodo POST
     		   "data":{opcion:opcion,idplanet:idplanet}, //enviamos opcion 4 para que haga un SELECT
      		   "dataSrc":""
  		  },
   		 "columns":[
     		   {"data": "username"},
      		   {"defaultContent": "<div class='text-center'><div class='btn-group'></div></div>"}
   		 ]
		});  

		
			
           
    		








		
	
            //element.innerHTML = `<input type="text" name="username" id="username" value="${nombre.nombre}" />`

		
            	text_box.append(element);


        }

    } else {
        if (element.value) {
            console.log(element.value)
        }


        if (INTERSECTED && INTERSECTED.currentHex) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }



    controls.update(delta);
    renderer.render(scene, camera);

}




function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

}
