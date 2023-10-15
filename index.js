// const express = require("express");
// const bodyParser = require("body-parser");
// const app = express();
// const port = 3000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require("cors")());

// const patientData = [];

// app.post("/api/patient", (req, res) => {
//   const patientInfo = req.body;
//   console.log(patientInfo);
//   patientData.push(patientInfo);
//   console.log({patientData});
//   res.status(201).json({ message: "Patient data received and stored." });
// });

// app.get("/api/patients", (req, res) => {
//   res.json(patientData);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });