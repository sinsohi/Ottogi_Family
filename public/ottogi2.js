import * as THREE from 'three'

let familyInfo;
let nickName = [];
let bmi = [];
let gender = [];
let sleeptime = [];
let darkCircleStages = [];
let age = [];
let RDA = [];
let intake = [];
let burned = [];
let ResultCalorie = [];


export default async function ottogi_module2 (){
    const canvas = document.querySelector('canvas.webgl');
    const scene = new THREE.Scene()

    try {
        // 서버의 '/getMember' 엔드포인트로 HTTP GET 요청 보내기 (가족 유저의 nickName 데이터 가져오기)
        const response = await fetch('/getMember');
        familyInfo = await response.json();

        console.log(familyInfo);
        nickName = familyInfo; // DB에서 불러온 nickName 데이터를 nickName 배열에 삽입


      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // BMI 데이터 가져오기
        const response = await fetch('/getBMI');
        const bmiInfo = await response.json();

        console.log(bmiInfo);
        bmi = bmiInfo;


      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // gender 데이터 가져오기
        const response = await fetch('/getGender');
        const genderInfo = await response.json();

        console.log(genderInfo);
        gender = genderInfo;


      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // sleeptime 데이터 가져오기
        const response = await fetch('/getSleepTime');
        const sleepInfo = await response.json();

        // console.log(sleepInfo);
        sleeptime = sleepInfo;

      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // RDA(일일 권장 칼로리) 데이터 가져오기
        const response = await fetch('/getRDA');
        const RDAInfo = await response.json();

        console.log(RDAInfo);
        RDA = RDAInfo;

      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // Intake(누적 섭취 칼로리) 데이터 가져오기
        const response = await fetch('/getIntake');
        const IntakeInfo = await response.json();

        console.log(IntakeInfo);
        intake = IntakeInfo;

      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // burned(소모 칼로리) 데이터 가져오기
        const response = await fetch('/getBurned');
        const BurnedInfo = await response.json();

        console.log(BurnedInfo);
        burned = BurnedInfo;

      } catch (error) {
        console.log('Error:', error);
      }

      try {
        // resultcalorie(섭취칼로리 - 소모칼로리) 데이터 가져오기
        const response = await fetch('/getResultCalorie');
        const ResultCalorieInfo = await response.json();

        console.log(ResultCalorieInfo);
        ResultCalorie = ResultCalorieInfo;

      } catch (error) {
        console.log('Error:', error);
      }


      try {
        // age 데이터 가져오기
        const response = await fetch('/getAge');
        const ageInfo = await response.json();


        // console.log(ageInfo);
        age = ageInfo;

      } catch (error) {
        console.log('Error:', error);
      }

      // 연령별 적정 수면 시간 비교하여 다크써클 단계 설정
      for(let i=0; i<familyInfo.length; i++){
        // 6 ~ 13세 
        if(age[i] >=6 && age[i]<=13){
            if(sleeptime[i]>7 && sleeptime[i]<=8) darkCircleStages.push(1) // 7~8시간 수면 시 다크써클 1단계
            if(sleeptime[i]>6 && sleeptime[i]<=7) darkCircleStages.push(2) // 6~7시간 수면 시 다크써클 2단계
            if(sleeptime[i]>=0 && sleeptime[i]<=6) darkCircleStages.push(3) // 0~6시간 수면 시 다크써클 3단계
        }

        // 14 ~ 17세 
        if(age[i] >=14 && age[i]<=17){
            if(sleeptime[i]>6 && sleeptime[i]<=7) darkCircleStages.push(1) // 6~7시간 수면 시 다크써클 1단계
            if(sleeptime[i]>5 && sleeptime[i]<=6) darkCircleStages.push(2) // 5~6시간 수면 시 다크써클 2단계
            if(sleeptime[i]>=0 && sleeptime[i]<=5) darkCircleStages.push(3) // 0~5시간 수면 시 다크써클 3단계
        }
        
        // 18세 이상
        if(age[i] >=18){
            if(sleeptime[i]>5 && sleeptime[i]<=6) darkCircleStages.push(1) // 5~6시간 수면 시 다크써클 1단계
            if(sleeptime[i]>4 && sleeptime[i]<=5) darkCircleStages.push(2) // 4~5시간 수면 시 다크써클 2단계
            if(sleeptime[i]>=0 && sleeptime[i]<=4) darkCircleStages.push(3) // 0~4시간 수면 시 다크써클 3단계
        }
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
            };

            this.darkCircleIndex = params.darkCircleIndex; // darkCircleIndex

            
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
            const geometry = new THREE.SphereGeometry(0.07, 12, 8)
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

            // 다크써클 생성 함수 호출
            this.createDarkCircles(darkCircleStages[this.darkCircleIndex]);
        }

        // 다크써클 생성 함수
        createDarkCircles(stage) {
            const darkCircles = new THREE.Group();
            const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
            const radiusIncrement = 0.05; // 반지름 증가량
            const verticalSpacing = 0.05; // 수직 간격
        
            for (let i = 0; i < stage; i++) {
                const curve = new THREE.EllipseCurve(
                    0, 0,                        // ax, aY
                    0.09 + i * radiusIncrement, 0.1, // xRadius, yRadius (반지름 증가)
                    Math.PI, 2 * Math.PI,        // aStartAngle, aEndAngle (반원 형태)
                    false,                       // aClockwise
                    0                            // aRotation
                );
        
                const points = curve.getPoints(50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
                const darkCircle = new THREE.Line(geometry, material);
                darkCircle.position.y = -0.1 - i * verticalSpacing; // 수직 위치 조정
                darkCircle.position.z = 0.72;
        
                darkCircles.add(darkCircle);
            }
        
            // 왼쪽 눈 아래에 다크써클 추가
            const leftDarkCircles = darkCircles.clone();
            leftDarkCircles.position.x = -0.36;
            this.head.add(leftDarkCircles);
        
            // 오른쪽 눈 아래에 다크써클 추가
            const rightDarkCircles = darkCircles.clone();
            rightDarkCircles.position.x = 0.36;
            this.head.add(rightDarkCircles);
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

    let member = familyInfo.length; // 가족 수(헬뚝이 개수) 저장

    // 오뚝이 캐릭터를 저장할 배열
    let figures = [];

    // 오뚝이 캐릭터 생성
    for (let i = 0; i < member; i++) {
        let waistSize; // 허리둘레

        const figure = new Figure({
            x: (i - Math.floor(member / 2)) * 4, // 오뚝이 캐릭터들을 중앙을 기준으로 균등하게 배치
            ry: degreesToRadians((i - Math.floor(member / 2)) * -30),
            darkCircleIndex : i // 다크써클 인덱스 추가
        });

        // bmi 단계에 따라 waistSize 변경
        if (bmi[i] === '저체중') waistSize = 0.6;
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