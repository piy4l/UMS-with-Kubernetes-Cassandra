import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/default.css';
import Sidebar from '../../../../components/layout/Sidebar';

export default function UploadFeedback() {
    const [subject, setSubject] = useState([]);
    const [desc, setDesc] = useState([]);
    const student_id = '1705034'
    let navigate = useNavigate(); 
    const routeChangeToFeedback= () =>{ 
        navigate('/upload_feedback');
    }
    const upload_feedback = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5013/upload_feedback", {
            student_id: student_id,
            subject: subject,
            desc: desc,
        }).then((response) => {
            console.log(response)
            alert("Feedback Submitted!");
            routeChangeToFeedback();
        });
    }

    return (    
        <div className="def">
            <Sidebar/>
            <div class="jumbotron text-center" id="jumbotron">
                <h1 class="display-3">Feedback</h1>
                <p class="lead">Give your feedback here</p>
                <hr class="my-y-2"/>
                <p>Please give the following info</p>
                <form class="justify-content-center">
                    <label>Subject: </label>
                    <input type="name" class="form-control" id="subject" placeholder="Subject" onChange={e => setSubject(e.target.value)}/><br/>
                    <label>Description: </label>
                    <textarea  class="form-control" id="desc" name="textValue" placeholder="Description" onChange={e => setDesc(e.target.value)}/><br/>
                
                    <button type="submit" class="btn btn-primary mb-2" onClick={ e => upload_feedback(e) }>Submit</button>
                </form>
            </div>
        </div>
    )
}
