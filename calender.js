let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function createCalendar(year, month) {
  const calendarBody = document.querySelector("#calendar tbody");
  calendarBody.innerHTML = '';

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  document.getElementById("currentMonth").textContent = `${year}/${month + 1}`;

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        const cell = document.createElement("td");
        row.appendChild(cell);
      } else if (date > daysInMonth) {
        break;
      } else {
        const cell = document.createElement("td");
        cell.textContent = date;
        row.appendChild(cell);
        date++;
      }
    }
    calendarBody.appendChild(row);
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  createCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  createCalendar(currentYear, currentMonth);
}

createCalendar(currentYear, currentMonth);
