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


app.get('/login',(request,response)=>{
  response.sendFile(__dirname + '/login.html')
})

app.get('/calendardetail',(request,response)=>{
  response.sendFile(__dirname + '/calendardetail.html')
})