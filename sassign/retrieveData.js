const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('regression.db');

let features = [];
let labels = [];

db.serialize(() => {
    db.all(`SELECT age, cholesterol, bp FROM regression`, (err, rows) => {
        if (err) {
          console.error(err.message);
          return;
        }
    

        rows.forEach((row) => {
            const age = parseInt(row.age);
            const cholesterol = parseInt(row.cholesterol);
            const bp = parseInt(row.bp);

            let labelValue;
          if (bp > 140) {
            labelValue = 'high';
          } else if (bp > 120) {
            labelValue = 'medium';
          } else {
            labelValue = 'low';
          }

            features.push([age, cholesterol]);
            labels.push(labelValue);
          });


        const splitIndex = Math.floor(0.8 * features.length);
        const trainFeatures = features.slice(0, splitIndex);
        const testFeatures = features.slice(splitIndex);
        const trainLabels = labels.slice(0, splitIndex);
        const testLabels = labels.slice(splitIndex);

        // Display the split data
        console.log('Training Features:');
        console.log(trainFeatures);
        console.log('Training Labels:');
        console.log(trainLabels);
        console.log('Testing Features:');
        console.log(testFeatures);
        console.log('Testing Labels:');
        console.log(testLabels);
  });
});

db.close();