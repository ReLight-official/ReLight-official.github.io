let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
const holidays = []; // 祝日を追加する場合は ["1/1", "5/3", ...] の形式で記述

const calendarTitle = document.getElementById('calendar-title');
const calendarContainer = document.getElementById('calendar-container');
const timeslotContainer = document.getElementById('timeslot-container');

document.getElementById('prev-month').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById('next-month').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

function renderCalendar() {
  calendarContainer.innerHTML = '';
  timeslotContainer.innerHTML = '';
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  calendarTitle.textContent = `${year}年${month + 1}月`;

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const startDay = start.getDay();

  const table = document.createElement('table');
  const header = table.insertRow();
  ['日','月','火','水','木','金','土'].forEach(d => {
    const th = document.createElement('th');
    th.innerText = d;
    header.appendChild(th);
  });

  let row = table.insertRow();
  for (let i = 0; i < startDay; i++) row.insertCell();

  for (let d = 1; d <= end.getDate(); d++) {
    const date = new Date(year, month, d);
    if (row.cells.length === 7) row = table.insertRow();

    const cell = row.insertCell();
    cell.innerText = d;

    const day = date.getDay();
    if (day === 0 || holidays.includes(`${month+1}/${d}`)) cell.classList.add('sun');
    else if (day === 6) cell.classList.add('sat');

    cell.onclick = () => {
      selectedDate = date;
      renderTimeslots();
      document.querySelectorAll('td.selected').forEach(td => td.classList.remove('selected'));
      cell.classList.add('selected');
    };
  }
  calendarContainer.appendChild(table);
}

function renderTimeslots() {
  timeslotContainer.innerHTML = '';
  for (let hour = 9; hour <= 21; hour++) {
    const slot = document.createElement('div');
    slot.className = 'timeslot';
    slot.innerText = `${hour}:00`;

    const key = `${selectedDate.toDateString()}_${hour}`;
    if (localStorage.getItem(key)) continue;

    slot.onclick = () => {
      selectedTime = hour;
      document.querySelectorAll('.timeslot').forEach(el => el.classList.remove('selected'));
      slot.classList.add('selected');
    };
    timeslotContainer.appendChild(slot);
  }
}

document.getElementById('reservation-form').onsubmit = function (e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const phone = this.phone.value.trim();
  const email = this.email.value.trim();
  const details = this.details.value.trim();

  if (!selectedDate || !selectedTime) {
    alert("日付と時間を選択してください");
    return;
  }

  const emailKey = `user_${email}`;
  if (localStorage.getItem(emailKey)) {
    alert("すでに予約があります（1件のみ）");
    return;
  }

  const reservationKey = `${selectedDate.toDateString()}_${selectedTime}`;
  localStorage.setItem(reservationKey, JSON.stringify({ name, phone, email, details }));
  localStorage.setItem(emailKey, reservationKey);

  document.getElementById("status").innerText = "予約を完了しました！";
  renderTimeslots();
  this.reset();
};

renderCalendar();
