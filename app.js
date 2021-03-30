//import the config variables if not in production
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//NPM package imports
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const cors = require('cors');
const session = require('express-session');

//configuring the app to be compatible with passportJS
const app = express();
app.use(cors())
app.use(express.json());
app.use(flash());   

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//assign port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


