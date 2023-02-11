import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';
export default function AdminHome() {

    return (    
        <div className="def">
            <SidebarLibraryAdmin/>
            <div class="jumbotron">
                <h3 align="center">Library Admin Homepage</h3><br/>
            <div class="row">
            <div class="column">
                <div class="card"><Link to="/library/add_book">Add Book</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/library/grant_book">Grant Book</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/library/admin_show_books">Show Books</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/library/admin_show_borrow_info">Show Borrow Info</Link></div>
            </div>
            </div>
            </div>
        </div>
    )
}
