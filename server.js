const express = require('express') // express 라이브러리
const app = express()
require("dotenv").config(); // .env 파일에 환경변수 보관

app.use(express.static(__dirname + '/public'))

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

// app.get('/',(request,response)=>{
//     response.sendFile(__dirname + '/index.html')
// })

app.get('/register',(request,response)=>{
  response.render('register.ejs');})

app.post('/register', async (request,response)=>{
  console.log(request.body);
  await db.collection('user_info').insertOne({
    userNickname : request.body.userNickname,
    username : request.body.username,
    password : request.body.password
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
})

