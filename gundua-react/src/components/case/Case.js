import React from "react";
import { Link } from "react-router-dom";
class Case extends React.Component {
  state = {
    activeCase: []
  }
  componentDidMount = async () => {
  
    const title = this.location.activeCase.item;
    const req = await fetch(`http://127.0.0.1:8000/cases/${title}`);
    const res = await req.json();
    // console.log(res[0]);
    this.setState({activeCase: res[0]});
    console.log(this.state.activeCase);
  }
 
  render(){
    // console.log(this.props)
  const item = this.state.activeCase;
  return(
    
    <div className="container">
      { this.state.activeCase.length !== 0 && 
      <div className="active-recipe">
      <header className="App-header">
          <h1 className="App-title">Result</h1>
        </header>
    <p className="cases__subtitle">ID : <span> 
      {item._id}
        </span>
    </p>
    <p className="cases__subtitle">resolved_acts: <span> 
      {item.resolved_acts}
        </span>
    </p> 
    {/* <p className="cases__subtitle">resolved_charges: <span> 
      {item.resolved_charges}
        </span>
    </p> 
    <p className="cases__subtitle">related_cases: <span> 
      {item.related_cases}
        </span>
    </p>   */}
     {/* <p className="cases__subtitle" key={'Case Number:'}>parties_info: <span> 
      {item.parties_info['APPEALLANT: ']}
        </span>
    </p>   */}
    {/* <p className="cases__subtitle" key={item['Case Number:']}>case : <span> 
      {item.meta_info['Case Outcome:']}
        </span>
    </p>  */}
  <button className="active-recipe__button">
              <Link to="/">Go Home</Link>
            </button>
            </div>
             }
    </div>
      );
    }
}

export default Case;
