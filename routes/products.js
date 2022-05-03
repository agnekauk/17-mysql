import express from "express";
import databaseConnection from '../lib/database.js'
const router = express.Router();
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');

router.get('/products', (req, res, next) => {
    databaseConnection.query('SELECT * FROM products', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('products', { data: '' });
        } else {
            res.render('products', { data: rows }); // data:rows yra sql užklausos rezultatas kaip JSON masyvas
        }
    });
});

module.exports = router;