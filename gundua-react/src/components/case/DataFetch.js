import React from "react";
import { Link } from "react-router-dom";
class Cases extends React.Component {
	// Constructor
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			DataisLoaded: false
		};
	}

	// ComponentDidMount is used to
	// execute the code
	componentDidMount() {
		fetch("http://127.0.0.1:8000/cases/")
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					items: json,
					DataisLoaded: true
				});
			})
	}
	render() {
		const { DataisLoaded, items } = this.state;
		if (!DataisLoaded) 
		return <div>
			<h1 className="App-header">LOADING...</h1> </div> ;
		return (
		<div className = "container">
		{/* <header className="App-header">
        <h1 className="App-title">Legal Search</h1>
        </header> */}
		<div className="row">	      
		{
				items.map((item) => (
				<div  key  = { item._id } className="col-md-6" style={{ marginBottom:"2rem" }}>
					<h5 className="case__title"> 
                        {/* {item.meta_info['Parties: ']} */}
                        <blockquote className="blockquote-reverse">
                            { item.meta_info['Parties'].length < 95 ? `${item.meta_info['Parties']}` : 
                            `${item.meta_info['Parties'].substring(0,95)}...`}</blockquote>
                        </h5>
						<p className="cases__subtitle"> Case Outcome: <span> 
                        {item.meta_info['Case Outcome']}
                        </span>
						</p>
						{/* <p className="cases__subtitle"> JUdgement: <span> 
                        <blockquote className="blockquote-reverse">
                            { item.judgement.length < 95 ? `${item.judgement}` : 
                            `${item.judgement.substring(0,95)}...`}</blockquote>
                        </span>
						</p> */}
						<p className="cases__subtitle">Date Delivered: <span> 
                         {item.meta_info['Date Delivered']}
                         </span>
                         </p>
						 <button className="recipe_buttons">
                <Link to={{ 
                  pathname: `/case/${item._id}`,
                  state: { item: item.judgement }
                }}>View Case</Link>
              </button>
					
                    {/* <p>Case ID : {item._id}</p>
					<p>Court : {item.meta_info.Court}</p>
	
					<p>Relelated Cases: {item.referenced_cases}</p> */}
                    {/* <p>Case: { item.judgement}</p> */}

					</div>
				))
			}
		</div>
		</div>
	);
}
}

export default Cases;
