const createError = require('http-errors');
import express from 'express';
import path from 'path';
import flash from 'flash';
import session from 'express-session';
import mysql from 'mysql';
import connection from './lib/database';

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
app.use('products', productsRouter);

app.use((req, res, next) => {
    next(createError(404));
});

app.listen(3000);