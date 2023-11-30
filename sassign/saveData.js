const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csvParser = require('csv-parser');

const csvFilePath = 'mydata.csv';
const dbFilePath = 'regression.db';

const db = new sqlite3.Database(dbFilePath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS regression (
    age INTEGER,
    cholesterol level INTEGER,
    blood pressure INTEGER
    -- Add more columns as per your CSV file
  )`);

  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on('data', (row) => {
      // Logging rows with invalid or incomplete data
      if (
        !row.hasOwnProperty('age') ||
        !row.hasOwnProperty('cholesterol') ||
        !row.hasOwnProperty('bp') ||
        isNaN(parseInt(row.age)) ||
        isNaN(parseInt(row.cholesterol)) ||
        isNaN(parseInt(row.bp))
      ) {
        console.log('Invalid or incomplete data in the CSV row. Skipping insertion.');
        console.log('Invalid row:', row);
      } else {
        db.run(`INSERT INTO regression (age, cholesterol, bp) VALUES (?, ?, ?)`,
          [parseInt(row.age), parseInt(row.cholesterol), parseInt(row.bp)],
          (err) => {
            if (err) {
              console.error(err.message);
            }
          });
      }
    })
    .on('end', () => {
      console.log('Data import completed.');
      db.close();
    });
});
