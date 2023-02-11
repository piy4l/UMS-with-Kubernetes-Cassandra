import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/AdminHome.css';
import TextField from '@material-ui/core/TextField';
import Sidebar from '../../../../components/layout/Sidebar';

export default function MedicalStudentApp() {
    //let location = useLocation();
    //let student_id = location.state.username;
    const [backendData, setBackendData] = useState("")
    const [doctor_name, setDoctorName] = useState("")

    
    const [date, setDate] = useState("")
    const [username, setUsername] = useState("");

    //const [items, setItems] = useState("");

    useEffect(() => {
        const name= localStorage.getItem('username');
        setUsername(name);
        console.log("username: ", username);
        console.log("items: ", name);
    
    }, []);

    let navigate = useNavigate(); 
    const routeChangeToStudentHome= () =>{ 
        navigate('/medical/student_home');
    }
    useEffect(() => {
        fetch("http://localhost:5010/get_schedule").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])

    const set_appointment= (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5010/set_appointment", {
            doctor_name: doctor_name,
            student_id: username,
            date: date,
        }).then((response) => {
            console.log(response)
            alert("Appointment Confirmed!");
            routeChangeToStudentHome();
        });
    }

    return (    
        <div>
            <Sidebar/>
            <div class="jumbotron text-center" id="jumbotron">
                <h1 class="display-3">Book an Appointment</h1>
                <p class="lead">Schedule Description</p>
                <hr class="my-y-2"/>
                <p>Please give the following info</p>
                <form>
                <div class="form-group">
                <div style={{
                margin: 'auto',
                display: 'block',
                width: 'fit-content'
                }}>
                    <label>Choose Appointment Date</label><br/>
                <TextField
                    id="date"
                    
                    type="date"
                    defaultValue="2023-01-01"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={ e => {setDate(e.target.value)} }
                />          
                </div>
                <br/>
                </div>
                <label for="doctor">Doctors : </label>
                <select id="doctor" name="doctor" class="btn btn-secondary dropdown-toggle">
                    <option selected>Select Doctor</option>
                {
                    (typeof backendData.results === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        <option onClick={ e => {setDoctorName(result.name)} }>{result.name} ({result.specialization}) </option>
                        
                    )
                    )
                    )
                    }     
                    </select>
                
                    <br/> <br/>
                    <button type="submit" class="btn btn-primary mb-2" onClick={ e => set_appointment(e) }>Book</button>
                </form>
            </div>
        </div>
    )
}
