let userEmail = ''; // ใช้เก็บอีเมลของผู้ใช้

// ฟังก์ชันที่ทำงานเมื่อผู้ใช้ล็อกอินสำเร็จ
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId());
  console.log("Name: " + profile.getName());
  console.log("Email: " + profile.getEmail());
  
  // เก็บอีเมลของผู้ใช้
  userEmail = profile.getEmail();

  // เปิดใช้งานปุ่มจองวันเมื่อผู้ใช้ล็อกอิน
  document.getElementById('bookBtn').disabled = false;
}

document.addEventListener("DOMContentLoaded", function () {
  const calendarContainer = document.getElementById("calendar");
  const monthSelect = document.getElementById("monthSelect");
  const yearSelect = document.getElementById("yearSelect");

  function renderCalendar(month, year) {
    const date = new Date(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let daysHTML = "<div class='days'>";

    // การแสดงวันที่ในเดือนนั้นๆ
    for (let i = 0; i < firstDay; i++) {
      daysHTML += "<div class='day empty'></div>";
    }

    for (let i = 1; i <= daysInMonth; i++) {
      daysHTML += `<div class='day' data-date='${i}'>${i}</div>`;
    }

    daysHTML += "</div>";
    calendarContainer.innerHTML = daysHTML;

    // เพิ่ม event ให้กับวันเพื่อให้เลือกได้
    const days = document.querySelectorAll(".day");
    days.forEach(day => {
      day.addEventListener("click", function () {
        days.forEach(d => d.classList.remove("selected"));
        this.classList.add("selected");

        const selectedDay = this.getAttribute("data-date");
        const selectedMonth = monthSelect.options[month].text;
        const selectedYear = year;

        alert(`คุณเลือกวัน: ${selectedDay} ${selectedMonth} ${selectedYear}`);

        // ส่งอีเมลแจ้งเตือน
        sendBookingEmail(userEmail, selectedDay, selectedMonth, selectedYear);
      });
    });
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  renderCalendar(currentMonth, currentYear);

  // ให้สามารถเลือกเดือนและปีได้
  monthSelect.addEventListener("change", function () {
    renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
  });

  yearSelect.addEventListener("change", function () {
    renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
  });
});

// ฟังก์ชันส่งอีเมลแจ้งเตือน
function sendBookingEmail(toEmail, selectedDay, month, year) {
  let mailOptions = {
    from: 'smithman096@gmail.com',  // ใช้อีเมลของคุณ
    to: toEmail, 
    subject: 'การจองของคุณสำเร็จ!',
    text: `คุณได้ทำการจองวันที่ ${selectedDay} ${month} ${year} เรียบร้อยแล้ว!`
  };

  fetch('/send-email', {
    method: 'POST',
    body: JSON.stringify(mailOptions),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log('Email sent: ' + data.message))
  .catch(error => console.log('Error:', error));
}
