const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const cors = require("cors");
const db = require("./db");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from your HTML page
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// POST: Endpoint to add a new patient
app.post("/api/patients", (req, res) => {
  const patientInfo = req.body;

  // Validate patient data
  if (
    patientInfo.HeartRate < 60 ||
    patientInfo.HeartRate > 80 ||
    patientInfo.BodyTemperature < 34 ||
    patientInfo.BodyTemperature > 39 ||
    !/^\d{16}$/.test(patientInfo.NationalID) // Check if National ID is 16 digits
  ) {
    return res.status(400).json({
      error: "Invalid patient data. Heart rate should be between 60 and 80, body temperature between 34 and 39, and National ID should contain sixteen digits.",
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

// GET: Endpoint to retrieve a list of patients
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

// PUT: Endpoint to update an existing patient's information (you need to specify the patient ID)
app.put("/api/patients/:id", (req, res) => {
  const patientId = req.params.id;
  const updatedPatientInfo = req.body;

  res.json(updatedPatientInfo);
});

// DELETE: Endpoint to delete a patient by ID
app.delete("/api/patients/:id", (req, res) => {
  const patientId = req.params.id;

  res.json({ message: "Patient deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
