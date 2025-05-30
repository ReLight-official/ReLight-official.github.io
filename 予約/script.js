let selectedDate = '';
let selectedTime = '';

document.addEventListener("DOMContentLoaded", () => {
  generateCalendar();
  setupForm();
});

function generateCalendar() {
  const calendar = document.getElementById("calendar");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based

  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  const table = document.createElement("table");
  const tr = document.createElement("tr");
  days.forEach(d => {
    const td = document.createElement("td");
    td.textContent = d.getDate();
    if (d.getDay() === 6) td.classList.add("sat");
    if (d.getDay() === 0) td.classList.add("sun");
    td.onclick = () => {
      selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      document.querySelectorAll("#calendar td").forEach(td => td.classList.remove("selected"));
      td.classList.add("selected");
      renderTimeSlots();
    };
    tr.appendChild(td);
  });
  table.appendChild(tr);
  calendar.innerHTML = "";
  calendar.appendChild(table);
}

function renderTimeSlots() {
  const times = Array.from({ length: 13 }, (_, i) => `${i + 9}:00`);
  const container = document.getElementById("timeslots");
  container.innerHTML = "";

  times.forEach(t => {
    const div = document.createElement("div");
    div.className = "time-slot";
    div.textContent = t;
    div.onclick = () => {
      selectedTime = t;
      document.querySelectorAll(".time-slot").forEach(e => e.classList.remove("selected"));
      div.classList.add("selected");
    };
    container.appendChild(div);
  });

  // TODO: 予約済み時間帯をGASから取得して非表示にする
}

function setupForm() {
  document.getElementById("reserveForm").onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      details: form.details.value,
      date: selectedDate,
      time: selectedTime
    };

    fetch("YOUR_GAS_URL_HERE", {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(res => res.text())
      .then(txt => {
        document.getElementById("message").textContent = txt === "OK" ? "予約完了しました。" : "予約に失敗しました：" + txt;
      });
  };
}
