const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'classicmodels'
});

connection.connect(function (error) {
    if (error) {
        console.log(error)
    } else {
        console.log('Prisijungimas įvyko sėkmingai')
    }
});

module.exports = connection;