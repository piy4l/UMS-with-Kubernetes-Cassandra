import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';

export default function AdminShowBooksEdit() {
    const [backendData, setBackendData] = useState("")
    const [id, setId] = useState("")
    const [quantity, setQuantity] = useState("")
    useEffect(() => {
        fetch("http://localhost:5009/get_books").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])
    
    let navigate = useNavigate(); 
        const routeChangeToAdminShowBooks= () =>{ 
            alert("Books Updated!");
            navigate('/library/admin_show_books');
        }

    const update_books= (e) => {
        e.preventDefault();
        console.log('id : ', id);
        console.log('quantity : ', quantity)
        Axios.post("http://localhost:5009/update_books", {
            id: id,
            quantity: quantity,
        }).then((response) => {
            
        });
    }

    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           
            <div class="jumbotron">
                <h1 class="display-4" align="center">Books List</h1>
                
                <hr class="my-4" />
                <p align="center">Edit Book Quantity</p>
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
                        <td><input id="name" type="text" class="form-control" defaultValue={result.quantity} onChange={ e => {setQuantity(e.target.value) }} /></td>
                        <td><a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ e => {setId(result.id); update_books(e) }}>Change</a></td>
                        </tr>
                        
                    )
                    )
                    )
                }  
                </tbody>
                </table>
                <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    
                }}
                >
                <a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ routeChangeToAdminShowBooks }>Update</a>
                </div>
                
        </div>
    )
}
