import * as THREE from 'three'

export default async function ottogi_module2 (){
    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene()

    try {
        // 서버의 '/getMember' 엔드포인트로 HTTP GET 요청 보내기 (클라이언트 측에서 서버의 데이터 가져오기 위함)
        const response = await fetch('/getMember');
        const familyInfo = await response.json();

        // console.log(familyInfo.length);


      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // 서버의 '/getBMI' 엔드포인트로 HTTP GET 요청 보내기 (클라이언트 측에서 서버의 데이터 가져오기 위함)
        const response = await fetch('/getBMI');
        const bmiInfo = await response.json();

        console.log(bmiInfo);


      } catch (error) {
        console.log('Error:', error);
      }
    
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
    const lightAmbient = new THREE.AmbientLight(0xffffff, 1)
    scene.add(lightAmbient)

    const lightDirectional = new THREE.DirectionalLight(0xffffff, 1)
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
            this.headMaterial = new THREE.MeshLambertMaterial({ color: 0xfdf5e6})
            this.maleBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x00FFFF })
            this.femaleBodyMaterial = new THREE.MeshLambertMaterial({color : 0xFF69B4 })
        }
        
        
		// 몸통
        createBody(bmi, gender) {
            const waistSize = bmi;
            
            let bodyMain;
            this.body = new THREE.Group()
            const geometry = new THREE.SphereGeometry(1.3, 32, 16)
            
            if(gender === 'male'){
                bodyMain = new THREE.Mesh(geometry, this.maleBodyMaterial)
            } 
            else if(gender === 'female'){
                bodyMain = new THREE.Mesh(geometry, this.femaleBodyMaterial)
            }
        
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

        // 닉네임 생성
        createNickname(nickname){
            const nicknameElement = document.createElement('h1');
            nicknameElement.textContent = nickname;

            this.group.userData.nicknameElement = nicknameElement;
            document.body.appendChild(nicknameElement);
        }

         // 닉네임 위치 설정
         updateNicknamePosition() {
            if (this.group.userData.nicknameElement) {
                const worldPosition = new THREE.Vector3();
                this.group.getWorldPosition(worldPosition);
                const screenPosition = worldPosition.clone().project(camera);
        
                const x = (screenPosition.x + 1) / 2 * window.innerWidth;
                const y = -(screenPosition.y - 1) / 2 * window.innerHeight;
        
                this.group.userData.nicknameElement.style.left = `${x}px`;
                this.group.userData.nicknameElement.style.top = `${y}px`;
            }
        }
        
		// 초기화
        init(waistSize, headPosition, gender) {
            this.createBody(waistSize, gender)
            this.createHead(headPosition)
			this.group.rotation.y = this.params.ry // 모든 헬뚝이가 정면 바라보도록 수정
        }
    }

    let member = 3; // 가족 수(헬뚝이 개수) 저장

    // 오뚝이 캐릭터를 저장할 배열
    let figures = [];

    // 오뚝이 캐릭터 생성
    for (let i = 0; i < member; i++) {
        let waistSize; // 허리둘레

        // 임시로 gender, bmi, nickName 배열 생성
        let gender = ['female','male','female']; 
        let bmi = ['1단계비만','정상','비만전단계'];
        let nickName = ['엄마','아빠','딸']

        const figure = new Figure({
            x: (i - Math.floor(member / 2)) * 4, // 오뚝이 캐릭터들을 중앙을 기준으로 균등하게 배치
            ry: degreesToRadians((i - Math.floor(member / 2)) * -30)
        });

        // bmi 단계에 따라 waistSize 변경
        if (bmi[i] === '저체중') waistSize = 0.8;
        else if (bmi[i] === '정상') waistSize = 1;
        else if (bmi[i] === '비만전단계') waistSize = 1.3;
        else if (bmi[i] === '1단계비만') waistSize = 1.5;
        else if (bmi[i] === '2단계비만') waistSize = 1.7;
        else if (bmi[i] === '3단계비만') waistSize = 1.9;

        figure.init(waistSize,2,gender[i]);
        figure.createNickname(nickName[i]); // 닉네임 생성
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
        figures.forEach(figure => {
            figure.bounce();
            figure.updateNicknamePosition(); // 닉네임 위치 업데이트
        });

        render();
    });
}

// module.exports = ottogi_module2;