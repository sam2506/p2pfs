// /client/App.js
import React, { Component } from "react";
import Fileshare from './container/fileshare/fileshare';

class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  render() {
    return(
      <div>
          <Fileshare/>
      </div>
    )
  }
}

export default App;