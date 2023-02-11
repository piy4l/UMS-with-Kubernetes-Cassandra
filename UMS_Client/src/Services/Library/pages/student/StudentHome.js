import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/default.css';
import Sidebar from '../../../../components/layout/Sidebar';

export default function StudentHome() {

    return (    
        <div className="def">
            <Sidebar />
            <div class="jumbotron">
                <h3 align="center">Library Home</h3><br/>
            <div class="row">
            <div class="column">
                <div class="card"><Link to="/library/student_show_books">Show Books</Link></div>
            </div>
            <div class="column">
                <div class="card"><Link to="/library/student_show_borrow_info ">Show Borrow History</Link></div>
            </div>
            </div>
            </div>
        </div>
    )
}
