et selectedDate = '';
let selectedTime = '';
let currentMonth = new Date();

function renderCalendar(monthDate) {
  const calendar = document.getElementById("calendar");
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let html = `<table><thead>
    <tr><th colspan="7">
      <button type="button" id="prev-month">前の月</button>
      <span id="current-month">${year}年${month + 1}月</span>
      <button type="button" id="next-month">次の月</button>
    </th></tr>
    <tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>
  </thead><tbody><tr>`;

  for (let i = 0; i < firstDay.getDay(); i++) html += '<td></td>';

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    html += `<td class="${dayOfWeek === 6 ? 'sat' : ''}${dayOfWeek === 0 ? 'sun' : ''}" data-date="${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}">${day}</td>`;
    if (dayOfWeek === 6 && day !== lastDay.getDate()) html += '</tr><tr>';
  }
  html += '</tr></tbody></table>';
  calendar.innerHTML = html;

  document.querySelectorAll("#calendar td[data-date]").forEach(td => {
    td.onclick = () => {
      selectedDate = td.dataset.date;
      document.querySelectorAll("#calendar td").forEach(el => el.classList.remove("selected"));
      td.classList.add("selected");
      renderTimeSlots();
    };
  });

  document.getElementById("prev-month").onclick = () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar(currentMonth);
  };

  document.getElementById("next-month").onclick = () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar(currentMonth);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar(currentMonth);
  setupForm();
});
