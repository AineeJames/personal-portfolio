import './style.css';
import sevseg from './sevseg_font.json?url';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

class Planet {
  constructor(geomtype, size, color, trail) {
    var g = null;
    if (geomtype == 'icosahedron') {
      g = new THREE.IcosahedronGeometry(size, 0);
    } else if (geomtype == 'dodecahedron') {
      g = new THREE.DodecahedronGeometry(size, 0);
    } else if (geomtype == 'tetrahedron') {
      g = new THREE.TetrahedronGeometry(size, 0);
    } else if (geomtype == 'box') {
      g = new THREE.BoxGeometry(size, size, size);
    }
    const m = new THREE.MeshStandardMaterial({color: color});
    this.mesh = new THREE.Mesh(g, m);
    scene.add(this.mesh);

    if (trail == true) {
      this.lpoints = [];
      const g = new THREE.BufferGeometry().setFromPoints( this.lpoints );
      const m = new THREE.LineBasicMaterial({color: color});
      this.l = new THREE.Line(g, m);
      scene.add(this.l);
    }
  }
  rotate(x, y, z) {
    this.mesh.rotation.x += x;
    this.mesh.rotation.y += y;
    this.mesh.rotation.z += z;
  }
  orbit(mag, trigx, trigy, trigz, tick, speedmod) {
    this.mesh.position.x = (trigx == 'sin') ? mag*Math.sin(tick/speedmod) : mag*Math.cos(tick/speedmod);
    this.mesh.position.y = (trigy == 'sin') ? mag*Math.sin(tick/speedmod) : mag*Math.cos(tick/speedmod);
    this.mesh.position.z = (trigz == 'sin') ? mag*Math.sin(tick/speedmod) : mag*Math.cos(tick/speedmod);
  }
  updateTrail(maxlength) {
    this.lpoints.push(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));
    this.l.geometry = new THREE.BufferGeometry().setFromPoints(this.lpoints);
    scene.add(this.l);
    if (this.lpoints.length >= maxlength) {
      this.lpoints.shift();
    }
  }
}

// Basic scene, camera, and renderer setup here
const scene = new THREE.Scene();         //FOV, aspect ratio, view frustrum
const fov = (window.screen.width < 1000) ? 100 : 75;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// Initial camera setup and renderer settings
renderer.setPixelRatio(window.devicePixelRation);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(175);
camera.position.setY(50);

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const bloomPass = new UnrealBloomPass(1, 2, 0,);
composer.addPass(bloomPass);

/*   ---===Planet Definitions===---   */
const sun = new Planet('icosahedron', 15, 0xF59342, false);
const earth = new Planet('dodecahedron', 4, 0x3C81C9, true);
const planetx = new Planet('tetrahedron', 8, 0xAA3139, true);
const tiny = new Planet('box', 3, 0x6E6E6E, true);

const pointLight = new THREE.PointLight(0x6e6e6e);
pointLight.position.set(20,10,5);
const ambientLight = new THREE.AmbientLight(0x6e6e6e);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

function addBlip() {
  var randscale = Math.floor(Math.random() * 2) + 1
  const geometry = new THREE.IcosahedronGeometry(0.5 * randscale, 0);
  var rand = Math.floor(Math.random() * 3);
  const colors = [0xffffff, 0xfff7a1, 0xffc2c2];
  const material = new THREE.MeshStandardMaterial({color: colors[rand]});
  const blip = new THREE.Mesh(geometry, material);
  const x = THREE.MathUtils.randFloatSpread(1000);
  const y = THREE.MathUtils.randFloatSpread(2500);
  const z = THREE.MathUtils.randFloatSpread(1000);
  blip.position.set(x, y, z);
  scene.add(blip);
}
Array(1000).fill().forEach(addBlip);

const loader = new FontLoader();

loader.load( sevseg, function ( font ) {
	const textgeometry = new TextGeometry( 'Aiden Olsen', {
		font: font,
		size: 25,
		height: 25,
		curveSegments: 12,
	} );
  const textmesh = new THREE.Mesh( textgeometry, [
    new THREE.MeshPhongMaterial({color: 0x9e9e9e}),
    new THREE.MeshPhongMaterial({color: 0x141414})
  ] )
  textmesh.position.x = -75;
  textmesh.position.y = 35;
  textmesh.position.z = 0;
  scene.add(textmesh);
} );

loader.load( sevseg, function ( font ) {
	const textgeometry = new TextGeometry( 'Personal Portfolio', {
		font: font,
		size: 8,
		height: 20,
		curveSegments: 12,
	} );
  const textmesh = new THREE.Mesh( textgeometry, [
    new THREE.MeshPhongMaterial({color: 0x9e9e9e}),
    new THREE.MeshPhongMaterial({color: 0x141414})
  ] )
  textmesh.position.x = -42
  textmesh.position.y = 20;
  textmesh.position.z = 0;
  scene.add(textmesh);
} );

loader.load( sevseg, function ( font ) {
	const textgeometry = new TextGeometry( 'About Me', {
		font: font,
		size: 25,
		height: 15,
		curveSegments: 12,
	} );
  const textmesh = new THREE.Mesh( textgeometry, [
    new THREE.MeshPhongMaterial({color: 0x9e9e9e}),
    new THREE.MeshPhongMaterial({color: 0x000e40})
  ] )
  textmesh.position.x = -100
  textmesh.position.y = -200;
  textmesh.position.z = 0;
  scene.add(textmesh);
} );

const aboutme = 'I am a third year student attending\nOregon State University working towards\na degree in Electrical and Computer\nEngineering. I enjoy skateboarding, making\nmusic, and being outdoors.'

loader.load( sevseg, function ( font ) {
	const textgeometry = new TextGeometry( aboutme, {
		font: font,
		size: 8,
		height: 10,
		curveSegments: 12,
	} );
  const textmesh = new THREE.Mesh( textgeometry, [
    new THREE.MeshPhongMaterial({color: 0x9e9e9e}),
    new THREE.MeshPhongMaterial({color: 0x000e40})
  ] )
  textmesh.position.x = -96;
  textmesh.position.y = -215;
  textmesh.position.z = 10;
  scene.add(textmesh);
} );


/*function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
function tellPos(p){
  const lookmvmt = 5;
  console.log('Position X : ' + p.pageX + ' Position Y : ' + p.pageY);
  camera.rotation.y = 0.01 * convertRange(p.pageX, [0,1500], [lookmvmt, -lookmvmt]);
  camera.rotation.x = -0.01 * convertRange(p.pageY, [0,500], [-lookmvmt, lookmvmt]);
}
addEventListener('mousemove', tellPos, false);*/

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = 0.1 * t + 25;
}
document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  
  sun.rotate(0.01, -0.0025, -0.007);
  earth.rotate(-0.001, 0.0035, -0.002);
  planetx.rotate(0.003, -0.01, -0.002);
  tiny.rotate(-0.002, -0.001, -0.03);

  earth.orbit(50, 'sin', 'cos', 'sin', tick, 100);
  planetx.orbit(100, 'sin', 'sin', 'cos', tick, 200);
  tiny.orbit(25, 'cos', 'sin', 'sin', tick, 75);
  
  earth.updateTrail(50);
  planetx.updateTrail(70);
  tiny.updateTrail(35);
  
  tick += 1.5;
  composer.render();
}
let tick = 0;
animate();
