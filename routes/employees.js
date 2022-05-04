const express = require('express');
const databaseConnection = require('../lib/database');
const router = express.Router();
const { route } = require('express/lib/application');

router.get('/', (req, res, next) => {
    databaseConnection.query('SELECT * FROM `emloyees_employees`', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('employees', { data: 'test' });
        } else {
            res.render('employees', { data: rows });
        }
    });
});

router.get('/show/:employeeNumber', (req, res, next) => {
    let employeeNumber = req.params.employeeNumber;

    databaseConnection.query('SELECT * FROM `emloyees_employees` ee LEFT JOIN offices o ON o.officeCode = ee.officeCode WHERE ee.employeeNumber = ' + employeeNumber, (err, rows) => {
        if (err) throw err;

        if (rows.length <= 0) {
            req.flash('error', 'Toks darbuotojas nerastas');
            res.redirect('/employees');
        } else {
            res.render('employees/show', {
                employeeNumber: rows[0].employeeNumber,
                lastName: rows[0].lastName,
                firstName: rows[0].firstName,
                email: rows[0].email,
                jobTitle: rows[0].jobTitle,
                reportsToLastName: rows[0].reportsToLastName,
                reportsToFirstName: rows[0].reportsToFirstName,
                reportsTojobTitle: rows[0].rep,
                city: rows[0].city,
                phone: rows[0].phone,
                addressLine1: rows[0].addressLine1,
                postalCode: rows[0].postalCode
            })
        }

    });
});

module.exports = router;