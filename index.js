const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3009;
const cors = require("cors");
const db = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/patient", (req, res) => {
  const patientInfo = req.body;

  // Insert patient data into the database
  const stmt = db.prepare("INSERT INTO patients (PatientName, NationalID, HeartRate, BodyTemperature, FrequentSickness) VALUES (?, ?, ?, ?, ?)");
  stmt.run(
    patientInfo.PatientName,
    patientInfo.NationalID,
    patientInfo.HeartRate,
    patientInfo.BodyTemperature,
    patientInfo.FrequentSickness
  );
  stmt.finalize();

  res.status(201).json({ message: "Patient data received and stored." });
});

app.get("/api/patients", (req, res) => {
  // Retrieve patient data from the database
  db.all("SELECT * FROM patients", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
