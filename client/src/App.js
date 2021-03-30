import logo from './logo.svg';
import './App.css';

//redux imports
import {Provider} from 'react-redux';
import store from './store';


//main page
import Landing from './components/home-screen/Landing';

import {Fragment} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

//auth imports
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SpotifyLogin from './components/auth/SpotifyLogin';



function App() {
  return (
    <Provider store = {store}>
      <BrowserRouter>
      <Fragment>
        <Route exact path ='/' component = {Landing} />
        <section className = "container">
          <Switch>
            <Route exact path = '/auth/login' component = {Login} />
            <Route exact path = '/auth/register' component = {Register} />
            <Route exact path = '/auth/login-spotify' component = {SpotifyLogin} />
          </Switch>
        </section>
      </Fragment>
    </BrowserRouter>
  </Provider>
  );
}

export default App;
