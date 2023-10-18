const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
const db = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/api/patient", (req, res) => {
  const patientInfo = req.body;

  // Validate patient data
  if (
    patientInfo.HeartRate < 60 ||
    patientInfo.HeartRate > 80 ||
    patientInfo.BodyTemperature < 34 ||
    patientInfo.BodyTemperature > 39
  ) {
    return res.status(400).json({
      error: "Invalid patient data. Heart rate should be between 60 and 80, and body temperature between 34 and 39.",
    });
  }

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
