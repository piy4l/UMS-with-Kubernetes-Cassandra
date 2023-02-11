import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'

import Sidebar from '../../../components/layout/Sidebar';


export default function UploadResultPage() {
    const [data, setData] = useState([])
    useEffect(() => {
        console.log("use effect e dhuksi")
        fetch("http://localhost:5004/get_results").then(
        response => response.json()
        ).then(
        data => {
            console.log("use effect e dhuksi", data)
            setData(data);
        }
        )
    }, [])

   


    return (    
        <div>{
            (typeof data === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                        data.map((result, i) => (  
                        <div>
                        <table> 
                            <tr> 
                                <th> Student ID </th>
                                <th> Attendace </th>
                                <th> CT(best of 3)</th>
                                <th> Term final marks (210)</th>
                                <th> Final marks (100)</th>
                                <th> GPA </th>
                                <th> Grade </th>
                            </tr>
                            <tr>
                                <td>{result.student_id} </td>
                                <td>{result.attendance} </td>
                                <td>{result.ct} </td>
                                <td>{result.term_final_marks} </td>
                                <td>{result.final_marks} </td>
                                <td>{result.gpa} </td>
                                <td>{result.grade} </td>
                            </tr>
                        </table>
                        </div>
                    )
                     )
                    
                    )
                    
                    
                    

                };
        </div>
    )
}
