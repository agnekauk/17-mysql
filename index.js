const createError = require('http-errors');
const express = require('express');
const path = require('path');
var flash = require('express-flash');
const session = require('express-session');
const mysql = require('mysql');
const connection = require('./lib/database');

const productsRouter = require('./routes/products');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

app.use(flash());
app.use('/products', productsRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.listen(3000);