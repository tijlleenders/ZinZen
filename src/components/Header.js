import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {

    return (
        <div className="navbar-custom">
            <nav className="navbar-custom navbar navbar-expand-sm navbar-light ">
                <div className="mx-auto d-sm-flex d-block flex-sm-nowrap">

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse text-center" id="navbarsExample11">
                        <ul className="navbar-nav">
                            <li></li>
                            <li className="nav-item active">
                                <a className="nav-link" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Discover</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="#">Donate</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header
