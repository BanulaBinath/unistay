import React from 'react'
import './foodVendorcomplaint.css';
import { Link } from 'react-router-dom';

import ItemSidebar from '../foodvendor/itemsidebar'; 


function foodVendorcomplaint() {
  return (
    <div>
        <h1>Complaint</h1>  
        <ItemSidebar />
    </div>
  )
}

export default foodVendorcomplaint
