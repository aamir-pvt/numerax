import React from "react"
import { Link } from 'react-router-dom';


function Navbar(){

    return(
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Link to="/" className="navbar-brand">Stock Screener</Link>
        <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          
        </ul>
        </div>
      </nav>
    )
}

export default Navbar;