import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import SidebarMedicalAdmin from '../../../../components/layout/SidebarMedicalAdmin';
export default function MedicalAdminHome() {

    return (    
        <div className="def">
            <SidebarMedicalAdmin/>
            <div class="jumbotron">
                <h3 align="center">Medical Admin Homepage</h3><br/>
            <div class="row">
            <div class="column">
                <div class="card"><Link to="/medical/add_doctor">Add Doctor</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/medical/admin_show_schedule">Show Schedule</Link></div>
            </div>
            <br/>
            <div class="column2">
                <div class="card"><Link to="/medical/app_request">Show Appointment Requests</Link></div>
            </div>
            </div>
            </div>
        </div>
    )
}
