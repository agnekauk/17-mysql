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

router.get('/add', (req, res, next) => {
    res.render('productlines/add', {
        productLine: '',
        textDescription: '',
        htmlDescription: '',
        image: ''
    })
});

router.post('/add', (req, res, next) => {

    let productLine = req.body.productLine;
    let textDescription = req.body.textDescription;
    let htmlDescription = req.body.htmlDescription;
    let image = req.body.image;

    let errors = false;

    if (productLine.length === 0 ||
        textDescription.length === 0
    ) {

        errors = true;
        req.flash('error', 'Visi laukeliai turi būti užpildyti');

        res.render('productlines/add', {
            productLine: productLine,
            textDescription: textDescription,
            htmlDescription: htmlDescription,
            image: image
        })
    }
    if (!errors) {
        let form_data = {
            productLine: productLine,
            textDescription: textDescription,
            htmlDescription: htmlDescription,
            image: image
        }
        databaseConnection.query('INSERT INTO productlines SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('productlines/add', {
                    productLine: form_data.productLine,
                    textDescription: form_data.textDescription,
                    htmlDescription: form_data.htmlDescription,
                    image: form_data.image
                })
            } else {
                req.flash('success', 'Produktų linija pridėta');
                res.redirect('/productlines');
            }
        })
    }
});

router.get('/delete/:productLine', (req, res, next) => {
    let productLine = req.params.productLine;
    databaseConnection.query('DELETE FROM productlines WHERE productLine ="' + productLine + '"', (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/productlines');
        } else {
            req.flash('success', 'Produktų linija, kurios pavadinimas yra ' + productLine + ' sėkmingai ištrintas.')
            res.redirect('/productlines');
        }
    })
});

module.exports = router;