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

  // Step 1: Get the current max ID
  const getMaxIdSql = `SELECT MAX(id) AS maxId FROM registrations`;

  db.query(getMaxIdSql, (err, result) => {
    if (err) {
      console.error("Failed to fetch max id:", err);
      return res.status(500).json({ error: 'Database error while generating ID' });
    }

    const nextId = (result[0].maxId || 0) + 1;

    // Step 2: Insert with the new ID
    const insertSql = `INSERT INTO registrations
      (id, firstName, lastName, jobTitle, company, mobileNumber, email, website) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [nextId, firstName, lastName, jobTitle, company, mobileNumber, email, website];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        console.error("Insert error:", err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ message: 'Registration successful', id: nextId });
    });
  });
});

// Get all registrations
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
