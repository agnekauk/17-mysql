const express = require('express');
const databaseConnection = require('../lib/database');
const router = express.Router();
const { route } = require('express/lib/application');

router.get('/', (req, res, next) => {
    databaseConnection.query('SELECT * FROM products', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('products', { data: 'test' });
        } else {
            res.render('products', { data: rows }); // data:rows yra sql užklausos rezultatas kaip JSON masyvas
        }
    });
});

router.get('/add', (req, res, next) => {
    res.render('products/add', {
        productCode: '',
        productName: '',
        productLine: '',
        buyPrice: ''
    })
});

router.post('/add', (req, res, next) => {

    let productCode = req.body.productCode;
    let productName = req.body.productName;
    let productLine = req.body.productLine;
    let buyPrice = req.body.buyPrice;

    let errors = false;

    if (productCode.length === 0 ||
        productName.length === 0 ||
        productLine.length === 0 ||
        buyPrice.length === 0) {

        errors = true;
        req.flash('error', 'Visi laukeliai turi būti užpildyti');

        res.render('products/add', {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        })
    }
    if (!errors) {
        let form_data = {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        }
        databaseConnection.query('INSERT INTO products SET ?', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('products/add', {
                    productCode: form_data.productCode,
                    productName: form_data.productName,
                    productLine: form_data.productLine,
                    buyPrice: form_data.buyPrice
                })
            } else {
                req.flash('success', 'Produktas pridėtas');
                res.redirect('/products');
            }
        })
    }
})

router.get('/delete/:productCode', (req, res, next) => {
    let productCode = req.params.productCode;
    databaseConnection.query('DELETE FROM products WHERE productCode ="' + productCode + '"', (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/products');
        } else {
            req.flash('success', 'Produktas, kurio kodas yra ' + productCode + ' sėkmingai ištrintas.')
            res.redirect('/products');
        }
    })
})

router.get('/edit/:productCode', (req, res, next) => {
    let productCode = req.params.productCode;
    databaseConnection.query('SELECT * FROM products WHERE productCode ="' + productCode + '"', (err, rows, fields) => {
        if (err) throw err;
        if (rows.length <= 0) {
            req.flash('error', 'Toks produktas nerastas');
            res.redirect('/products');
        } else {
            res.render('products/edit', {
                productCode: rows[0].productCode,
                productName: rows[0].productName,
                productLine: rows[0].productLine,
                buyPrice: rows[0].buyPrice
            });
        }
    });
});

router.post('/update/:productCode', (req, res, next) => {
    let productCode = req.params.productCode;
    let productName = req.body.productName;
    let productLine = req.body.productLine;
    let buyPrice = req.body.buyPrice;
    let errors = false;

    if (productName.length === 0 ||
        productLine.length === 0 ||
        buyPrice.length === 0) {

        errors = true;
        req.flash('error', 'Visi laukeliai turi būti užpildyti');

        res.render('products/edit', {
            productCode: productCode,
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        })
    }

    if (!errors) {
        let form_data = {
            productName: productName,
            productLine: productLine,
            buyPrice: buyPrice
        }
        databaseConnection.query('UPDATE products SET ? WHERE productCode="' + productCode + '"', form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('products/edit', {
                    productCode: productCode,
                    productName: form_data.productName,
                    productLine: form_data.productLine,
                    buyPrice: form_data.buyPrice
                })
            } else {
                req.flash('success', 'Produktas redaguotas sėkmingai.');
                res.redirect('/products');
            }
        })
    }
})

module.exports = router;