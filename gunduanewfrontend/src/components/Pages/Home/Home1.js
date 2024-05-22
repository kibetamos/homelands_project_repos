import React, { useState } from 'react';
import { useNavigate, useHistory } from 'react-router-dom';
import './legal.css';
// import  from 'legal.css';
import Sidebar from '../../_layouts/Sidebar/Sidebar';

const LegalHomepage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('email', email);
    navigate.push('/terms');
  };

  return (
    
    <div className="legal-homepage">
      
      <header>
        <h1>Legal Homepage</h1>
      </header>
      
      <nav>
      {/* navigate('/home'); */}
        <navigate to="/terms">Terms and Conditions</navigate>
        <navigate to="/privacy">Privacy Policy</navigate>
      </nav>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button type="submit">Agree</button>
        </form>
      </main>
      <footer>
        <p>Copyright © 2023 Legal Homepage</p>
      </footer>
    </div>
  );
};

export default LegalHomepage;
