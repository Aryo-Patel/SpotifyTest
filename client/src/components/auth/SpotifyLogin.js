import React, {Fragment} from 'react';

import axios from 'axios';

import {connect} from 'react-redux';



/*
This is the file in question. upon calling trigger spot, it should proxy to 
http://localhost:5000/api/auth/login-spotify. However, when reading the console output,
the request is being sent from http://localhost:3000/api/auth/login-spotify, which ends up with
multiple errors (CORS, Spotify Validation etc)
*/
const SpotifyLogin = (props) => {

    async function triggerSpot() {
        const config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Contoll-Allow-Headers':  'Authorization'
            }
        }
        
        axios.get('/api/auth/login-spotify');
    }

    return (
        <Fragment>
            <a onClick = {e => triggerSpot()}>Log in with Spotify</a>
        </Fragment>
    )
}

export default connect(null, {})(SpotifyLogin);