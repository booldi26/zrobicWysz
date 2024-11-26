const mysql = require('mysql');
const db= mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',	
});
db.connect();

    db.query('CREATE DATABASE IF NOT EXISTS Alarm', (err) => {
        if(err) throw err;
        console.log("utworzono")
    })

    db.changeUser({ database: 'alert' }, (err) => {
        if(err) throw err;
        console.log("polączono")
    })

    let sql = `INSERT INTO Dane(Nazwa, Stan_Ostrzegawczy, Stan_Alarmowy)
    VALUES 
    ('Sandomierz', 500, 530),
    ('Radom', 600, 680),
    ('Góra Kalwaria', 1000, 1050);`
    db.query(sql, (err) => {
        if(err) throw err;
        console.log("dodano")
    })


db.end();