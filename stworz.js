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

    db.changeUser({ database: 'alarm' }, (err) => {
        if(err) throw err;
        console.log("polączono")
    })

    let sql1 = `CREATE TABLE Dane(Nazwa varchar(255), Stan_Ostrzegawczy decimal(65),Stan_Alarmowy decimal(65))`;

    db.query(sql1, (err) => {
        if(err) throw err;
        console.log("dodano")
    })

    let sql2 = `INSERT INTO Dane(Nazwa, Stan_Ostrzegawczy, Stan_Alarmowy)
    VALUES 
    ('Sandomierz', 500, 530),
    ('Radom', 600, 680),
    ('Góra Kalwaria', 1000, 1050);`
    db.query(sql2, (err) => {
        if(err) throw err;
        console.log("dodano")
    })


db.end();
