import React, { Component } from 'react';
import Search from './components/Search';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <div>
            <Switch>
              <Route path="/" component={Search} exact></Route>
              <Route path={`/page/:currentPage`} component={Search}></Route>
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
