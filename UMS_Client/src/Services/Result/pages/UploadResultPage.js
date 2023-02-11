import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SideBarTeacher from '../../../components/layout/SideBarTeacher';
import Button from 'react-bootstrap/esm/Button';


export default function UploadResultPage() {
    const [sessionsDepts, setSessionsDepts] = useState([{

    }])
    const [courses, setCourses] = useState([])
    useEffect(() => {
        console.log("use effect e dhuksi")
        fetch("http://localhost:5004/get_sessions_depts").then(
        response => response.json()
        ).then(
        data => {
            console.log("use effect e dhuksi", data)
            setSessionsDepts(data);
        }
        )
    }, [])  
    let session = 0;

    const get_courses= () => {
        session = document.getElementById("session").value;
        const teacher_id = localStorage.getItem("username");
        let str = "http://localhost:5004/get_courses?session_id=" + session + "&teacher_id=" + teacher_id; 
        fetch(str).then(
            response => response.json()
            ).then(
            data => {
                console.log("use effect e dhuksi", data)
                setCourses(data);
            }
            )
    }

    


      //for showing csv file
      
        const [file, setFile] = useState();
        const [array, setArray] = useState([]);
        const [course, setCourse] = useState([]);
        
      
        const fileReader = new FileReader();
      
        const handleOnChange = (e) => {
          setFile(e.target.files[0]);
        };
      
        const csvFileToArray = string => {
          const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
          const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
      
          const array = csvRows.map(i => {
            const values = i.split(",");
            const obj = csvHeader.reduce((object, header, index) => {
              object[header] = values[index];
              return object;
            }, {});
            return obj;
          });
      
          setArray(array);
          console.log("array :     ")
          console.log(array);
        };
      
        const handleOnSubmit = (e) => {
          e.preventDefault();
      
          if (file) {
            fileReader.onload = function (event) {
              const text = event.target.result;
              csvFileToArray(text);
            };
      
            fileReader.readAsText(file);
          }
        };
      
        const headerKeys = Object.keys(Object.assign({}, ...array));

        let navigate = useNavigate(); 
        const routeChangeToUploadResult= () =>{ 
            navigate('/teacher/upload_result');
        }
        const send_csv_file = (e) => {
            e.preventDefault();
            Axios.post("http://localhost:5004/result_file", {
                data: array,
                course: course,
                session: sessionsDepts.sessions[0].id,
            }).then((response) => {
                alert("Result Uploaded!");
                routeChangeToUploadResult();
            });
        }


    return (    
        <div className="container rounded bg-white mt-5 mb-5">
            <SideBarTeacher />
            <div class="jumbotron">
                <h1 class="display-4" align="center">Upload Result</h1>
                <p class="lead">Session : <select id="session" name="level" onChange={ get_courses } class="btn btn-secondary dropdown-toggle">
                    <option selected>Select Session</option>
                    {
                    (typeof sessionsDepts.sessions === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    sessionsDepts.sessions.map((result, i) => (  
                        <option value={result.id}>{result.label}</option> 
                    )
                    )
                    )
                };
                </select><br/><br/>
                                
                                Course : <select name="level" class="btn btn-secondary dropdown-toggle" onChange={e => setCourse(e.target.value)}>
                    <option selected>Select Course</option>
                    {
                    (typeof courses.courses === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    courses.courses.map((result, i) => (  
                        <option value={result.offercourseid}>{result.course_title}</option> 
                    )
                    )
                    )
                };
                </select>
                </p>
                <hr class="my-4" />
                   
               
                    {/* <div class="custom-file">
                        <input type="file" class="custom-file-input" id="customFile" />
                        <label class="custom-file-label" for="customFile">Choose file</label>
                    </div> */}

                <div style={{ textAlign: "center" }}>
                    <form>
                        <input
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleOnChange}
                        />

                        <button
                        onClick={(e) => {
                            handleOnSubmit(e);
                        }}
                        >
                        IMPORT CSV
                        </button>
                    </form>

                    <br />

                    <table>
                        <thead>
                        <tr key={"header"}>
                            {headerKeys.map((key) => (
                            <th>{key}</th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {array.map((item) => (
                            <tr key={item.id}>
                            {Object.values(item).map((val) => (
                                <td>{val}</td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>


                <br/> <br/>
                <Button onClick={(e) => send_csv_file(e) }>Upload Result</Button>
            </div>
        </div>
    )
}
