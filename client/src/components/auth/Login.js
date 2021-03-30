import React, {Fragment, useState} from 'react';

import {Redirect, useHistory} from 'react-router-dom';

import {connect} from 'react-redux';
import {userLogin} from '../../actions/auth';
import axios from 'axios';

import SpotifyLogin from './SpotifyLogin'

const Login = ({userLogin}) => {
    let history = useHistory();

    const [loginCreds, updateLoginCreds] = useState({
        email: "",
        password: ""
    })

    function loginInputsChanged(e) {
        
        updateLoginCreds({
            ...loginCreds,
            [e.target.name] : e.target.value
        })
    }

    async function attemptLogin(e) {
        const body = JSON.stringify(loginCreds);
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }
        try{
            let returnedUser = await axios.post('/api/auth/login', body, config);

            returnedUser = returnedUser.data;
            console.log(returnedUser);

            returnedUser = {
                username: returnedUser.username,
                email: returnedUser.email,
                access_level: returnedUser.access_level
            }
            userLogin(returnedUser);
            console.log('logged in');
            history.push('/');
           
        }catch(err){
            const errors = err.response.data.errors;

            console.error(errors);
        }

    }

    return (
        <Fragment>
            <input type = "text" value = {loginCreds.email} name = "email" placeholder= "Enter your email" onChange = {e => loginInputsChanged(e)}/>
            <br />
            <input type = "password"  value = {loginCreds.password} name = "password" placeholder = "Enter your password" onChange = {e => loginInputsChanged(e)}/>
            <br />
            <button onClick = {e => attemptLogin(e)}>Submit</button>
            <br></br>
            <br></br>
            <br></br>
            <SpotifyLogin />
        </Fragment>
    )
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, {userLogin})(Login);