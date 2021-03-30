import React, {Fragment, useState} from 'react';



import {connect} from 'react-redux';

import axios from 'axios';

import {Link, Redirect} from 'react-router-dom'
const Landing = ({auth}) => {

    const [new_page, update_new_page]  = useState({
        endpoint: "",
        playlist_name: "",
        songs: ""
    });

    function enter_values(e){
        update_new_page({
            ...new_page,
            [e.target.name] : e.target.value
        })
    }

    async function createPage(e){
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const endpoint = new_page.endpoint.split(" ").join("-");
        const processedSongs = new_page.songs.split(", ");

        const body = {
            endpoint: endpoint,
            playlist_name: new_page.playlist_name,
            songs: processedSongs
        }
        try{
            await axios.post('/api/jobs/create-page', body, config);

            await axios.post('/api/jobs/add-to-page-DB', body, config);

        }catch(err){
            console.error(err);
        }
    }
    return (
        <Fragment>
            {!auth.isAuthenticated ? (
                <Fragment>
                    <h1>Test</h1>

                    <Link to = '/auth/login'>Login</Link>
                    <Link to = "/auth/register">Register</Link>
                    {/* <Link to = "/auth/login-spotify">Login-Spotify</Link> */}
                </Fragment>
            ): 
            (
                <Fragment>
                    <div className = "create-page">
                        <h1>Hello {auth.user.username}</h1>
                    </div>
                </Fragment>
            )}
                
        </Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(Landing);