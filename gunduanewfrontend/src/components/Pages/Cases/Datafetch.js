 import React from 'react'
import Case1 from './case1'
// import Spinner from '../ui/Spinner'

const Datafetch = ({items, isLoading}) => {
//   return isLoading ? (<Spinner />) : (
  
  <section className='cards'>
        {items.map((item) => (
            <Case1 key={item._id} item={item}></Case1>
        ))}
        </section>
//   )
        }
export default Datafetch