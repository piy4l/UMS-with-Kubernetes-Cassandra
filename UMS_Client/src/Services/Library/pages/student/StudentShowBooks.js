import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import Sidebar from '../../../../components/layout/Sidebar';

export default function StudentShowBooks() {
    const [backendData, setBackendData] = useState("")
    useEffect(() => {
        fetch("http://localhost:5009/get_books").then(
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
                <h1 class="display-4" align="center">Books List</h1>
                
                <hr class="my-4" />
                
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Book Name</th>
                    <th scope="col">Author</th>
                    <th scope="col">Quantity</th>
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
                        <td>{result.author}</td>
                        <td>{result.quantity}</td>
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
