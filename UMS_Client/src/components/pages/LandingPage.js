import { Link } from 'react-router-dom'
import React, {useEffect, useState} from 'react'

import '../../App.css'
import BackgroundImage from '../../assets/images/bg.png'

export default function LandingPage() {
    const [backendData, setBackendData] = useState([{}])

    useEffect(() => {
        fetch("/api").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])

    
    return (
        <header style={ HeaderStyle }>
            {(typeof backendData.results === 'undefined') ? (
                <p>loading...</p>
            ) : (
                backendData.results.map((result, i) => (
                    <p key={i}>{result.student_id}</p>
                )
                )
            )
            } 
            
            <h1 className="main-title text-center">login / register page</h1>
            <p className="main-para text-center">join us now and don't waste time</p>
            <div className="buttons text-center">
                <Link to="/login">
                    <button className="primary-button">Log in</button>
                </Link>
                <Link to="/reg">
                    <button className="primary-button">Registration</button>
                </Link>
            </div>
        </header>
    )
}

const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}