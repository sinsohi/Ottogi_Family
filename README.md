# Health-ttogi Family

Health-ttogi Family는 가족 구성원의 건강 상태를 실시간으로 반영하는 3D 헬뚝이 캐릭터를 통해 건강 관리 정보를 제공하는 웹 서비스입니다. 

사용자는 성별, 신장, 몸무게를 입력하여 BMI를 계산하고, 이를 기반으로 캐릭터의 상태를 시각화할 수 있습니다.

## Team
| **신소희**                              | **김채은**                               | **김예영**                               |
|:--------------------------------------:|:---------------------------------------:|:---------------------------------------:|
| ![sinsohi](https://github.com/sinsohi.png) | ![CoCo-1223](https://github.com/CoCo-1223.png) | ![KimYeYoung125](https://github.com/KimYeYoung125.png) |
| <a href="mailto:sinsohi4280@gmail.com"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:sinsohi4280@gmail.com"/></a> | <a href="mailto:kimco2104@naver.com"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:kimco2104@naver.com"/></a> | <a href="mailto:pindoll76@naver.com"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:pindoll76@naver.com"/></a> |



## 설치 및 실행

1. **프로젝트 clone 받기**
    ```sh
    git clone https://github.com/sinsohi/Ottogi_Family.git
    ```



2. **Node.js 설치**
    - [Node.js LTS 버전 다운로드](https://nodejs.org/)
    - Node.js를 설치하면 npm(Node Package Manager)도 함께 설치됩니다.



3. **프로젝트 초기화 및 필수 패키지 설치**
    ```sh
   npm install
    ```


4. **.env 파일 설정**
    - `.env` 파일은 환경 변수 파일로, 데이터베이스 연결 정보 등 중요한 설정 값을 포함합니다.
    - 프로젝트 루트에 .env 파일을 생성하고, `.env` 파일을 다음과 같이 설정하세요:


    `.env`
    ```sh
    // .env example

    DBurl = mongodb+srv://DB접속아이디:DB접속비번@cluster0.jea.mongodb.net/?retryWrites=true&w=majority
    PORT = 8080
    ```
 
5. **서버 실행**
    - 터미널에서 다음 명령을 실행하여 서버를 시작합니다:

    ```sh
    node server.js 또는 nodemon server.js
    ```

    터미널에 출력되는 URL로 접속하여 웹을 실행합니다.
   

## 의존성

이 프로젝트는 다음과 같은 환경 및 라이브러리 의존성이 있습니다:

**운영 체제 (OS)**

Windows, macOS, Linux

**라이브러리**
├── bcrypt@5.1.1
├── body-parser@1.20.2
├── connect-mongo@5.1.0
├── connect-mongodb-session@5.0.0
├── dotenv@16.4.5
├── ejs@3.1.10
├── express-session@1.18.0
├── express@4.19.2
├── gsap@3.12.5
├── mocha@10.4.0
├── mongodb@5.9.2
├── nodemon@3.1.0
├── passport-local@1.0.0
├── passport@0.7.0
├── socket.io@4.7.5
├── three@0.163.0
└── vite@5.2.8


## 라이선스

MIT License

Copyright (c) 2024 sinsohi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
