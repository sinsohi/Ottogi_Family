const express = require('express') // express 라이브러리
const app = express()
require("dotenv").config(); // .env 파일에 환경변수 보관

app.listen(process.env.PORT, ()=>{
    console.log('http://localhost:'+`${process.env.PORT}` +' 에서 서버 실행중')
})

app.get('/',(request,response)=>{
    response.sendFile(__dirname + '/index.html')
})