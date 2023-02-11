import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
// import '../../assets/css/AdminHome.css';
// import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';


export default function FinancialDashboard() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const name= localStorage.getItem('username');
        setUsername(name);
        //console.log("username: ", username);
        //console.log("items: ", name);
    
    }, []);

    return (    
        <div className="def">
            <SidebarFinancialAdmin/>
            <div class="jumbotron">
                <h3 align="center">Welcome, {username}</h3><br/>
            {/* <div class="row">
            <div class="column">
                <div class="card"><Link to="/add_book">Add Book</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/grant_book">Grant Book</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/admin_show_books">Show Books</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/admin_show_borrow_info">Show Borrow Info</Link></div>
            </div>
            </div> */}
            </div>
        </div>
    )
}
