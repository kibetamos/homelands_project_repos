import React from 'react';
import { useState } from 'react';


const Form = props => (
    
  <form onSubmit={props.getCase} style={{ marginBottom:"2rem" }}>
    
    <input className="form__input" type="text" name="caseName" placeholder='Enter Case'  />
    <button className="form__button">Search</button>
  </form>
);

export default Form;