import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';

export default function AdminShowBorrowInfoHistory() {
    const [backendData, setBackendData] = useState("")
    useEffect(() => {
        fetch("http://localhost:5009/get_borrowed_books").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])
    

    return (    
        <div className="container rounded bg-white mt-5 mb-5">
            <SidebarLibraryAdmin/>
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
