

/* 달력 이동 제공 */
// 현재 연도와 월을 가져옴
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 주어진 연도와 월에 해당하는 달력생성 함수
function createCalendar(year, month) {
  const calendarBody = document.querySelector("#calendar tbody");
  calendarBody.innerHTML = ''; // 달력을 비운다

  //주어진 연도와 월에 해당하는 달의 총 일수와 첫 번쨰 날의 요일을 구함
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  //달력 상단에 현재 연도와 월 표시
  document.getElementById("currentMonth").textContent = `${year}/${month + 1}`;

  // 오늘 날짜 확인 
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();


  let date = 1;
  //6주차에 걸친 달력 생성 
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr"); //행을 생성
    for (let j = 0; j < 7; j++) {
      // 첫 주의 시작일 이전은 빈셀로 채움
      if (i === 0 && j < firstDayOfMonth) { 
        const cell = document.createElement("td");
        row.appendChild(cell);
      } 
      // 해당 달의 일수를 초과하면 종료
      else if (date > daysInMonth) {
        break;
      } 
      // 셀에 해당하는 날짜를 채운다
      else { 
        const cell = document.createElement("td");
        cell.textContent = date; 
        if (year === todayYear && month === todayMonth && date === todayDate) {
          cell.classList.add("today");  
        }
        // 즉시 실행 함수를 사용하여 클릭 이벤트 리스너에 date 값을 "캡처"
        (function(currentDate) {
          cell.addEventListener('click', function() {
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;
            window.location.href = `/calendar/${formattedDate}`;
          });
        })(date);
        row.appendChild(cell);
        date++;
      }
    }
    calendarBody.appendChild(row); // 행을 달력에 추가
  }
}

// 이전 달로 이동하는 함수
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { // 1월 이전에는 작년 12월로 이동
    currentMonth = 11;
    currentYear--;
  }
  createCalendar(currentYear, currentMonth); // 새로운 달력 생성
}

// 다음 달로 이동하는 함수
function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { // 12월 다음에는 내년 1월로 이동
    currentMonth = 0;
    currentYear++;
  }
  createCalendar(currentYear, currentMonth); // 새로운 달력을 생성
}



// 초기 달력을 생성
createCalendar(currentYear, currentMonth);