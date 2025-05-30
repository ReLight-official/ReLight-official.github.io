// calendar.js - 完全版

const calendarTitle = document.getElementById("calendarTitle");
const calendarBody = document.getElementById("calendarBody");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const timeSlots = document.getElementById("timeSlots");
const form = document.getElementById("reservationForm");

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

const TIMES = Array.from({ length: 13 }, (_, i) => `${9 + i}:00`);

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
  timeSlots.innerHTML = "読み込み中...";
  const formattedDate = date.toLocaleDateString("ja-JP");

  fetch(`https://script.google.com/macros/s/AKfycbxGfhChEllFyPnKnvsWF_-DwApowyv8ahrPbRif-uSQUataTdMMF7Z8SlaGv7vx50-AnA/exec?date=${encodeURIComponent(formattedDate)}`)
    .then(res => res.json())
    .then(data => {
      timeSlots.innerHTML = "";
      const reserved = data.reserved || [];

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
    })
    .catch(() => {
      timeSlots.innerHTML = "時間帯の取得に失敗しました。";
    });
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
  const json = {
    name: data.get("name"),
    tel: data.get("tel"),
    email: data.get("email"),
    content: data.get("content"),
    date: selectedDate.toLocaleDateString("ja-JP"),
    time: selectedTime
  };

  fetch("https://script.google.com/macros/s/AKfycbxGfhChEllFyPnKnvsWF_-DwApowyv8ahrPbRif-uSQUataTdMMF7Z8SlaGv7vx50-AnA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        alert("予約が確定しました！");
        form.reset();
        timeSlots.innerHTML = "";
      } else {
        alert("予約できません：" + result.message);
      }
    });
};

renderCalendar(currentDate);
