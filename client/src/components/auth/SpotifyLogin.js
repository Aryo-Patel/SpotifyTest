import React, {Fragment} from 'react';

import axios from 'axios';

import {connect} from 'react-redux';


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