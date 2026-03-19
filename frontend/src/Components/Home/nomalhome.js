import React from 'react'
import { Link } from 'react-router-dom';
import './Home.css'

function nomalhome() {
  return (
    <div>
        <h1 className='as'>Home</h1>
        <Link to="/login">
      <button>login</button >
      </Link>
      <Link to="/register">
      <button>register</button>
      </Link>
    </div>
  )
}

export default nomalhome

