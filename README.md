# Health-ttogi Family

Health-ttogi Family는 가족 구성원의 건강 상태를 반영하는 3D 헬뚝이 캐릭터를 통해 건강 관리 정보를 제공하는 웹 서비스입니다. 

사용자는 성별, 신장, 몸무게를 입력하여 BMI를 계산하고, 이를 기반으로 캐릭터의 상태를 시각화할 수 있습니다.
<br/>
<br/>

## 📖 Description
① 신체 관련 정보를 사용자에게 입력 받아, 이를 헬뚝이 캐릭터에 반영합니다.

- 유저에게 성별, 신장, 몸무게를 입력받아, BMI를 계산합니다.
- BMI의 구간에 따라 헬뚝이의 허리둘레가 6가지 중 1가지로 지정됩니다.



② 건강 데이터 기록과 실시간 상태 반영 및 가족 구성원 간 헬뚝이 공유

- 매일 사용자에게 몸무게, 활동 지수, 수면 시간을 입력 받아 기록합니다.
- 입력 받은 데이터를 기반으로 일일 권장 칼로리를 계산하여, 섭취 칼로리와 비교하여 표시합니다.
- 적정 수면 시간과 비교했을 때 수면 시간이 부족한 경우 짙은 다크써클로 상태 반영합니다.
- 메인 페이지에서 본인의 헬뚝이를 비롯한 가족 구성원의 헬뚝이를 볼 수 있습니다.
<br/>

## 🔨 Architecture
![Image](https://github.com/user-attachments/assets/27dc7c2d-4e20-4a0d-b886-9a5d840cc024)
<br/>
<br/>

## 🚀 Getting Started
1. **프로젝트 clone 받기**
    ```sh
    git clone https://github.com/sinsohi/Ottogi_Family.git
    ```
<br/>
    
2. **Node.js 설치**
    - [Node.js LTS 버전 다운로드](https://nodejs.org/)
    - Node.js를 설치하면 npm(Node Package Manager)도 함께 설치됩니다.
<br/>



3. **프로젝트 초기화 및 필수 패키지 설치**
    ```sh
   npm install
    ```
<br/>




4. **.env 파일 설정**
    - `.env` 파일은 환경 변수 파일로, 데이터베이스 연결 정보 등 중요한 설정 값을 포함합니다.
    - 프로젝트 루트에 .env 파일을 생성하고, `.env` 파일을 다음과 같이 설정하세요:

    ```sh
    // .env example 파일
    
    DBurl = mongodb+srv://DB접속아이디:DB접속비번@cluster0.jea.mongodb.net/?retryWrites=true&w=majority
    PORT = 8080
    ```

<br/>

5. **서버 실행**
    - 터미널에서 다음 명령을 실행하여 서버를 시작합니다:

    ```sh
    cd Ottogi_Family
    node server.js 또는 nodemon server.js
    ```

    - 터미널에 출력되는 URL로 접속하여 웹을 실행합니다.
   <br/><br/>

## 🏷️ Dependency

이 프로젝트는 다음과 같은 환경 및 라이브러리 의존성이 있습니다:

**운영 체제 (OS)**

Windows, macOS, Linux


**라이브러리 (Library)**<br/>
├── bcrypt@5.1.1 <br/>
├── body-parser@1.20.2 <br/>
├── connect-mongo@5.1.0 <br/>
├── connect-mongodb-session@5.0.0 <br/>
├── dotenv@16.4.5 <br/>
├── ejs@3.1.10 <br/>
├── express-session@1.18.0 <br/>
├── express@4.19.2 <br/>
├── gsap@3.12.5 <br/>
├── mongodb@5.9.2 <br/>
├── nodemon@3.1.0 <br/>
├── passport-local@1.0.0 <br/>
├── passport@0.7.0 <br/>
├── three@0.163.0 <br/>
<br/>
<br/>

## 📜 License

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
<br/>
<br/>
## 👨‍💻 Team
| 이름 | 신소희 (팀장)                           | 김예영                                     | 김채은                                      |  
| --- | --------------------------------------- | ------------------------------------------ | ------------------------------------------ | 
|GitHub| [sinsohi](https://github.com/sinsohi) | [starsaverKDH](https://github.com/starsaverKDH) | [kimchaeeun](https://github.com/CoCo-1223) | 
