const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alarm'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/dodaj', (req, res) => {
    const { nazwa, warning, alarm } = req.query;
    const sql = `INSERT INTO dane (Nazwa, Stan_Ostrzegawczy, Stan_Alarmowy) VALUES (?, ?, ?)`;
    db.query(sql, [nazwa, warning, alarm], (err, result) => {
        if (err) {
            console.error('Error adding data:', err);
            res.status(500).send('Error adding data.');
            return;
        }
        res.send(`Data added: ${nazwa}`);
    });
});

app.get('/delete/:nazwy', (req, res) => {
    const { nazwy } = req.params;
    const sql = `DELETE FROM dane WHERE Nazwa = ? LIMIT 1`;
    db.query(sql, [nazwy], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).send('Error deleting data.');
            return;
        }
        res.send(`Data deleted: ${nazwy}`);
    });
});

app.post('/szukaj', (req, res) => {
  const { akcja, nazwa, from, to } = req.body;

  const sql = `
      SELECT * 
      FROM dane
      WHERE 
          CASE 
              WHEN ? = 'nazwa' THEN Nazwa = ?
              WHEN ? = 'warning' THEN Stan_Alarmowy BETWEEN ? AND ?
              WHEN ? = 'alert' THEN Stan_Ostrzegawczy BETWEEN ? AND ?
              ELSE FALSE
          END
  `;

  const params = [
      akcja,
      akcja === 'nazwa' ? nazwa : null,
      akcja,
      akcja === 'warning' ? from : null,
      akcja === 'warning' ? to : null,
      akcja,
      akcja === 'alert' ? from : null,
      akcja === 'alert' ? to : null,
  ];

  db.query(sql, params, (err, results) => {
      if (err) {
          console.error('Error searching data:', err);
          res.status(500).send('Error searching data.');
          return;
      }
      res.json(results);
  });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

