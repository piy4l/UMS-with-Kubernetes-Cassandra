import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import Sidebar from '../../../../components/layout/Sidebar';
export default function StudentHome() {

    return (    
        <div className="def">
            <Sidebar/>
            <div class="jumbotron">
                <h3 align="center">Medical Student Homepage</h3><br/>
            <div class="row">
            <div class="column">
                <div class="card"><Link to="/medical/student_app">Book an Appointment</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/medical/student_show_schedule">Show Schedule</Link></div>
            </div>
            <br/> <br/>
            <div class="column2">
                <div class="card"><Link to="/medical/student_app_history">Show Appointment History</Link></div>
            </div>
            </div>
            </div>
        </div>
    )
}
