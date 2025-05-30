const calendarTitle = document.getElementById("calendarTitle");
const calendarBody = document.getElementById("calendarBody");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const timeSlots = document.getElementById("timeSlots");
const form = document.getElementById("reservationForm");

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

const TIMES = Array.from({length: 13}, (_, i) => `${9 + i}:00`);

function renderCalendar(date) {
  calendarBody.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();
  calendarTitle.textContent = `${year}年${month + 1}月`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();

  let row = document.createElement("tr");

  for (let i = 0; i < startDay; i++) {
    row.appendChild(document.createElement("td"));
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const td = document.createElement("td");
    td.textContent = day;
    const thisDate = new Date(year, month, day);

    td.onclick = () => {
      selectedDate = thisDate;
      [...calendarBody.querySelectorAll("td")].forEach(td => td.classList.remove("selected"));
      td.classList.add("selected");
      renderTimeSlots(thisDate);
    };

    row.appendChild(td);
    if (row.children.length === 7) {
      calendarBody.appendChild(row);
      row = document.createElement("tr");
    }
  }

  if (row.children.length > 0) {
    while (row.children.length < 7) row.appendChild(document.createElement("td"));
    calendarBody.appendChild(row);
  }
}

function renderTimeSlots(date) {
  timeSlots.innerHTML = "";
  // ここで実際の予約状況を取得する処理に置換予定
  const reserved = getReservedTimes(date); // 仮関数

  TIMES.forEach(time => {
    const btn = document.createElement("button");
    btn.textContent = time;
    if (reserved.includes(time)) {
      btn.disabled = true;
    } else {
      btn.onclick = () => {
        selectedTime = time;
        [...timeSlots.querySelectorAll("button")].forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
    }
    timeSlots.appendChild(btn);
  });
}

function getReservedTimes(date) {
  // 仮: 予約されている時間枠（本来はスプレッドシート/API等から取得）
  return ["13:00", "15:00"];
}

prevMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

form.onsubmit = (e) => {
  e.preventDefault();
  if (!selectedDate || !selectedTime) {
    alert("日付と時間を選択してください。");
    return;
  }
  const data = new FormData(form);
  const summary = `■氏名: ${data.get("name")}
■電話番号: ${data.get("tel")}
■メールアドレス: ${data.get("email")}
■依頼内容: ${data.get("content")}
■予約日程: ${selectedDate.toLocaleDateString()} ${selectedTime}\n■キャンセル用リンク: [ここにキャンセルリンク]`;
  alert("予約が送信されました:\n" + summary);
  form.reset();
  timeSlots.innerHTML = "";
};

renderCalendar(currentDate);
