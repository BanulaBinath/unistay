import React from 'react'
import './studenthome.css'
import { Link } from 'react-router-dom';

function studenthome() {
  return (
    <div>
        <h1>Student Home</h1>

        <Link to="/bookroom">
        <button>book room</button>
        </Link>

        <Link to="/foodvendor">
            <button>food vendor</button>
        </Link>
        
        <Link to="/student/laundry">
            <button>londri services</button>
        </Link>

        <Link to="/student/cleaning">
            <button>cleaning staff</button>
        </Link>

        <Link to="/complaints">
            <button>complaints</button>
        </Link>

    </div>

  )
}

export default studenthome
