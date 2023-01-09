require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

mongoose.set('strictQuery', true);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1/userDB');

const userSchema = new mongoose.mongoose.Schema ({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err) => {
            if (err) {
                console.log(err);
            } else {
                res.render('secrets');
            }
        });
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    })
});

app.listen(3000, () => {
    console.log('running on port 3000')
});
