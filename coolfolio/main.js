import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
const filmPass = new FilmPass(0.1, 0.05, 1000, 0);
//composer.addPass(filmPass);

const geometry = new THREE.IcosahedronGeometry(15, 0);
const material = new THREE.MeshStandardMaterial({color: 0xF59342});
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

const egeometry = new THREE.DodecahedronGeometry(4, 0);
const ematerial = new THREE.MeshStandardMaterial({color: 0x3C81C9});
const earth = new THREE.Mesh(egeometry, ematerial);
scene.add(earth);

const geomx = new THREE.TetrahedronGeometry(8, 1 );
const matx = new THREE.MeshStandardMaterial({color: 0xAA3139});
const planetx = new THREE.Mesh(geomx, matx);
scene.add(planetx);

const geomt = new THREE.BoxGeometry(3, 3, 3);
const matt = new THREE.MeshStandardMaterial({color: 0x6e6e6e});
const planett = new THREE.Mesh(geomt, matt);
scene.add(planett);

const pointLight = new THREE.PointLight(0x6e6e6e);
pointLight.position.set(20,10,5);
const ambientLight = new THREE.AmbientLight(0x6e6e6e);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

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

const elinematerial = new THREE.LineBasicMaterial({color: 0x3c81c9});
const epoints = [];
const elinegeometry = new THREE.BufferGeometry().setFromPoints( epoints );
const eline = new THREE.Line( elinegeometry, elinematerial );
scene.add(eline);

const xlinematerial = new THREE.LineBasicMaterial({color: 0xAA3139});
const xpoints = [];
const xlinegeometry = new THREE.BufferGeometry().setFromPoints( xpoints );
const xline = new THREE.Line( xlinegeometry, xlinematerial );
scene.add(xline);

const tlinematerial = new THREE.LineBasicMaterial({color: 0x6e6e6e});
const tpoints = [];
const tlinegeometry = new THREE.BufferGeometry().setFromPoints( tpoints );
const tline = new THREE.Line( tlinegeometry, tlinematerial );
scene.add(tline);
const loader = new FontLoader();

loader.load( './sevseg_font.json', function ( font ) {
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

loader.load( './sevseg_font.json', function ( font ) {
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

loader.load( './sevseg_font.json', function ( font ) {
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

loader.load( './sevseg_font.json', function ( font ) {
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


function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}
/*function tellPos(p){
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

  sun.rotation.x += 0.001;
  sun.rotation.y += 0.0035;
  sun.rotation.z += 0.002;

  earthTick += 0.01;
  let newEarthX = 50*Math.sin(earthTick);
  let newEarthY = 50*Math.cos(earthTick);
  let newEarthZ = 10*Math.sin(earthTick);
  earth.position.set(newEarthX, newEarthY, newEarthZ);
  earth.rotation.x -= 0.001;
  earth.rotation.y += 0.0035;
  earth.rotation.z -= 0.002;
 
  planetxTick += 0.003;
  let newPlanetxX = 10*Math.sin(earthTick);
  let newPlanetxY = -100*Math.sin(earthTick);
  let newPlanetxZ = 100*Math.cos(earthTick);
  planetx.position.set(newPlanetxX, newPlanetxZ, newPlanetxY);
  planetx.rotation.x += 0.003;
  planetx.rotation.y -= 0.01;
  planetx.rotation.z -= 0.002;
  
  planettTick += 0.008;
  let newPlanettX = -25*Math.sin(planettTick);
  let newPlanettY = -25*Math.cos(planettTick);
  let newPlanettZ = 50*Math.cos(planettTick);
  planett.position.set(newPlanettX, newPlanettY, newPlanettZ);
  planett.rotation.x -= 0.002;
  planett.rotation.y -= 0.001;
  planett.rotation.z -= 0.03;

  epoints.push( new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z));
  eline.geometry = new THREE.BufferGeometry().setFromPoints(epoints);
  scene.add(eline);
  elinecount += 1;
  if ( elinecount > 50 ) {
    epoints.shift();
  } 
  
  xpoints.push( new THREE.Vector3( planetx.position.x, planetx.position.y, planetx.position.z));
  xline.geometry = new THREE.BufferGeometry().setFromPoints(xpoints);
  scene.add(xline);
  xlinecount += 1;
  if ( xlinecount > 70 ) {
    xpoints.shift();
  } 
  
  tpoints.push( new THREE.Vector3( planett.position.x, planett.position.y, planett.position.z));
  tline.geometry = new THREE.BufferGeometry().setFromPoints(tpoints);
  scene.add(tline);
  tlinecount += 1;
  if ( tlinecount > 35 ) {
    tpoints.shift();
  }

  //camera.position.x = 0;
  //camera.position.y = 0;
  //camera.position.z = 175;

  //controls.update();
  //renderer.render(scene, camera);
  composer.render();
}
let elinecount = 0;
let xlinecount = 0;
let tlinecount = 0;
let earthTick = 0;
let planetxTick = 0;
let planettTick = 0;
let camTick = 0;
animate();
