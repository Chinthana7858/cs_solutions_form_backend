const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectionString = process.env.MYSQL_URL;

const db = mysql.createConnection(connectionString);


db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/register', (req, res) => {
  const { firstName, lastName, jobTitle, company, mobileNumber, email, website } = req.body;

  const sql = `INSERT INTO registrations
    (firstName, lastName, jobTitle, company, mobileNumber, email, website) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [firstName, lastName, jobTitle, company, mobileNumber, email, website], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        console.error("Insert error:", err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ message: 'Registration successful' });
    });
    
});

app.get('/registrations', (req, res) => {
  const sql = `SELECT * FROM registrations`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch error:", err);
      return res.status(500).json({ error: 'Database fetch error' });
    }
    res.json(results); 
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
