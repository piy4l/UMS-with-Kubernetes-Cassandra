import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import TextField from '@material-ui/core/TextField';
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';

export default function GrantBook() {
    const [student_id, setStudentId] = useState([]);
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

    let navigate = useNavigate(); 
    const routeChangeToGrantBook= () =>{ 
        navigate('/library/grant_book');
    }
    const grant_book = (e) => {
        e.preventDefault();
        const book_name = document.getElementById("book").value;
        const date = document.getElementById("date").value;
        Axios.post("http://localhost:5009/grant_book", {
            book_name: book_name,
            student_id: student_id,
            date: date,
        }).then((response) => {
            console.log(response)
            if(response.data == "Limit reached")
                alert("Limit Reached!");
            else if(response.data == "No book available")
                alert("No book  available!"); 
            else
                alert("Book Granted!");
            routeChangeToGrantBook();
        });
    }
    return (    
        <div>
            <SidebarLibraryAdmin/>
            <div class="jumbotron text-center" id="jumbotron">
                <h1 class="display-3">Grant Book</h1>
                <p class="lead">Book Description</p>
                <hr class="my-y-2"/>
                <p>Please give the following info</p>
                <form>
                <div class="form-group">
                    <label for="book">Book : </label>
                    <select id="book" name="book" class="btn btn-secondary dropdown-toggle">
                        <option selected>Select Book</option>
                        {
                        (typeof backendData.results === 'undefined') ? (
                            <p>loading...</p>
                        ) : (
                            backendData.results.map((result, i) => (  
                            <option value={result.name}>{result.name}</option> 
                        )
                        )
                        )
                        };
                    </select>
                    <small id="emailHelp" class="form-text text-muted">Select the book name you want to grant</small>
                </div>
                <div class="form-group box">
                    <label for="student id">Student ID</label>
                    <input type="name" class="form-control" id="student_id" placeholder="Student ID" onChange={e => setStudentId(e.target.value)}/>
                </div>
                <div style={{
                margin: 'auto',
                display: 'block',
                width: 'fit-content'
                }}>
                    <label>Choose due date</label><br/>
                <TextField
                    id="date"
                    
                    type="date"
                    defaultValue="2023-01-01"
                    InputLabelProps={{
                    shrink: true,
                    }}
                />          
                </div>
                    <br/>
                    <button type="submit" class="btn btn-primary mb-2" onClick={ e => grant_book(e) }>Grant</button>
                </form>
            </div>
        </div>
    )
}
