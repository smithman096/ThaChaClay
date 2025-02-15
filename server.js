const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.json());

// กำหนด static file (เช่น HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ฟังก์ชันส่งอีเมล
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'smithman096@gmail.com', // ใช้อีเมลของคุณ
    pass: 'xz0962497496.', // รหัสผ่านอีเมลของคุณ
  }
});

// เส้นทางสำหรับการส่งอีเมล
app.post('/send-email', (req, res) => {
  let mailOptions = req.body;

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// เส้นทางหลักที่จะแสดงหน้า index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
