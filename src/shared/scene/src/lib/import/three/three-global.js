import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import * as Interactive from "three.interactive";

global.THREE = THREE;
global.THREE.GLTFLoader = GLTFLoader;
global.THREE.OrbitControls = OrbitControls;
global.THREE.Interactive = Interactive;
