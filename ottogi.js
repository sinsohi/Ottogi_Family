import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function ottogi_module(){

// html에 캔버스 가져와서 사용하기
const canvas = document.querySelector('canvas.HealthOttogi');
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
 });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2: 1); // 이미지 고해상도로 


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('antiquewhite');

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // 시야각(field of view)
    window.innerWidth / window.innerHeight, // 종횡비 (aspect)
    0.1, // near
    1000 // far
)

// Light
const light = new THREE.DirectionalLight('white',3 );
light.position.x = 1;
light.position.z = 2;
scene.add(light);
// Light 추가
const ambientLight = new THREE.AmbientLight('white',0.5); // 전체적으로 은은한 조명
scene.add(ambientLight);

// 카메라 위치 조정
camera.position.x = 1;
camera.position.y = 3;
camera.position.z = 8; 
scene.add(camera);



// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// gltf loader
const gltfLoader = new GLTFLoader();
let mixer;

gltfLoader.load(
    'test4.glb',
    gltf => {
        console.log(gltf.scene.children[0]);

        // console.log(gltf);
        const ottogiMesh = gltf.scene.children[0];
        scene.add(ottogiMesh);

        const mixer = new THREE.AnimationMixer(ottogiMesh);
        const actions= [];
        actions[0] = mixer.clipAction(gltf.animations[0]);
        // actions[1] = mixer.clipAction(gltf.animations[1]);
        actions[0].play();

    }
);

// 그리기
let time = Date.now();

function draw(){
    const newTime = Date.now();
    const deltaTime = newTime - time;
    time = newTime;

    if (mixer) mixer.update(time);

    renderer.render(scene, camera);

    renderer.setAnimationLoop(draw);
}

draw();


function setSize(){
    // 카메라
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix 카메라 투영에 관련된 값에 변화가 있을 경우 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize',setSize) // 창 size가 바뀔때마다 프로젝트 화면도 그 size에 맞게 조정됨
}

