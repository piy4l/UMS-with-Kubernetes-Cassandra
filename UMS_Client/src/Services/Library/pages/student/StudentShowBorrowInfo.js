import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import { logged_in } from '../../../../App';
import Sidebar from '../../../../components/layout/Sidebar';

export default function AdminShowBorrowInfo() {
    const [backendData, setBackendData] = useState("")
    const [status, setStatus] = useState("")
    const [username, setUsername] = useState("");

    useEffect(() => {
        const name= localStorage.getItem('username');
        setUsername(name);
        console.log("username: ", username);
        console.log("items: ", name);
        fetch("http://localhost:5009/get_student_borrowed_books?logged_in="+name).then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])

    
    

    return (    
        <div className="container rounded bg-white mt-5 mb-5">
            <Sidebar />
            <div class="jumbotron">
                <h1 class="display-4" align="center">Books Borrow List</h1>
                
                <hr class="my-4" />
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Student ID</th>
                    <th scope="col">Book Name</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Is Returned?</th>
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
                        <td>{result.book_name}</td>
                        <td>{result.due_date}</td>
                        <td><input type="checkbox" checked={result.is_returned} /></td>
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
