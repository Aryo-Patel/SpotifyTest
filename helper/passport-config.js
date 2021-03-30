//required imports for passport JS login functionality
const LocalStrategy = require('passport-local').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/User');


let callbackPort = '/auth/spotify/callback';


//function corresponding to passport JS's local strategy
function initializeLocal(passport) {
    //establish the use of the local strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
    }, authenticateUser));

    //establish protocols for logging in and out (serializing and deserializing)
    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        done(null, await User.findOne({_id: id}));
    })
}


function initializeSpotify(passport) {
    console.log('spotify set up');
    passport.use(new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000' + callbackPort,
            proxy: true
        },
        function(accessToken, refreshToken, profile, done){

            process.nextTick(function(){
                console.log('access token: ' + accessToken);
                console.log('refresh token: ' + refreshToken);
                console.log('\n');
                console.log(profile);
                return done(null, profile)
            })
        }
    ))
}

//helper function that will be used by passportJS. Returns whether or not the user is valid
const authenticateUser = async (email, password, done) => {
    
    try{

        //if there's no user found with the email, return the not done condition for PassportJS
        let user = await User.findOne({email: email});
        if(!user){
            return done(null, false, {message: 'No user with such an email, register with us!'});
        }

        //if passwords match, return the user in the done condition, otherwise, return a not-done condition
        
        if(await bcrypt.compare(password, user.password)){
            return done(null, user, {message: "Login success"});
        }
        else{
            return done(null, false, {message: "Invalid email/password combo"});
        }
    }catch(err){
        console.log(err);
        
        //return errors if there's a failure
        return done(err);
    }
}

module.exports = {initializeLocal, initializeSpotify};