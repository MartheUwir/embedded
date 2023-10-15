const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('patient.db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create the patients table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY,
    PatientName TEXT,
    NationalID TEXT,
    HeartRate INTEGER,
    BodyTemperature REAL,
    FrequentSickness TEXT
  )`);
});

// POST route to save patient data
app.post('/api/patient', (req, res) => {
  const patientInfo = req.body;

  db.run(`INSERT INTO patients (PatientName, NationalID, HeartRate, BodyTemperature, FrequentSickness) VALUES (?, ?, ?, ?, ?)`,
    [patientInfo.PatientName, patientInfo.NationalID, patientInfo.HeartRate, patientInfo.BodyTemperature, patientInfo.FrequentSickness],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error saving patient data' });
      } else {
        res.status(201).json({ message: 'Patient data received and stored.' });
      }
    });
});

// GET route to retrieve patient data
app.get('/api/patients', (req, res) => {
  db.all('SELECT * FROM patients', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Error retrieving patient data' });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
