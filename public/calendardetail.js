document.addEventListener('DOMContentLoaded', function() {
  // URL에서 쿼리 파라미터를 추출
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get('date'); // 'date' 파라미터의 값을 가져옴

  // 날짜 정보를 화면에 표시
  // 예를 들어, document.getElementById('dateDisplay').innerText = date; 와 같이 사용할 수 있습니다.
});
