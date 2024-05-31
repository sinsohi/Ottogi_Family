const express = require('express'); // express 라이브러리
const app = express();
const path = require('path'); // 추가
const bodyParser = require('body-parser'); // npm install body-parser
const bcrypt = require('bcrypt'); // bcrypt 셋팅
const MongoStore = require("connect-mongo"); // connect-mongo 셋팅

// 웹 소켓 세팅 
const { createServer } = require('http')
const { Server } = require('socket.io')
const server = createServer(app)
const io = new Server(server) 
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

server.listen(process.env.PORT, ()=>{
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
    const usreNickname = request.body.userNickname;
    
    let familyInfo = await db.collection('FamilyRoom').findOne({
      member : userNickname
    });

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

// gender 전달
app.get('/getGender', async (req, res) => {
  let gender = [];
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
      gender.push(result.gender)
    }

    client.close();
    res.json(gender); 

  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/register', (request, response) => {
  response.render('register.ejs');
  
});

app.post('/register', async (request, response) => {
  try{
  const userNickname = request.body.userNickname;
  const existingUser = await db.collection('user_info').findOne({userNickname: userNickname});

  if (existingUser) {
    return response.status(400).send('닉네임이 이미 사용 중입니다.');
  }

  let hash = await bcrypt.hash(request.body.password, 10); // password hashing (암호화)
  await db.collection('user_info').insertOne({
    userNickname: request.body.userNickname,
    username: request.body.username,
    password: hash
  });

  // 세션에 닉네임 저장
  request.session.userNickname = request.body.userNickname;
  // console.log(request.session.userNickname)
  
  // 회원가입 성공 시 /addFamily페이지로 리다이렉션
  response.redirect('/addFamily');
} catch (error) {
  console.log('Error:', error);
  response.status(500).json({ error: 'Internal Server Error' });
}
});

// 닉네임 중복 확인 라우터 추가
app.get('/checkNickname', async (req, res) => {
  try {
    const userNickname = req.query.userNickname;
    const existingUser = await db.collection('user_info').findOne({ userNickname: userNickname });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//아이디 중복 확인 라우터 추가 
app.get('/checkUsername', async (req, res) => {
  try {
    const username = req.query.username;
    const existingUser = await db.collection('user_info').findOne({ username: username });

    if (existingUser) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 그룹 추가하는 페이지 
app.get('/addFamily', (request, response) => {
  response.render('addFamily.ejs', { userNickname: request.session.userNickname });

});

// 회원가입 후 가족 추가하는 페이지
app.post('/addFamily', async(request, response) => {
  // 1. 이미 가족이 존재하는 경우
  // 2. 새롭게 가족을 추가할 경우 
  const Member = request.body.Member; // 로그인한 사용자의 닉네임
  const NewMember = request.body.NewMember; // 새로 추가할 멤버 정보
  const userNickname = request.session.userNickname;
  
  //console.log(Member, NewMember, userNickname);
 
  // 이미 가족이 존재하는 경우
   if(Member) {
     try {
       const existingFamily = await db.collection('FamilyRoom').findOne({member:{$in:[Member]}});
       
       if(existingFamily) {
        if(existingFamily.member.length < 4) {
        await db.collection('FamilyRoom').updateOne(
          {member: {$in: [Member]}}, 
          {$addToSet: {member: userNickname}}
        );
        response.redirect('/setting');
       }
      }
       // 가족 이름 틀림 
       else {
         console.log("속하지 않음`");
       }
     }
     catch(err) {
       console.error(err);
       response.status(500).send('기존 가족 추가 과정에서 오류가 발생했습니다.');
     }
   }

   // 새롭게 가족을 추가하는 경우
   else if(NewMember) {
     try {
      const existingFamily = await db.collection('FamilyRoom').findOne({member:{$in:[userNickname]}});
       if(existingFamily) {
        if(existingFamily.member.length < 4) {
       await db.collection('FamilyRoom').updateOne(
        {member: {$in: [userNickname]}}, 
        {$addToSet: {member: NewMember}}
       );
       response.redirect('/setting');
     }
    }
     else {
      await db.collection('FamilyRoom').insertOne(
        { member:[userNickname,NewMember] });
        response.redirect('/setting');
     } 
    }
     catch(err) {
       console.error(err);
       response.status(500).send('새로운 가족 생성 과정에서 오류가 발생했습니다.');
     }
   }
   else {
     response.status(400).send('필요한 정보가 충분하지 않습니다.');
   }

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
    } 
    else {
      return cb(null, false, { message:'비번불일치' });
    }
  })
);

// 로그인시 세션 만들기 (요청.logIn() 쓰면 자동 실행됨)
// 로그인을 성공한 user의 저장하는 함수(serializeUser)
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username,nickname: user.userNickname });
  });
});

// 유저가 보낸 쿠키 분석
// 페이지에 방문하는 모든 client에 대한 정보를 전달(deserializeUser)
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
app.post('/login', async (request, response, next) => {

  passport.authenticate('local', (error, user, info) => {
    if (error) return response.status(500).json(error)
      if (!user) return response.status(401).json(info.message)
      //일치할 경우 
    request.logIn(user, (err) => {
      //로그인 완료시 실행할 코드
      if (err) return next(err);
      response.render('homePage.ejs')
    });
  })(request, response, next);

}) 


// 달력 페이지 
app.get('/calendar', async (request,response)=>{
  let family = await db.collection('FamilyRoom').find({ member: request.user.userNickname }).toArray();

  // familyRoom 컬렉션에서 일치하는 닉네임의 유저 정보들 저장
  users = await db.collection('user_info').find({
    userNickname: { $in: family[0].member }
  }).toArray();

  console.log(family[0].member);
  console.log(users);
  
  if (family.length > 0) {
    response.render('calendar.ejs',{users:users});
  } 
})

// 달력에서 날짜 클릭시 보여주는 페이지 
app.get('/calendar/:date', async (request,response)=>{
  let users = await db.collection('user_info').find({timestamp:request.params.timestamp}).toArray();
  // console.log(request.params);
  if (users.length > 0) {
    // 데이터가 있을 경우, EJS 템플릿에 데이터 전달
    response.render('calendar.ejs', { users: users[0]});
    // console.log(users[0]);
  } 
  else {
    // 데이터가 없을 경우-데이터 전달 안함
    response.render('calendar.ejs', { users: [] });
  }
})

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/InitialScreen.html');
});

app.get('/calendardetail', (request, response) => {
  response.sendFile(__dirname + '/calendardetail.html');
});

// 캘린더 디테일 페이지 
app.get('/calendardetail/:date/:Nickname', async (request,response)=>{
  let users = await db.collection('user_info').find({ userNickname : request.params.Nickname}).toArray();
  // console.log(users[0]);
  response.render('calendardetail.ejs', {users : users[0]})
});

// 가족추가 페이지 
app.get('/addUser', async (request,response)=>{

  let users = await db.collection('FamilyRoom').find({}).toArray();
  response.render('addUser.ejs');
})

//FamilyRoom 데이터에 저장 
app.post('/addUser', async (request, response) => {
  const userNickname = request.user.userNickname; // 로그인한 사용자의 닉네임
  const NewMember = request.body.NewMember; // 새로 추가할 멤버 정보
  const Member = request.body.Member // 기존의 멤버 

  //console.log(userNickname)
  // 기존 가족과 연결
  if (Member) {
    try {
      // 기존 가족 찾기
      const existingFamily = await db.collection('FamilyRoom').findOne({ member: { $in: [Member] } });
      
      if (existingFamily) {
        // userNickname이 속한 가족 찾기
        const userFamily = await db.collection('FamilyRoom').findOne({ member: { $in: [userNickname] } });
        
        if (userFamily) {
          // 두 가족의 멤버 배열 병합 및 중복 제거
          const combinedMembers = Array.from(new Set([...existingFamily.member, ...userFamily.member]));
          
          // userNickname이 속한 가족 삭제
          await db.collection('FamilyRoom').deleteOne({ member: userNickname });

          if (combinedMembers.length <= 4) {
            // 기존 가족의 member 배열 업데이트
            await db.collection('FamilyRoom').updateOne(
              { _id: existingFamily._id },
              { $set: { member: combinedMembers } }
            );
            
            response.redirect('/homepage');
          } else {
            response.status(400).send('가족 구성원이 4명을 초과할 수 없습니다.');
          }
        } else {
          response.status(400).send('userNickname이 속한 가족을 찾을 수 없습니다.');
        }
      } else {
        console.log("속하지 않음");
      }
    } catch (err) {
      console.error(err);
      response.status(500).send('기존 가족 추가 과정에서 오류가 발생했습니다.');
    }
  } else if (NewMember) {
    try {
      const existingFamily = await db.collection('FamilyRoom').findOne({ member: { $in: [userNickname] } });
      
      if (existingFamily) {
        if (existingFamily.member.length < 4) {
          await db.collection('FamilyRoom').updateOne(
            { _id: existingFamily._id },
            { $addToSet: { member: NewMember } }
          );
          response.redirect('/homepage');
        } else {
          response.status(400).send('가족 구성원이 4명을 초과할 수 없습니다.');
        }
      } else {
        await db.collection('FamilyRoom').insertOne(
          { member: [userNickname, NewMember] }
        );
        response.redirect('/homepage');
      }
    } catch (err) {
      console.error(err);
      response.status(500).send('새로운 가족 생성 과정에서 오류가 발생했습니다.');
    }
  } else {
    response.status(400).send('필요한 정보가 충분하지 않습니다.');
  }
  

});

// 웹소켓 연결 확인   
io.on('connection', (socket) => {
  socket.on('ask-join', (data)=> {
    socket.join(data)
  })
  socket.on('message-send', (data)=> {
    console.log(data)
  })
})

app.get('/daily-record', (req, res) => {
    res.sendFile(__dirname + '/daily-record.html');
}); //매일 기록

app.get('/setting', (req, res) => {
  res.sendFile(__dirname + '/setting.html');
}); // 세팅

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
  await db.collection('DRsleeptime').insertOne(data);
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
  } else if (bmi >= 36) {
    healthStatus = '3단계비만';
  }

  let activityindex;
  if (gender == "male" && activity == "비활동적") {
    activityindex = 1;
  } else if (gender == "male" && activity == "저활동적") {
    activityindex = 1.11;
  } else if (gender == "male" && activity == "활동적") {
    activityindex = 1.25;
  } else if (gender == "male" && activity == "매우활동적") {
    activityindex = 1.48;
  } else if (gender == "female" && activity == "비활동적") {
    activityindex = 1.0;
  } else if (gender == "female" && activity == "저활동적") {
    activityindex = 1.12;
  } else if (gender == "female" && activity == "활동적") {
    activityindex = 1.27;
  } else if (gender == "female" && activity == "매우활동적") {
    activityindex = 1.45;
  }  

  let BMR; //기초대사량 = basal metabolic rate = BMR
  if (gender == "male") {
    BMR = (6.25 * height) + (10 * weight) - (5 * age) + 5;
  } else if(gender == "female"){
    BMR = (6.25 * height) + (10 * weight) - (5 * age) - 161; 
  }

  let RDA; //하루권장섭취량 = Recommended Daily Allowance = RDA
  RDA = BMR * activityindex;

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
    timestamp: koreanTime,
    activityindex: activityindex,
    BMR: BMR,
    RDA: RDA
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

