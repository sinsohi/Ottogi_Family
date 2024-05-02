

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

  let date = 1;
  //6주차에 걸친 달력 생성 
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr"); //행을 생성
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) { // 첫 주의 시작일 이전은 빈셀로 채움
        const cell = document.createElement("td");
        row.appendChild(cell);
      } else if (date > daysInMonth) { // 해당 달의 일수를 초과하면 종료
        break;
      } else { 
        const cell = document.createElement("td");
        cell.textContent = date; // 셀에 해당하는 날짜를 채운다
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
