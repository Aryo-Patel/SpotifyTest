import React, {Fragment, useState} from 'react';

import {useHistory} from 'react-router-dom';

import axios from 'axios';

const Register = (props) => {
    let history = useHistory();
    const [regInfo, updateRegInfo] = useState({
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        access_level: 'basic'
    })

    function regInputsChanged(e) {
        updateRegInfo({
            ...regInfo,
            [e.target.name] : e.target.value
        })
    }

    async function register(e) {
        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        };


        const body = JSON.stringify(regInfo);

        
        
        try{
            await axios.post('/api/auth/register', body, config);
            history.push('/auth/login');
        }catch(err) {
            const errors = err.response.data.errors;
            console.error(errors);
        }
    }
    return (
        <Fragment>
            <input value = {regInfo.username} type = "text" name = 'username' placeholder = 'Enter your username'onChange = {e => regInputsChanged(e)}/>
            <input value = {regInfo.email }type = "email" name = 'email' placeholder = 'Enter your email'onChange = {e => regInputsChanged(e)}/>
            <input value = {regInfo.password} type = "password" name = 'password' placeholder = 'Enter your password'onChange = {e => regInputsChanged(e)}/>
            <input value = {regInfo.confirm_password} type = "password" name = 'confirm_password' placeholder = 'Confirm your password'onChange = {e => regInputsChanged(e)}/>

            <button onClick = {async (e) => await register(e)}>Submit</button>
        </Fragment>
    )
}

export default Register;