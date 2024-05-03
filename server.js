const express = require('express') // express 라이브러리
const app = express()
const path = require('path') // 추가
const bodyParser = require('body-parser'); //npm install body-parser
const bcrypt = require('bcrypt') // bcrypt 셋팅

require("dotenv").config(); // .env 파일에 환경변수 보관

app.use(express.static(__dirname + '/public'))
// app.use(express.static('public')); 


//추가

app.use(
  '/build/',
  express.static(path.join(
    __dirname,
    'node_modules/three/build'
  ))
)

app.use(
  '/jsm/',
  express.static(path.join(
    __dirname,
    'node_modules/three/examples/jsm'
  ))
)

// body-parser 미들웨어 사용 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// 템플릿엔진 ejs 셋팅
app.set('view engine','ejs')

// request.body 쓰기 위한 코드
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport 라이브러리 셋팅
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(passport.initialize())
app.use(session({
  secret: '암호화에 쓸 비번',
  resave : false, // 유저가 서버로 요청할 때마다 세션 갱신할건지 여부
  saveUninitialized : false // 로그인 안해도 세션 만들 것인지 여부
}))

app.use(passport.session())


// mongoDB 연결
const { MongoClient } = require('mongodb');

let db;
const url = process.env.DBurl;
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('Ottogi_Family')
}).catch((err)=>{
  console.log(err)
})



app.listen(process.env.PORT, ()=>{
    console.log('http://localhost:'+`${process.env.PORT}` +' 에서 서버 실행중')
})

app.get('/homePage',(request,response)=>{
  response.render('homePage.ejs');
})


// app.get('/homePage',(request,response)=>{
//   response.sendFile(__dirname + '/index.html')
// })


app.get('/register',(request,response)=>{
  response.render('register.ejs');})

app.post('/register', async (request,response)=>{
  let hash = await bcrypt.hash(request.body.password,10) // password hashing (암호화)

  await db.collection('user_info').insertOne({
    userNickname : request.body.userNickname,
    username : request.body.username,
    password : hash
  })
  response.sendFile(__dirname + '/InitialScreen.html')
})

app.get('/login',(request,response)=>{
  response.sendFile(__dirname + '/login.html')
})

app.get('/calender',(request,response)=>{
  response.sendFile(__dirname + '/calender.html')
})


app.get('/',(request,response)=>{
  response.sendFile(__dirname + '/InitialScreen.html')
})

app.get('/calendardetail',(request,response)=>{
  response.sendFile(__dirname + '/calendardetail.html')
});
app.get('/daily-record', (req, res) => {
    res.sendFile(__dirname + '/daily-record.html');
}); //매일 기록

app.get('/setting', (req, res) => {
  res.sendFile(__dirname + '/setting.html');
});

app.post('/submit-form', (req, res) => {
  // 받은 폼 데이터 추출
  const gender = req.body.gender;
  const weight = req.body.weight;

  res.send('데이터 제출됨.');
});

app.post('/submit-form', (req, res) => {
  // 클라이언트로부터 받은 폼 데이터 추출
  const gender = req.body.gender;
  const height = req.body.height; // 키 정보 추가
  const weight = req.body.weight;

  // 데이터베이스에 삽입할 데이터 객체 생성
  const data = {
      gender: gender,
      height: height,
      weight: weight
  };

  // 'user_info' 컬렉션에 데이터 삽입
  db.collection('user_info').insertOne(data, (err, result) => {
      if (err) {
          console.log('데이터베이스에 데이터를 삽입하는 중 오류가 발생했습니다:', err);
          return res.status(500).send('데이터베이스 오류가 발생했습니다.');
      }
      console.log('데이터베이스에 데이터를 성공적으로 삽입했습니다.');
      res.status(200).send('폼 데이터가 성공적으로 제출되었습니다.');
  });
});

