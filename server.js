const express = require('express') // express 라이브러리
const app = express()
const bodyParser = require('body-parser'); //npm install body-parser
require("dotenv").config(); // .env 파일에 환경변수 보관

// body-parser 미들웨어 사용 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))

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

app.get('/',(request,response)=>{
    response.sendFile(__dirname + '/index.html')
})

app.get('/daily-record.html', (req, res) => {
    res.sendFile(__dirname + '/daily-record.html');
}); //매일 기록

app.get('/setting.html', (req, res) => {
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