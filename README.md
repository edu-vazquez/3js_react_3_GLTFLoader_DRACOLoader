# 3js_react_3_GLTFLoader_DRACOLoader
```
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
```
```
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
```
