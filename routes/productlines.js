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
        req.flash('error', 'Pirmi du laukeliai turi būti užpildyti');

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

router.get('/edit/:productLine', (req, res, next) => {
    let productLine = req.params.productLine;
    databaseConnection.query('SELECT * FROM productlines WHERE productLine ="' + productLine + '"', (err, rows, fields) => {
        if (err) throw err;
        if (rows.length <= 0) {
            req.flash('error', 'Tokia produktų linija nerasta');
            res.redirect('/productlines');
        } else {
            res.render('productlines/edit', {
                productLine: rows[0].productLine,
                textDescription: rows[0].textDescription,
                htmlDescription: rows[0].htmlDescription,
                image: rows[0].image
            });
        }
    });
});

router.post('/update/:productLine', (req, res, next) => {
    let productLine = req.params.productLine;
    let textDescription = req.body.textDescription;
    let htmlDescription = req.body.htmlDescription;
    let image = req.body.image;
    let errors = false;

    if (productLine.length === 0 ||
        textDescription.length === 0) {

        errors = true;
        req.flash('error', 'Pirmi du laukeliai turi būti užpildyti');

        res.render('productlines/edit', {
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
        databaseConnection.query('UPDATE productlines SET ? WHERE productLine="' + productLine + '"', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('productlines/edit', {
                    productLine: productLine,
                    textDescription: form_data.textDescription,
                    htmlDescription: form_data.htmlDescription,
                    image: form_data.image
                })
            } else {
                req.flash('success', 'Produktų linija redaguota sėkmingai.');
                res.redirect('/productlines');
            }
        })
    }
});

module.exports = router;