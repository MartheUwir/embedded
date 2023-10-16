const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('patientDatabase.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY, PatientName TEXT, NationalID TEXT, HeartRate INT, BodyTemperature REAL, FrequentSickness TEXT)");
});

module.exports = db;
