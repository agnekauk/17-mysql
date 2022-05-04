const express = require('express');
const databaseConnection = require('../lib/database');
const router = express.Router();
const { route } = require('express/lib/application');

router.get('/', (req, res, next) => {
    databaseConnection.query('SELECT * FROM productlines', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('productlines', { data: 'test' });
        } else {
            res.render('productlines', { data: rows });
        }
    });
});

module.exports = router;