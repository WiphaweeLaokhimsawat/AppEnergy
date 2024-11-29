// const bcrypt = require('bcrypt');
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// กำหนดค่าการเชื่อมต่อกับ MySQL
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'test_db',
  port: 3309
});

// เชื่อมต่อฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Endpoint สำหรับดึงข้อมูลทั้งหมดจาก test_db.user_db
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM user_db";
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
      } else {
        res.status(200).json(results); // ส่งข้อมูลกลับในรูปแบบ JSON
      }
    });
  });
  
// Endpoint ตรวจสอบ username และ password
 // const bcrypt = require('bcrypt');หากไม่ได้ใช้รหัสผ่านที่เข้ารหัส สามารถลบบรรทัดนี้ได้

app.post('/login', (req, res) => {
  const { user, password } = req.body; // ดึงข้อมูล user และ password จาก request body
  console.log('Request Body:', req.body);

  // ตรวจสอบว่า user และ password ถูกส่งมาครบ
  if (!user || !password) {
    return res.status(400).json({ error: 'Please provide both username and password' });
  }

  // สร้าง Query เพื่อตรวจสอบข้อมูลในตาราง user_db
  const query = 'SELECT * FROM user_db WHERE BINARY user = ?';
  db.query(query, [user], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // ตรวจสอบว่าพบข้อมูลผู้ใช้ในฐานข้อมูลหรือไม่
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = results[0]; // ข้อมูลผู้ใช้จากฐานข้อมูล
    const storedPassword = userData.password; // ดึงรหัสผ่านที่เก็บในฐานข้อมูล

    console.log('Stored password from DB:', storedPassword);
    console.log('Input password:', password);

    // หากคุณไม่ได้ใช้ bcrypt (รหัสผ่านไม่ถูกเข้ารหัส)
    if (password === storedPassword) {
      // รหัสผ่านตรงกัน
      return res.status(200).json({
        message: 'Login successful',
        fullname: userData.fullname,
        user: userData.user,
        role: userData.role,
        image: userData.image, // ดึงข้อมูลรูปภาพจากฐานข้อมูล
      });
    } else {
      // รหัสผ่านไม่ตรงกัน
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // หากคุณใช้ bcrypt สำหรับเข้ารหัสรหัสผ่าน (กรณีรหัสผ่านใน DB ถูกเข้ารหัส)
    /*
    bcrypt.compare(password, storedPassword, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (isMatch) {
        return res.status(200).json({
          message: 'Login successful',
          fullname: userData.fullname,
          user: userData.user,
          role: userData.role,
          image: userData.image, // ดึงข้อมูลรูปภาพจากฐานข้อมูล
        });
      } else {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    });
    */
  });
});

  
  



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});