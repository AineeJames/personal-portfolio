import './style.css';
import me from './me2.jpg'
import pcb from './latticepcb.jpg';
import snupload from './snupload.png';
import snhome from './snhome.png';
import sevseg from './sevseg_font.json?url';
import code from './codefont.json?url';
import about from './about.svg';
import gear from './gears-solid.svg';
import link from './link.svg';
import contact from './contact.svg';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

class Planet {
  constructor(geomtype, size, color, trail, wireframe) {
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
    const m = new THREE.MeshStandardMaterial({color: color, wireframe: wireframe});
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

const textids = {};
class Text {
  constructor(text, fsize, fheight, fcolor, xyz, font, uidstr = "") {
    const loader = new FontLoader();
    loader.load(font, function(font) {
      const textgeo = new TextGeometry(text, {
        font: font,
        size: fsize,
        height: fheight,
        curveSegments: 12,
      });
      const textmesh = new THREE.Mesh(textgeo, [
        new THREE.MeshPhongMaterial({color: 0xffffff}),
        new THREE.MeshPhongMaterial({color: fcolor})
      ])
      textmesh.position.set(xyz[0], xyz[1], xyz[2]);
      scene.add(textmesh);
      if (uidstr != ""){
        //textids.push(textmesh.id);
        textids[uidstr] = textmesh.id;
      }
    });
  }
}

const iconids = {};
class Icon {
  constructor(svg, scale, xyz, uidstr = "") {
    const loader = new SVGLoader();
    loader.load(
      svg,
      function ( data ) {
        const paths = data.paths;
        const group = new THREE.Group();
        const groupids = [];
        for ( let i = 0; i < paths.length; i ++ ) {
          const path = paths[ i ];
          const material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            side: THREE.DoubleSide,
            depthWrite: false
          } );
          const shapes = SVGLoader.createShapes( path );
          for ( let j = 0; j < shapes.length; j ++ ) {
            const shape = shapes[ j ];
            const geometry = new THREE.ShapeGeometry( shape );
            const mesh = new THREE.Mesh( geometry, material );
            mesh.scale.set(scale, scale, scale);
            mesh.rotation.z = 180 * (Math.PI/180);
            mesh.position.set(xyz[0], xyz[1], xyz[2]);
            if (uidstr != "") {
              groupids.push(mesh.id);
            }
            group.add( mesh );
          }
        }
        scene.add(group);
        if (uidstr != "") {
          iconids[uidstr] = groupids;
        }
      },
    );
  }
}

class Image {
  constructor(img, xyz, w, h) {
    const texture = new THREE.TextureLoader().load(img);
    const geometry = new THREE.BoxBufferGeometry( w, h, 1 );
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(xyz[0], xyz[1], xyz[2]);
    scene.add(mesh);
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
camera.position.setZ(180);
camera.position.setY(50);

const composer = new EffectComposer( renderer );
const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );
const params = {
  exposure: 1,
  bloomStrength: 0.6,
  bloomThreshold: 0,
  bloomRadius: 1
};
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
				bloomPass.threshold = params.bloomThreshold;
				bloomPass.strength = params.bloomStrength;
				bloomPass.radius = params.bloomRadius;
//const bloomPass = new UnrealBloomPass(1, 1.3, 0.3,);
composer.addPass(bloomPass);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,10,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

/*   ---===Planet Definitions===---   */
const sun = new Planet('icosahedron', 15, 0xF59342, false, false);
const earth = new Planet('dodecahedron', 4, 0x3C81C9, true, false);
const planetx = new Planet('tetrahedron', 8, 0xAA3139, true, false);
const tiny = new Planet('box', 3, 0x6E6E6E, true, false);

/*   ---===Icon Definitions===---   */
const abouticon = new Icon(about, 0.05, [-75, -145, 0]);
const gearicon = new Icon(gear, 0.05, [-75, -355, 0]);
const latticelink = new Icon(link, 0.06, [30, -408, 0], "latticeiconlink");
const snlink = new Icon(link, 0.06, [50, -587, 0], "sniconlink");
const contacticon = new Icon(contact, 0.2, [-75, -843, 0]);


/*   ---===Text Definitions===---   */
new Text("aiden olsen", 25, 25, 0x111111, [-75, 35, 0], sevseg);
new Text("* personal portfolio *", 7, 20, 0x111111, [-62, 20, 0], code);
new Text("about me:", 25, 15, 0x000f55, [-100, -200, 0], sevseg);
const aboutme = 'I am a third year student\nattending Oregon State University\nworking towards a degree in\nElectrical and Computer Engineering.\nI enjoy skateboarding, making\nmusic, and being outdoors.'
new Text(aboutme, 7, 10, 0x00f55, [-96, -215, 10], code);
new Text("projects:", 25, 15, 0x211344, [-100, -410, 0], sevseg);
new Text("lattice cube", 15, 10, 0x211344, [-102, -430, 0], sevseg, "latticelink");
const latticedesc = '> Individually addressable 5x5x7\nLED cube utilizing layer multiplexing\nwith intuitive user interfacean\nand audio reactive visualization.';
new Text(latticedesc, 7, 10, 0x211344, [-104, -442, 0], code);
new Text("swiftnotes.net", 15, 10, 0x211344, [-102, -610, 0], sevseg, "snlink");
const sndesc = '> An automatic notesheet utility\ncreated with flask and opencv in\npython. Swiftnotes will consolidate\na pdf with boxed notes and pack\nthem on a page of paper or notecard\nallowing for better notesheets!';
new Text(sndesc, 7, 10, 0x211344, [-104, -622, 0], code);
new Text("contact:", 25, 15, 0x594214, [-100, -890, 0], sevseg);
const contactinfo = '> Email:\n  - olsenaiden33@gmail.com\n> Instagram:\n  - @aiden.olsen.official';
new Text(contactinfo, 7, 1, 0x594214, [-104, -905, 0], code);

/*   ---===Image Definitions===---   */
new Image(me, [90,-180,-40], 100, 100);
new Image(pcb, [-15,-540, 0], 200, 100);
new Image(snhome, [-60, -735, 0], 100, 60);
new Image(snupload, [50, -735, 0], 100, 60)

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

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.y = 0.2 * t + 25;
}
document.body.onscroll = moveCamera;
moveCamera();

function onWindowResize() {
  if (window.screen.width > 900) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
addEventListener('resize', onWindowResize, false);

var raycaster = new THREE.Raycaster();
function clicktapHandler(x, y) {
  var coords = new THREE.Vector2();
  coords.x = x;
  coords.y = y;
  raycaster.setFromCamera(coords, camera);
  var intersects = raycaster.intersectObject(scene, true);
  if (intersects.length > 0) {
		var object = intersects[0].object;
    if (object.id == sun.mesh.id) {
      object.material.color.set( Math.random() * 0xffffff );
    }
    if (object.id == textids.latticelink || object.id == iconids.latticeiconlink) {
      window.open('https://eecs.oregonstate.edu/project-showcase/projects/?id=qIqU5BGjmgrNyZlU');
    }
    iconids.latticeiconlink.forEach((x, i) => testTap(x, object, "lattice"));
    if (object.id == textids.snlink || object.id == iconids.sniconlink) {
      window.open('https://www.swiftnotes.net');
    }
    iconids.sniconlink.forEach((x, i) => testTap(x, object, "swiftnotes"));
  }
}
function testTap(x, object, link) {
  if (object.id == x) {
    if (link == "lattice") {
      window.open('https://eecs.oregonstate.edu/project-showcase/projects/?id=qIqU5BGjmgrNyZlU');
    }
    if (link == "swiftnotes") {
      window.open('https://www.swiftnotes.net');
    }
  }
}

function onClick() {
  event.preventDefault();
  var x = (event.clientX / window.innerWidth) * 2 - 1;
  var y = -(event.clientY / window.innerHeight) * 2 + 1;
  clicktapHandler(x, y);
}
addEventListener('click', onClick, false);

document.addEventListener("touchstart", e => {
  var x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
  var y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
  clicktapHandler(x, y);
});

function animate() {
  requestAnimationFrame(animate);
  
  sun.rotate(0.001, -0.00025, -0.0007);
  earth.rotate(-0.001, 0.0035, -0.002);
  planetx.rotate(0.003, -0.01, -0.002);
  tiny.rotate(-0.002, -0.001, -0.03);

  earth.orbit(50, 'sin', 'cos', 'sin', tick, 100);
  planetx.orbit(70, 'sin', 'sin', 'cos', tick, 150);
  tiny.orbit(25, 'cos', 'sin', 'sin', tick, 75);
  
  earth.updateTrail(50);
  planetx.updateTrail(70);
  tiny.updateTrail(35);

  camera.position.y += 0.05*Math.cos(tick/100);
  camera.rotation.y = 0.02*Math.sin(tick/300);
  camera.rotation.x = 0.02*Math.sin(tick/400);

  tick += 1.5;
  composer.render();
}
let tick = 0;
animate();
