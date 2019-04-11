import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavBar from './components/AppNavbar';
import {Provider} from 'react-redux';
import store from './store';
import HomePage from './components/HomePage';

import {Container} from 'reactstrap';




class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <AppNavBar/>
        <Container>
        <HomePage/>
        </Container>
      </div>
      </Provider>
    );
  }
}

export default App;
