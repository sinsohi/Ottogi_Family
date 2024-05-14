import * as THREE from 'three'

export default function ottogi_module2(){
    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene()

    // 배경 이미지
    const loader = new THREE.TextureLoader();
    loader.load('./img/HomePage.png', function(texture){
        scene.background = texture;
    });

	// 각도를 라디언으로 바꿔주는 함수
    const degreesToRadians = (degrees) => {
        return degrees * (Math.PI / 180)
    }

	// 화면 크기 설정
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // 객체 중심을 잡아줌
    const center = (group) => {
        new THREE.Box3().setFromObject(group).getCenter( group.position ).multiplyScalar(-1)
        scene.add(group)
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
        
		// 몸통
        createBody(waistSize) {
            this.body = new THREE.Group()
            const geometry = new THREE.SphereGeometry(1.3, 32, 16)
            const material = new THREE.MeshLambertMaterial({ color: 0xF8E0E6 })
            const bodyMain = new THREE.Mesh(geometry, material)
        
            // 타원형으로 만들기 위해 스케일 조정
            const scaleXZ = waistSize;
            bodyMain.scale.set(scaleXZ, 1, scaleXZ);
        
            this.body.add(bodyMain)
            this.group.add(this.body)
        }
        
		// 머리 생성
        createHead(position) {
            this.head = new THREE.Group()
            const geometry = new THREE.SphereGeometry(0.8, 32, 16)
            const headMain = new THREE.Mesh(geometry, this.headMaterial)
            this.head.add(headMain)
            
            this.group.add(this.head)
            
            // 파라미터에 따라 머리 위치 조정
            this.head.position.y = position
            
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
        
		// 흔들림 효과
        bounce() {
            this.group.rotation.z = this.params.rz
        }
        
		// 초기화
        init(waistSize, headPosition) {
            this.createBody(waistSize)
            this.createHead(headPosition)
			this.group.rotation.y = this.params.ry // 모든 헬뚝이가 정면 바라보도록 수정
        }
    }



    let member = 3; // 가족 수(헬뚝이 개수) 저장

    // 오뚝이 캐릭터를 저장할 배열
    let figures = [];

    // 오뚝이 캐릭터 생성
    for (let i = 0; i < member; i++) {
        const figure = new Figure({
            x: (i - Math.floor(member / 2)) * 4, // 오뚝이 캐릭터들을 중앙을 기준으로 균등하게 배치
            ry: degreesToRadians((i - Math.floor(member / 2)) * -30)
        });
        figure.init(1,2);
        figures.push(figure);
    }

    // GSAP Timeline을 생성
    let tl = gsap.timeline({ repeat: -1, yoyo: true });

    // 오뚝이들이 오른쪽으로 10도 흔들리게 설정
    tl.to(figures.map(figure => figure.params), {
        rz: degreesToRadians(20),
        duration: 1,
        ease: "sine.inOut"
    });

    // 바로 이어서 왼쪽으로 10도 흔들리게 설정
    tl.to(figures.map(figure => figure.params), {
        rz: degreesToRadians(-20),
        duration: 1,
        ease: "sine.inOut"
    });

    // GSAP Ticker를 사용하여 애니메이션 업데이트와 렌더링 실행
    gsap.ticker.add(() => {
        figures.forEach(figure => figure.bounce());

        render();
    });
}