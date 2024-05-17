const express = require('express'); // express 라이브러리
const app = express();
const path = require('path'); // 추가
const bodyParser = require('body-parser'); // npm install body-parser
const bcrypt = require('bcrypt'); // bcrypt 셋팅
const MongoStore = require("connect-mongo"); // connect-mongo 셋팅
require("dotenv").config(); // .env 파일에 환경변수 보관

app.use(express.static(__dirname + '/public'));

// 추가
app.use(
  '/build/',
  express.static(path.join(
    __dirname,
    'node_modules/three/build'
  ))
);

app.use(
  '/jsm/',
  express.static(path.join(
    __dirname,
    'node_modules/three/examples/jsm'
  ))
);

// body-parser 미들웨어 사용 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 템플릿엔진 ejs 셋팅
app.set('view engine', 'ejs');

// request.body 쓰기 위한 코드
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport 라이브러리 셋팅
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(passport.initialize());
app.use(session({
  secret: '암호화에 쓸 비번',
  resave: false, // 유저가 서버로 요청할 때마다 세션 갱신할건지 여부
  saveUninitialized: false, // 로그인 안해도 세션 만들 것인지 여부
  cookie: { maxAge: 60 * 60 * 1000 },
  store: MongoStore.create({
    mongoUrl: process.env.DBurl,
    dbName: "Ottogi_Family"
  })
}));
app.use(passport.session());

// mongoDB 연결
const { MongoClient, ObjectId } = require('mongodb');
let db;
const url = process.env.DBurl;
new MongoClient(url).connect().then((client) => {
  console.log('DB연결성공');
  db = client.db('Ottogi_Family');
}).catch((err) => {
  console.log(err);
});

app.listen(process.env.PORT, () => {
  console.log('http://localhost:' + `${process.env.PORT}` + ' 에서 서버 실행중');
});

app.get('/homePage', (request, response) => {
  response.render('homePage.ejs');
});

app.get('/register', (request, response) => {
  response.render('register.ejs');
});

app.post('/register', async (request, response) => {
  let hash = await bcrypt.hash(request.body.password, 10); // password hashing (암호화)
  await db.collection('user_info').insertOne({
    userNickname: request.body.userNickname,
    username: request.body.username,
    password: hash
  });
  response.sendFile(__dirname + '/InitialScreen.html');
});

// 아이디/비번이 DB와 일치하는지 검증하는 로직 짜는 공간 (앞으로 유저가 제출한 아이디 비번이 DB랑 맞는지 검증하고 싶을때 이것만 실행하면 됨)
passport.use(
  new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
    // username 찾기
    let result = await db.collection('user_info').findOne({ username: 입력한아이디 });
    if (!result) {
      return cb(null, false, { message: '아이디 DB에 없음' });
    }
    // password 비교
    if (await bcrypt.compare(입력한비번, result.password)) {
      return cb(null, result);
    } else {
      return cb(null, false, { message: '비번불일치' });
    }
  })
);

// 로그인시 세션 만들기 (요청.logIn() 쓰면 자동 실행됨)
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username });
  });
});

// 유저가 보낸 쿠키 분석 (세션 정보 적힌 쿠키 가지고 있는 유저가 요청 날릴 때마다 실행됨)
passport.deserializeUser(async (user, done) => {
  let result = await db.collection("user_info").findOne({ _id: new ObjectId(user.id) });
  delete result.password;
  process.nextTick(() => {
    done(null, result); // result : 요청.user에 들어감
  });
});

app.get('/login', (request, response) => {
  response.render('login.ejs');
});

// 아이디/비번이 DB와 일치하는지 검증하는 코드 
app.post('/login', async (요청, 응답, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error);
    if (!user) return 응답.status(401).json(info.message);
    // 일치할 경우 
    요청.logIn(user, (err) => {
      // 로그인 완료시 실행할 코드
      if (err) return next(err);
      응답.render('homePage.ejs');
    });
  })(요청, 응답, next);
});

app.get('/calender', (request, response) => {
  response.sendFile(__dirname + '/calender.html');
});

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/InitialScreen.html');
});

app.get('/calendardetail', (request, response) => {
  response.sendFile(__dirname + '/calendardetail.html');
});

app.get('/setting', (req, res) => {
  res.sendFile(__dirname + '/setting.html');
}); // 세팅

app.get('/daily-record', (req, res) => {
  res.sendFile(__dirname + '/daily-record.html');
}); // 매일 기록

app.post('/submit-form', (req, res) => {
  const meal = req.body.meal;
  res.send(`<script>window.location.href = "/dailyrecordmeal?meal=${meal}";</script>`);
});

app.get('/dailyrecordmeal', (req, res) => {
  res.sendFile(path.join(__dirname, 'dailyrecordmeal.html'));
});

app.get('/dailyrecordexercise', (req, res) => {
  res.sendFile(path.join(__dirname, 'dailyrecordexercise.html'));
}); //*

app.get('/dailyrecordsleeptime', (req, res) => {
  res.sendFile(path.join(__dirname, 'dailyrecordsleeptime.html'));
}); //*

app.post('/dailyrecordexercise', async (req, res) => {
  const exerciseName = req.body.exerciseName;
  const caloriesBurned = req.body.caloriesBurned;
  const userNickname = req.user.userNickname;

  const currentDate = new Date();

  const koreanTimeOffset = 9 * 60; // 한국 시간은 UTC+9
  const koreanTime = new Date(currentDate.getTime() + koreanTimeOffset * 60000);

  const data = {
    userNickname: userNickname,
    caloriesBurned: caloriesBurned,
    exerciseName: exerciseName,
    timestamp: koreanTime
  };

  db.collection('DRexercise').insertOne(data, (err, result) => {
    if (err) {
      console.log('데이터베이스 오류:', err);
      return res.status(500).send('데이터베이스 오류');
    }
    console.log('데이터를 성공적으로 삽입');
    res.status(200).send('성공적으로 제출');
  });
});


app.post('/dailyrecordmeal', async (req, res) => {
  const meal = req.body.meal;
  const menuName = req.body.menuName;
  const calories = req.body.calories;
  const userNickname = req.user.userNickname; // 유저의 userNickname

  const currentDate = new Date();

  const koreanTimeOffset = 9 * 60; // 한국 시간은 UTC+9
  const koreanTime = new Date(currentDate.getTime() + koreanTimeOffset * 60000);

  let collectionName;
  if (meal === 'breakfast') {
    collectionName = 'breakfast';
  } else if (meal === 'lunch') {
    collectionName = 'lunch';
  } else if (meal === 'dinner') {
    collectionName = 'dinner';
  }
  const data = {
    userNickname: userNickname,
    menuName: menuName,
    calories: calories,
    timestamp: koreanTime
  };
  db.collection(collectionName).insertOne(data, (err, result) => {
    if (err) {
      console.log('데이터베이스 오류:', err);
      return res.status(500).send('데이터베이스 오류');
    }
    console.log('데이터를 성공적으로 삽입');
    res.status(200).send('성공적으로 제출');
  });
});


app.post('/dailyrecordsleeptime', async (req, res) => {
  const sleepHour = req.body.sleepHour;
  const sleepMinute = req.body.sleepMinute;
  const userNickname = req.user.userNickname;

  const currentDate = new Date();

  const koreanTimeOffset = 9 * 60; // 한국 시간은 UTC+9
  const koreanTime = new Date(currentDate.getTime() + koreanTimeOffset * 60000);


  const data = {
    userNickname: userNickname,
    sleepHour: sleepHour,
    sleepMinute: sleepMinute,
    timestamp: koreanTime
  };

 await db.collection('DRsleeptime').insertOne(data, (err, result) => {
    if (err) {
      console.log('데이터베이스 오류:', err);
      return res.status(500).send('데이터베이스 오류');
    }
    console.log('데이터를 성공적으로 삽입');
    res.status(200).send('성공적으로 제출');
  });
});



app.post('/setting', async (req, res) => {
  const userNickname = req.user.userNickname;
  const gender = req.body.gender;
  const height = req.body.height;
  const weight = req.body.weight;
  const age = req.body.age;
  const sleeptime = req.body.sleeptime;
  const activity = req.body.activity;
  const bmi = req.body.bmi;

  // 현재 날짜와 시간 가져오기 (UTC)
  const currentDate = new Date();

  // UTC 시간을 한국 시간으로 변환
  const koreanTimeOffset = 9 * 60; // 한국 시간은 UTC+9
  const koreanTime = new Date(currentDate.getTime() + koreanTimeOffset * 60000);

  let healthStatus = '';
  if (bmi < 18.5) {
    healthStatus = '저체중';
  } else if (bmi >= 18.5 && bmi < 23) {
    healthStatus = '정상';
  } else if (bmi >= 23 && bmi < 25) {
    healthStatus = '비만전단계';
  } else if (bmi >= 25 && bmi < 30) {
    healthStatus = '1단계비만';
  } else if (bmi >= 30 && bmi < 35) {
    healthStatus = '2단계비만';
  } else {
    healthStatus = '3단계비만';
  }

  const data = {
    userNickname: userNickname,
    gender: gender,
    height: height,
    weight: weight,
    age: age,
    sleeptime: sleeptime,
    activity: activity,
    bmi: bmi, //bmi 값
    healthStatus: healthStatus, // bmi 결과
    timestamp: koreanTime
  };

  db.collection('user_info').insertOne(data, (err, result) => {
    if (err) {
      console.log('데이터베이스 오류:', err);
      return res.status(500).send('데이터베이스 오류');
    }
    console.log('데이터를 성공적으로 삽입');
    res.status(200).send('제출 완료');
  });
});
