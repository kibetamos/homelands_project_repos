import './App.css';
import './css/cases.css';
import Axios from 'axios';
import { useState } from 'react';
import './components/Cases'

function App() {
const [query, setquery] = useState("")  
const [cases, setCases] = useState([])
const url = `http://127.0.0.1:8000/fulltext/cases/${query}`;
// const fullSearchUrl = 'http://127.0.0.1:8000/fulltext/cases/'


  async function getCases(){
    var result = await Axios.get(url);
    setCases(result.data.hits)
    console.log(result.data);
  }
    const onSubmit = (e) => {
      e.preventDefault();
      getCases();
    }
  return (
    <div className="App">
          <header className="App-header">
          <h1 className="App-title">Legal Search</h1>
        </header>
        <form className="app__searchForm" onSubmit={onSubmit}>
        <input
          className="app__input"
          type="text"
          placeholder="enter ingridient"
          autoComplete="Off"
          value={query}
          onChange={(e) => setquery(e.target.value)}
        />
        <input className="app__submit" type="submit" value="Search" />
      </form>
     
     <div>
     {cases.map(cases => {
      return <p>{cases.meta_info['Parties: ']}</p>;
     })}
     </div>
    </div>
  );
}

export default App;
