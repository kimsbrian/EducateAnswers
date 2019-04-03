import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppNavBar from './components/AppNavbar';
import {Provider} from 'react-redux';
import store from './store';
import FormURL from './components/FormURL';

import {Container} from 'reactstrap';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <AppNavBar/>
        <Container>
        <FormURL/>
        </Container>
      </div>
      </Provider>
    );
  }
}

export default App;
