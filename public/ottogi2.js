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

	// 헬뚝이 class 정의
    class Figure {
        constructor(params) {
            this.params = {
                x: 0,
                y: -2,
                z: 0,
                rz: 0,
				ry:0,
                ...params
            }

		// 그룹 생성 후 scene에 추가 
        this.group = new THREE.Group()
        scene.add(this.group)

		 // 위치 설정
		 this.group.position.x = this.params.x
		 this.group.position.y = this.params.y
		 this.group.position.z = this.params.z
		 
		 // 재질 설정
		 this.headMaterial = new THREE.MeshLambertMaterial({ color: 0xF8E0E6})
		 this.bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xF8E0E6 })
		 
	 }

		// 몸통 생성
		createBody(){
			const geometry = new THREE.SphereGeometry(1.3, 32, 16)
            const material = new THREE.MeshLambertMaterial({ color: 0xF8E0E6 })
			this.group.add(this.body)
		}

		// 머리 생성
		createHead() {
            this.head = new THREE.Group()
            const geometry = new THREE.SphereGeometry(0.8, 32, 16)
            const headMain = new THREE.Mesh(geometry, this.headMaterial)
            this.head.add(headMain)
            
            this.group.add(this.head)
            
            this.head.position.y = 2

			// 눈 생성 함수 호출
			this.createEyes()
        }

		// 눈 생성
        createEyes() {
            const eyes = new THREE.Group()
            const geometry = new THREE.SphereGeometry(0.08, 12, 8)
            const material = new THREE.MeshLambertMaterial({ color: 0x44445c })
            
            for(let i = 0; i < 2; i++) {
                const eye = new THREE.Mesh(geometry, material)
                const m = i % 2 === 0 ? 1 : -1
                
                eyes.add(eye)
                eye.position.x = 0.36 * m
            }
            
            this.head.add(eyes)
            
            eyes.position.y = -0.1
            eyes.position.z = 0.7
        }



		// 초기화
		init(){
			this.createBody()
			this.createHead()
		}
}
	const figure = new Figure()
	figure.init()
}

