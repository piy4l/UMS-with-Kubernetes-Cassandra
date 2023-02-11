import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import Sidebar from '../../../components/layout/Sidebar';
import Button from 'react-bootstrap/esm/Button';

export default function ViewGradesPage() {
    const [result, setResult] = useState([])
    const [level, setLevel] = useState([]);
    const [term, setTerm] = useState([]);
    const [cgpa, setCgpa] = useState(0.0);
    //const student_id = '1705031'
    
    
    function getResult(){
        const student_id = localStorage.getItem("username");
        const url = "http://localhost:5004/getresult?student_id=" + student_id + "&level=" + level + "&term=" + term;
        Axios.get(url)
        .then(res=>{
            setResult(res.data.data);
            setCgpa(res.data.cgpa);
        })
    }
    
    return (    
        <div className="container rounded bg-white mt-5 mb-5">
            <Sidebar />
            <div class="jumbotron">
                <h1 class="display-4" align="center">Result</h1>
                <hr class="my-4" />
                <p>     
                Level : <select name="level" onChange={e => setLevel(e.target.value)} class="btn btn-secondary dropdown-toggle">
                    <option selected>Select Level</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                <br/> <br/>
                Term : <select name="term" onChange={e => setTerm(e.target.value)} class="btn btn-secondary dropdown-toggle">
                    <option selected>Select Term</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
                </p>
                <Button onClick={getResult}>View Result</Button>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Course Title</th>
                    <th scope="col">Course lable</th>
                    <th scope="col">Credit hours</th>
                    <th scope="col">Grades</th>
                    <th scope="col">GPA</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((course)=>(
                        <tr>
                            <th scope="row">{course.course_title}</th>
                            <td>{course.course_label}</td>
                            <td>{course.credit}</td>
                            <td>{course.gradepoint}</td>
                            <td>{course.gpa}</td>
                        </tr>
                    ))}
                    

                </tbody>
                </table>
                <h6>Total GPA : {cgpa}</h6>
        </div>
    )
}
