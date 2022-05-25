import React from 'react';
import logo from './logo.svg';
import './App.css';
import Grid from './components/Grid/Grid';
import TextInputGrid from './components/TextInputGrid/TextInputGrid';
const json = require('./data.json');

function App() {
  return (
    <div className='App'>
      {/* <Grid /> */}
      <TextInputGrid data={json} setCost={100000}></TextInputGrid>
    </div>
  );
}

export default App;
