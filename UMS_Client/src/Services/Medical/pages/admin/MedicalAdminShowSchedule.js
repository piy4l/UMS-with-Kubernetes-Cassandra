import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarMedicalAdmin from '../../../../components/layout/SidebarMedicalAdmin';

export default function MedicalAdminShowSchedule() {
    
    const [backendData, setBackendData] = useState("")
    useEffect(() => {
        fetch("http://localhost:5010/get_schedule").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])

    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           <SidebarMedicalAdmin/>
            <div class="jumbotron">
                <h1 class="display-4" align="center">Schedule of Doctors</h1>
                
                <hr class="my-4" />
                <p align="center">List according to time period</p>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Doctor Name</th>
                    <th scope="col">Specialization</th>
                    <th scope="col">Sat</th>
                    <th scope="col">Sun</th>
                    <th scope="col">Mon</th>
                    <th scope="col">Tue</th>
                    <th scope="col">Wed</th>
                    <th scope="col">Thu</th>
                    <th scope="col">Fri</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    (typeof backendData.results === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td>{result.name}</td>
                        <td>{result.specialization}</td>
                        <td>{result.sat}</td>
                        <td>{result.sun}</td>
                        <td>{result.mon}</td>
                        <td>{result.tue}</td>
                        <td>{result.wed}</td>
                        <td>{result.thu}</td>
                        <td>{result.fri}</td>
                        </tr>
                    )
                    )
                    )
                    }                    
                </tbody>
                </table>
                <a class="btn btn-primary btn-lg" align="center" href="http://localhost:3000/medical/admin_show_schedule_edit" role="button">Edit</a>
        </div>
    )
}
