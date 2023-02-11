import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import Sidebar from '../../../../components/layout/Sidebar';

export default function MedicalAppRequest() {
    const [backendData, setBackendData] = useState([])
    const [id, setId] = useState("")
    const [status, setStatus] = useState("")
    const [username, setUsername] = useState("");

        // //const [items, setItems] = useState("");

        // useEffect(() => {
            
        
        // }, []);
    
    useEffect(() => {
        
        const fetchData = async () => {
            const name= localStorage.getItem('username');
            setUsername(name);
            console.log("username: ", username);
            console.log("items: ", name);
            console.log("elam ekhane")
            await fetch("http://localhost:5010/get_appointment_history_student?logged_in="+name).then(
            response => response.json()
            ).then(
            data => {
                setBackendData(data)
                console.log("data: ", data)
            }
            )
          }
          
          // call the function
          fetchData();
    }, [])
    let navigate = useNavigate(); 
    const routeChangeToAppRequests= () =>{ 
        navigate('/medical/app_request');
    }
    const update_status= (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5010/update_status", {
            id: id,
            status: status
        }).then((response) => {
            console.log(response)
            alert("Appointment Status Updated! You can preview this in History");
            routeChangeToAppRequests();
        });
    }
    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           <Sidebar/>
            <div class="jumbotron">
                <h1 class="display-4" align="center">Appointment History List</h1>
                
                <hr class="my-4" />
                <p align="center">Appointment Status</p>
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
                        <p>No history to show</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td>{result.student_id}</td>
                        <td>{result.doctor_name}</td>
                        <td>{result.date}</td>
                        <td>{result.status}</td>
                        </tr>
                    )
                    )
                    )
                    } 
                </tbody>
                </table>
        </div>
    )
}
