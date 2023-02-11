import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarMedicalAdmin from '../../../../components/layout/SidebarMedicalAdmin';

export default function MedicalAppRequest() {
    const [backendData, setBackendData] = useState("")
    const [id, setId] = useState("")
    const [status, setStatus] = useState("")
    useEffect(() => {
        fetch("http://localhost:5010/get_appointment_pending").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])
    let navigate = useNavigate(); 
    const routeChangeToAppRequests= () =>{ 
        alert("Appointment Status Updated! You can preview this in History");
        navigate('/medical/app_request');
    }
    const update_status= (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5010/update_status", {
            id: id,
            status: status
        }).then((response) => {
            console.log(response)
            
            routeChangeToAppRequests();
        });
    }
    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           <SidebarMedicalAdmin/>
            <div class="jumbotron">
                <h1 class="display-4" align="center">Appointment Request List</h1>
                
                <hr class="my-4" />
                <p align="center">Edit Appointment Status</p>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Student ID</th>
                    <th scope="col">Doctor</th>
                    <th scope="col">Date</th>
                    <th scope="col">Current Status</th>
                    </tr>
                </thead>
                <tbody>
                   
                   {
                    (typeof backendData.results === 'undefined') ? (
                        <p>No pending request</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td>{result.student_id}</td>
                        <td>{result.doctor_name}</td>
                        <td>{result.date}</td>
                        <td>{result.status}</td>
                        <td><a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ e => {setId(result.id); setStatus('approved'); update_status(e) }}>Approve</a></td>
                        <td><a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ e => {setId(result.id); setStatus('declined'); update_status(e) }}>Decline</a></td>
                        </tr>
                    )
                    )
                    )
                    } 
                </tbody>
                </table>
                <a class="btn btn-primary btn-lg" align="center" href="http://localhost:3000/medical/app_request_history" role="button">History</a>
        </div>
    )
}
