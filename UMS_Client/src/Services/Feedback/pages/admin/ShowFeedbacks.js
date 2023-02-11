import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarHead from '../../../../components/layout/SideBarHead';

export default function ShowFeedbacks() {
    const [backendData, setBackendData] = useState("")
    useEffect(() => {
        fetch("http://localhost:5013/get_feedbacks").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])
    

    return (
        <div> 
        <SidebarHead />
        <div className="container rounded bg-white mt-5 mb-5">
            
            <div class="jumbotron">
                <h1 class="display-4" align="center">Feedback List</h1>
                
                <hr class="my-4" />
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Student ID</th>
                    <th scope="col">Subject</th>
                    <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody>
                    

                    {
                    (typeof backendData.results === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td>{result.student_id}</td>
                        <td>{result.subject}</td>
                        <td>{result.description}</td>
                        </tr>
                        
                    )
                    )
                    )
                }  
                </tbody>
                </table>
        </div>
        </div>
    )
}
