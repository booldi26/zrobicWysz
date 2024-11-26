const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alert'
});
db.connect();

app.get('/dodaj', (req, res) => {
    const { nazwa, warning, alarm } = req.query;
    const sql = `INSERT INTO dane(Nazwa, Stan_Ostrzegawczy, Stan_Alarmowy)
    VALUES (?, ?, ?)`;
    db.query(sql, [nazwa, warning, alarm], (err, result) => {
        if (err) throw err;
        res.send(`Data added: ${nazwa}`);
    });
});

app.get('/delete/:nazwy', (req, res) => {
    const { nazwy } = req.params;
    const sql = `DELETE ${nazwy} FROM dane LIMIT 1`
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(`Data deleted: ${nazwy}`);
    });
});

app.post('/szukaj', (req, res) => {
    const sql = `DECLARE @akcja AS VARCHAR(100);SET @akcja = ${req.body.akcja};
    SELECT *
FROM Dane
WHERE 
  CASE 
    WHEN @akcja = 'nazwa' THEN Nazwa = ${req.body.nazwa}
    WHEN @akcja = 'warning' THEN Stan_Alarmowy BETWEEN ${req.body.from} AND ${req.body.to}
    WHEN @akcja = 'alert' THEN Stan_Ostrzegawczy BETWEEN ${req.body.from} AND ${req.body.to}
    ELSE FALSE
  END;

  `;
  
  const params = [
    req.body.akcja === 'nazwa' ? req.body.nazwa : null,
    req.body.akcja === 'warning' ? req.body.wartosc : null, 
  ];
  
  db.query(sql, [req.body.akcja, ...params], (err, results) => {
    if (err) {
      res.status(500).send('Błąd podczas wykonywania zapytania');
      return;
    }
    res.json(results);
  });
});

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Example app listening on port ${port}`);
});
db.end();