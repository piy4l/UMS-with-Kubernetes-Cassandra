import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarMedicalAdmin from '../../../../components/layout/SidebarMedicalAdmin';

export default function MedicalAdminShowScheduleEdit() {
    const [backendData, setBackendData] = useState("")
    const [id, setId] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [sat, setSat] = useState("")
    const [sun, setSun] = useState("")
    const [mon, setMon] = useState("")
    const [tue, setTue] = useState("")
    const [wed, setWed] = useState("")
    const [thu, setThu] = useState("")
    const [fri, setFri] = useState("")
    
    useEffect(() => {
        fetch("http://localhost:5010/get_schedule").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])

    const update_schedule= (e) => {
        e.preventDefault();
        Axios.post("http://localhost:5010/update_schedule", {
            id: id,
            specialization: specialization,
            sat: sat,
            sun: sun,
            mon: mon,
            tue: tue,
            wed: wed,
            thu: thu,
            fri: fri,
        }).then((response) => {
            console.log(response)
        });
    }

    
    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           <SidebarMedicalAdmin/>
            <div class="jumbotron">
                <h1 class="display-4" align="center">Schedule of Doctors</h1>
                
                <hr class="my-4" />
                <p align="center">List according to time period</p>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Doctor Name</th>
                    <th scope="col">Specialization</th>
                    <th scope="col">Sat</th>
                    <th scope="col">Sun</th>
                    <th scope="col">Mon</th>
                    <th scope="col">Tue</th>
                    <th scope="col">Wed</th>
                    <th scope="col">Thu</th>
                    <th scope="col">Fri</th>
                    </tr>
                </thead>
                <tbody>
                {
                    (typeof backendData.results === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td><input type="id" class="form-control" id="id" value={result.name}/></td>
                        
                        <td><input type="id" class="form-control" id="id" defaultValue={result.specialization} onChange={ e => {setSpecialization(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.sat} onChange={ e => {setSat(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.sun} onChange={ e => {setSun(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.mon} onChange={ e => {setMon(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.tue} onChange={ e => {setTue(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.wed} onChange={ e => {setWed(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.thu} onChange={ e => {setThu(e.target.value)} }/></td>
                        <td><input type="id" class="form-control" id="id" defaultValue={result.fri} onChange={ e => {setFri(e.target.value)} }/></td>
                        <td><a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ e => {setId(result.id); update_schedule(e) }}>Update</a></td>
                        </tr>
                        
                    )
                    )
                    )
                    }                 
                </tbody>
                </table>
                <a class="btn btn-primary btn-lg" align="center" href="http://localhost:3000/medical/admin_home" role="button">Done</a>
        </div>
    )
}
