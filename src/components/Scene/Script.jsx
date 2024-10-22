import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

//Global variables
let currentRef = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(35, 15, 35);
camera.lookAt(new THREE.Vector3());

scene.fog = new THREE.Fog( 0x000000, 90, 100 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// LOAD MODELO 3D

//loading manager
const loadingManager = new THREE.LoadingManager(
  () => console.log('modelo cargado'), //onLoad
  (items, itemsToLoad, itemsLoaded) => {console.log(
    Math.round(itemsToLoad / itemsLoaded * 100)
  )}, //onProgress
  () => {}  //onError
)


//comando para convertir a draco, teniando instalado draco: sudo npm install -g gltf-pipeline
// gltf-pipeline -i scene.gltf -o dracoScene.gltf --draco.compressionLevel=10

const gltfLoader = new GLTFLoader(loadingManager);

const dracoLoader = new DRACOLoader(); 
dracoLoader.setDecoderPath( './node_modules/three/examples/jsm/libs/draco/' );
//dracoLoader.setDecoderPath( './draco/' );
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  './model/dracoScene.gltf',
  gltf => scene.add(gltf.scene),
  () => console.log("on progress"),
  () => console.log("error")
)

// LIGHTS
const AL = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(AL);

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.traverse((object) => {
    // Limpiar geometrías
    if (object.geometry) {
      object.geometry.dispose();
    }

    // Limpiar materiales
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => material.dispose());
      } else {
        object.material.dispose();
      }
    }

    // Limpiar texturas
    if (object.material && object.material.map) {
      object.material.map.dispose();
    }
  });
  currentRef.removeChild(renderer.domElement);
};
