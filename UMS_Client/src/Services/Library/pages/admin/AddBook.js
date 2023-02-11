import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';

export default function AddBook() {
    const [book_name, setBookName] = useState([]);
    const [author_name, setAuthorName] = useState([]);
    const [quantity, setQuantity] = useState([]);

    let navigate = useNavigate(); 
    const routeChangeToAddBook= () =>{ 
        navigate('/library/add_book');
    }
    const save_book = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5009/save_book", {
            book_name: book_name,
            author_name: author_name,
            quantity: quantity,
        }).then((response) => {
            console.log(response)
            alert("Book Added!");
            routeChangeToAddBook();
        });
    }

    return (    
        <div className="def">
            <SidebarLibraryAdmin/>
            <div class="jumbotron text-center box" id="jumbotron">
                <h1 class="display-3">Add Book</h1>
                <p class="lead">Book Description</p>
                <hr class="my-y-2"/>
                <p>Please give the following info</p>
                <form class="justify-content-center">
                    <label>Book Name: </label>
                    <input type="name" class="form-control" id="name" placeholder="Book Name" onChange={e => setBookName(e.target.value)}/><br/>
                    <label>Author Name: </label>
                    <input type="name" class="form-control" id="author" placeholder="Author"onChange={e => setAuthorName(e.target.value)}/><br/>
                    <label>Quantity: </label>
                    <input type="name" class="form-control" id="quantity" placeholder="Quantity"onChange={e => setQuantity(e.target.value)}/><br/>
                     
                    <button type="submit" class="btn btn-primary mb-2" onClick={ e => save_book(e) }>Add</button>
                </form>
            </div>
        </div>
    )
}
