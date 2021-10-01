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
var tablaUsuarios;
let mesh;
const clock = new THREE.Clock();
const mouse = new THREE.Vector2(),
    raycaster = new THREE.Raycaster();
const text_box = document.getElementById('text-box');
const element = document.getElementById('info');
const elementos = document.createElement('p');
init();
animate();
var url= 'crud_2020_ajax/index.php'



function init() {

const { username, username2,username3 } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
console.log("username",username,username2,username3)
//fetch('crud_2020_ajax/index.php')
  //.then(response => response.json())
  //.then(result => console.log(result))		

    container = document.createElement('div');
    document.body.appendChild(container);

    // camera

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
    if(username3){
    console.log("listo")
    camera.position.x = parseFloat(username);
    camera.position.y = parseFloat(username2);
    camera.position.z = parseFloat(username3);
    }else{
    console.log("ram")
    camera.position.x = 5000 * (2.0 * Math.random() - 1.0);
    camera.position.y = 5000 * (2.0 * Math.random() - 1.0);
    camera.position.z = 5000 * (2.0 * Math.random() - 1.0);
    }
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

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

fetch('baseJs.json',{
 headers : { 
         'Content-Type': 'application/json',
         'Accept': 'application/json'
        }
})
			.then(respuesta => respuesta.json())
			.then(respuesta => {
				respuesta.forEach(pl =>{
					crearPlanet(pl.radius,pl.width,pl.height,pl.phiStart,pl.phiLength,pl.thetaStart,pl.thetaLength,pl.color,pl.flatShading,pl.wireframe,pl.x,pl.y,pl.z,pl.material,pl.nameMaterial,pl.bumpMaterial,pl.ring);
					addLight( 0.08, 0.8, 0.5, pl.x, pl.y, pl.z);
					})
				
				})
	
		











/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////    



    



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
	    //console.log("--",INTERSECTED.material.emissive)
	    if(INTERSECTED.currentHex){
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
	    }
            // console.log("mmm= ", pointer)


		



           // element.innerHTML = `<form action="tapworld.php" method="get"> <input id="2"type="hidden" name="2" value="${pointer.x} ${pointer.y} ${pointer.z}" ></input> </form>`;
	    const position = new THREE.Vector3();
            position.setFromMatrixPosition( mesh.matrixWorld );
      
            //elementos = document.createElement('p');
        //elementos.innerHTML = `<b>Tu: </b>${INTERSECTED.position.x} ${INTERSECTED.position.y} ${INTERSECTED.position.z}`;
        //text_box.append(elementos);
            //alert(position.x + ',' + position.y + ',' + position.z);
	    //console.log(mesh.id)
            //console.log("position: ",position)
            console.log("INTERS: ",INTERSECTED)
	
		
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
     		   "data":{opcion:opcion,idplanet:idplanet}, //enviamos opcion 5 para que haga un SELECT
      		   "dataSrc":""
  		  },
   		 "columns":[
     		    {"data": "cod_planeta"},
        	    {"data": "nombre_planeta"},
        	    {"data": "propietario"},
       	            {"data": "social_media"},
       	 	    {"data": "precio_compra"},
        	    {"data": "precio_venta"},
      		   // {"defaultContent": "<div class='text-center'><div class='btn-group'><input type='text' name='username' id='username' value='${pointer.x} ${pointer.y} ${pointer.z}</div></div>'"}
   		 //{"defaultContent": "<div class='text-center'><div class='btn-group'><button class='btn btn-primary btn-sm btnEditar'><i class='material-icons'>${pointer.x}</i></button></div></div>"}
		//{"defaultContent": "<input type='text' value=pointer.y>"}
		 ]
		});  


			
           
    		

        





		
	 //SELECT codigo_planeta,codigo_compra FROM registro_compra WHERE codigo_planeta ='m7P2r0jZ9' and codigo_compra='compra7722qwerr'
            //element.innerHTML = `<input type="text" name="username" id="username" value="${pointer.x} ${pointer.y} ${pointer.z}" />`

		
            	//text_box.append(element);


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

function crearPlanet(radius,width,height,phiStart,phiLength,thetaStart,thetaLength,color,flatShading,wireframe,x,y,z,material,nameMaterial,bumpMaterial,ring){

if(material==1){
 
    const earthgeometry = new THREE.SphereGeometry(radius,width,height,phiStart,phiLength,thetaStart,thetaLength);
 
    const earthMaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: THREE.ImageUtils.loadTexture(nameMaterial),
        bumpMap: THREE.ImageUtils.loadTexture(bumpMaterial),
        bumpScale: 0.3,
    });

    const earthMesh = new THREE.Mesh(earthgeometry, earthMaterial);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
    // earthMesh.layers.set(0);

    
    earthMesh.position.x = x;
    earthMesh.position.y = y;
    earthMesh.position.z = z;


    earthMesh.matrixAutoUpdate = false;
    earthMesh.updateMatrix();


    scene.add(earthMesh);

}else{
    var r=color.r,g=color.g,b=color.b;
    var colorparse="rgb("+r+","+g+","+b+")";
    const color1 = new THREE.Color(colorparse);
    console.log("color planet",color1.getHexString())

    const geometryplanet = new THREE.SphereGeometry(radius,width,height,phiStart,phiLength,thetaStart,thetaLength);
    const materialplanet = new THREE.MeshPhongMaterial({ color: color1,emissive:0x0, specular: 0xa33e62, shininess: 50,flatShading:flatShading,wireframe:wireframe});

    

        mesh = new THREE.Mesh(geometryplanet, materialplanet);


        mesh.position.x = x
        mesh.position.y = y
        mesh.position.z = z

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        mesh.castShadow = true;
        mesh.receiveShadow = true;

	

        scene.add(mesh);
 
   

}

if(ring==1){
  var r=color.r,g=color.g,b=color.b;
  var colorparse="rgb("+r+","+g+","+b+")";
  const color1 = new THREE.Color(colorparse);
  const geometryRing = new THREE.RingGeometry( radius*3, radius*1.3, 300 );
  const materialRing = new THREE.MeshBasicMaterial( { color: color1,wireframe:wireframe, side: THREE.DoubleSide } );
  const meshRing = new THREE.Mesh( geometryRing, materialRing );
  meshRing.position.x = x
  meshRing.position.y = y
  meshRing.position.z = z
  scene.add( meshRing );

}




}


