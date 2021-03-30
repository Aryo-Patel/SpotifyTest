//establishes this as a router. Auth routes handle login, registration, account deletion etc.
const router = require('express').Router();

//necessary imports
const bcrypt = require('bcrypt');
const passport = require('passport');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const {initializeLocal, initializeSpotify} = require('../helper/passport-config');

//Initialize passport for use in the login route
initializeLocal(passport);
initializeSpotify(passport);


let callbackPort = '/auth/spotify/callback';


//POST      /api/auth/register
//ACTION    Registers the user
//Public
router.post('/register', [
        check('username', 'Name is required').not().isEmpty(),
        check('email','Enter a valid email').isEmail(),
        check('password', 'Password length at least 6 characters').isLength({min: 6})
    ],
    async(req, res) => {
        //if the express validator is not empty, throw an error with the array of errors
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        //extract the parameters from the request
        const {email, username, password, confirm_password} = req.body;

        
        try{
            //if the same email or username exists in the database, return an error and don't proceed
            let user = await User.findOne({ $or: [{email: email}, {username: username}]});
            if(user){
                return res.status(400).json({errors: [{msg: "User already exists with that email or password"}]});
            }

            //if passwords aren't the same, return an error and don't proceed
            if(password !== confirm_password){
                return res.status(400).json({errors: [{msg: "Passwords must match"}]})
            }
            
            //encrypt the user's password so it's safe to store on the database
            const encryptedPassword = await bcrypt.hash(password, 10);

            //create a new user with the parameters from req.body
            let newUser = new User({
                email,
                username,
                password: encryptedPassword,
            });

            //save the new user to the DB
            await newUser.save();

            return res.status(200).json({msg: "success"});
        }catch(err){
            console.log(err);
        }
});

//POST       /api/auth/login
//ACTION     Logs the user in
//Public 
router.post('/login', checkNotAuthenticated, (req, res, next) => {
    
    //using custom authenticate function to return statuses to the front end and custom messages
    passport.authenticate('local', (err, user, info) => {
        //cycle through every error present so that it does not get in infinite loop
        if(err){
            console.log(err);
            return next(err);
        }

        //if user is set to false, return an error and do not log in
        if(!user) {
            return res.status(400).json({errors: [{msg: "Invalid email/password combo"}]});
        }
        else{
            //log the user in if no error, but throw error if something happens during log in
            req.logIn(user, function(err){

                if(err){
                    return next(err);
                }

                return res.status(200).json(user);
            })
            
        }
    })(req, res, next);
});



//POST       /api/auth/login-spotify
//ACTION     Logs the user in via the spotify api
//Public 
router.get('/login-spotify', checkNotAuthenticated, passport.authenticate('spotify', {
    showDialog: true,

}));
// client_id: process.env.SPOTIFY_CLIENT_ID,
// response_type: 'code',

// redirect_uri: 'http://localhost:3000/',
// clientSecret: process.env.SPOTIFY_CLIENT_SECRET,

//POST       /api/auth/login-spotify/callback
//ACTION     Logs the user in via the spotify api
//Public 
router.get(callbackPort, 
    passport.authenticate('spotify', {failureRedirect: '/'}), 
    (req, res) => {
    res.redirect('/');
    return res.status(200).json({msg: 'Spotify login successful'});
})



//DELETE       /api/auth/logout
//ACTION       Logs the user out
//Private
router.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    return res.status(200).json({msg: "Logout successful"});
});


//DELETE       /api/auth/delete
//ACTION       Deletes the current user from the database
//Private
router.delete('/delete', checkAuthenticated, async (req, res) => {
    
    //find the user in the database and delete the account
    try{
        await User.findOneAndRemove({_id: req.user._id})

        //log the user out
        req.logOut();
    }catch(err){
        console.log(err);
        return res.status(500).json({errors: [{msg: "Server error"}]});
    }
    return res.status(200).json({msg: "Account deletion successful"});
})

//middleware function that throws an error if the user is not logged in
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    return res.status(400).json({msg: "Route only accessible if logged in"});
}

//middleware function that throws an error if the user is logged in
function checkNotAuthenticated(req, res, next) {
    if(!req.isAuthenticated()){
        return next();
    }

    return res.status(400).json({msg: "Route only accessible if logged out"});
}

module.exports = router;