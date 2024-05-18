const express = require('express') // express 라이브러리
const app = express()
const path = require('path') // 추가
const bodyParser = require('body-parser'); //npm install body-parser
const bcrypt = require('bcrypt') // bcrypt 셋팅
const MongoStore = require("connect-mongo"); // connect-mongo 셋팅

require("dotenv").config(); // .env 파일에 환경변수 보관


app.use(express.static(__dirname + '/public'))


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
  saveUninitialized : false, // 로그인 안해도 세션 만들 것인지 여부
  cookie: { maxAge : 60 * 60 * 1000},
  store : MongoStore.create({
    mongoUrl: process.env.DBurl,
    dbName:"Ottogi_Family"
  })
}))

app.use(passport.session())


// mongoDB 연결
const { MongoClient, ObjectId } = require('mongodb');
const { BADFAMILY } = require('dns');

let db;
const url = process.env.DBurl;
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('Ottogi_Family')
}).catch((err)=>{
  console.log(err)
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('http://localhost:'+`${process.env.PORT}` +' 에서 서버 실행중')
})

app.get('/homePage',(req,res)=>{
  res.render('homePage.ejs')
})

// member 전달
app.get('/getMember', async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db('Ottogi_Family');

    let familyInfo = await db.collection('FamilyRoom').findOne({
      member : req.user.userNickname
    })

    // console.log(familyInfo.member)
    client.close();
    
    res.json(familyInfo.member); 

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// BMI 전달
app.get('/getBMI', async (req, res) => {
  let bmi = [];
  try {
    const client = await MongoClient.connect(url);
    const db = client.db('Ottogi_Family');

    let userInfo = await db.collection('FamilyRoom').findOne({
      member : req.user.userNickname
    })

    for(let i=0; i<userInfo.member.length; i++){
      let result = await db.collection('user_info').findOne({
        userNickname : userInfo.member[i]
      })
      // console.log(result.bmi)
      bmi.push(result.healthStatus)
      // console.log(bmi)

    }

    client.close();
    res.json(bmi); 

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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


// 아이디/비번이 DB와 일치하는지 검증하는 로직 짜는 공간 (앞으로 유저가 제출한 아이디 비번이 DB랑 맞는지 검증하고 싶을때 이것만 실행하면 됨)
passport.use(
  new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  // username 찾기
  let result = await db.collection('user_info').findOne({ username : 입력한아이디})
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }

  // password 비교
  if (await bcrypt.compare(입력한비번, result.password)) {
    return cb(null, result)
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))




// 로그인시 세션 만들기 (요청.logIn() 쓰면 자동 실행됨)
passport.serializeUser((user, done) => {
  // console.log(user);
  process.nextTick(() => {
    // 내부 코드를 비동기적으로 처리해줌
    done(null, { id: user._id, username: user.username });
  });
});

// 유저가 보낸 쿠키 분석 (세션 정보 적힌 쿠키 가지고 있는 유저가 요청 날릴 때마다 실행됨)
passport.deserializeUser(async (user, done) => {
  let result = await db
    .collection("user_info")
    .findOne({ _id: new ObjectId(user.id) });
  delete result.password;
  process.nextTick(() => {
    done(null, result); // result : 요청.user에 들어감
  });
});

app.get('/login',(request,response)=>{
  response.render('login.ejs')
})

// 아이디/비번이 DB와 일치하는지 검증하는 코드 
app.post('/login', async (요청, 응답, next) => {

  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error)
      if (!user) return 응답.status(401).json(info.message)
      //일치할 경우 
    요청.logIn(user, (err) => {
      //로그인 완료시 실행할 코드
      if (err) return next(err);
      응답.redirect('/homePage');
    });
  })(요청, 응답, next);
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
  // 클라이언트로부터 받은 폼 데이터 추출
  const gender = req.body.gender;
  const height = req.body.height;
  const weight = req.body.weight;
  const age = req.body.age;
  const sleeptime = req.body.sleeptime;
  const activity = req.body.activity;
  

  // 데이터베이스에 삽입할 데이터 객체 생성
  const data = {
      gender: gender,
      height: height,
      weight: weight,
      age: age,
      sleeptime: sleeptime,
      activity: activity
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

