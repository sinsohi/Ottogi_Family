const express = require('express') // express 라이브러리
const app = express()
require("dotenv").config(); // .env 파일에 환경변수 보관

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