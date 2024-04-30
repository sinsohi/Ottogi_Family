// 'loginForm'의 ID를 가진 HTML 요소에 대한 'submit' 이벤트의 리스너를 추가합니다.
document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  var username = document.getElementById('username').value; 
  var password = document.getElementById('password').value; 

  console.log('로그인 시도:', username, password); 
