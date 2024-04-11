import * as THREE from 'three'

// html에 캔버스 가져와서 사용하기
const canvas = document.querySelector('canvas.HealthOttogi');

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

// 카메라 위치 조정
camera.position.x = 1;
camera.position.y = 3;
camera.position.z = 8; 
scene.add(camera);

// Light
const light = new THREE.DirectionalLight('white',3 );
light.position.x = 1;
light.position.z = 2;
scene.add(light);




