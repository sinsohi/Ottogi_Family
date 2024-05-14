import * as THREE from 'three'

export default function ottogi_module2(){
    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene()

    // 배경 이미지
    const loader = new THREE.TextureLoader();
    loader.load('./img/HomePage.png', function(texture){
        scene.background = texture;
    });

	// 화면 크기 설정
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
   
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })

    const render = () => {
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.render(scene, camera)
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 8
    scene.add(camera)

	// 창 크기가 바뀔 때마다 카메라 비율 재조정
    window.addEventListener('resize', () =>
    {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
    })

	 // Material
	 const material = new THREE.MeshLambertMaterial({ color: 0xffffff })

	 // Lighting
	 const lightAmbient = new THREE.AmbientLight(0x9eaeff, 0.5)
	 scene.add(lightAmbient)
 
	 const lightDirectional = new THREE.DirectionalLight(0xffffff, 0.8)
	 scene.add(lightDirectional)
 
	 lightDirectional.position.set(5, 5, 5)

	
}