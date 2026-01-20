import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import * as Interactive from "three.interactive";

global.THREE = THREE;
THREE.GLTFLoader = GLTFLoader;
THREE.OrbitControls = OrbitControls;
THREE.Interactive = Interactive;
