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

  const sql = `INSERT INTO registration 
  (id, firstName, lastName, jobTitle, company, mobileNumber, email, website) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const values = [
  null, 
  firstName,
  lastName,
  jobTitle,
  company,
  mobileNumber,
  email,
  website
];

db.query(sql, values, (err, result) => {
  if (err) {
    console.error("Insert error:", err);
    return res.status(500).json({ error: 'Database error' });
  }
  res.json({ message: 'Registration successful' });
});

    
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
