import React, { Component } from 'react';
import './App.css';
// import './css/cases.css'
import Form from './components/Form';
import Cases from './components/case/DataFetch';
// import axios from 'axios';

// const url = 'http://127.0.0.1:8000/cases/';
// const fullSearchUrl = 'http://127.0.0.1:8000/fulltext/cases/'


class App extends Component { 
  state = {
    items: []
  }
  getCase = async (e)  =>{
    const caseName = e.target.elements.caseName.value;
    e.preventDefault();
    const api_call = await fetch(`http://127.0.0.1:8000/fulltext/cases/${caseName}`);
    const data = await api_call.json();

    this.setState({items: data });

    // this.setState({ cases: data.cases });

    console.log(this.state.items );
  }
  // componentDidMount = () => {
  //   const json = localStorage.getItem("items");
  //   const items = JSON.parse(json);
  //   this.setState({ items });
  // }

  // componentDidUpdate = () => {
  //   const items = JSON.stringify(this.state.items);
  //   localStorage.setItem("items", items);
  // }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Legal Search</h1>
        </header>
        <Form getCase={this.getCase}/>  

        < Cases items={this.state.items}/>
      </div>
    );
  }
}

export default App;