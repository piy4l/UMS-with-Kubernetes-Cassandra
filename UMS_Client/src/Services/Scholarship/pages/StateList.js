import React, { useEffect,  useState } from 'react'
import '../assets/css/StateList.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useLocation, useParams, Link } from "react-router-dom";
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';


const StateList = () => {

    const query = new URLSearchParams(useLocation().search);
    const applied_id = query.get("applied_id");
    const schol_name = query.get("name");
    const std_id = query.get("student_id");
    const sess = query.get("session");

    const url = "http://localhost:5023/scholarship/scholarship_state_list?type=single&applied_id="+applied_id; 
    
    const [backendData, setBackendData] = useState([]);
    const [isDone, setDone] = useState(false);
    
    useEffect(() => {
        const getData = async () =>{
          const scholarship_list = await fetchList(url)
          
          setBackendData(scholarship_list)
          
          for(let i=0; i<scholarship_list.length; i++){
            if(scholarship_list[i].location == 'Rejected' || scholarship_list[i].location == 'Accepted'){
                setDone(true);
                break;
            }
          }            
        }
    
        getData();
    }, [])
    
    const fetchList = async (url) =>{
      const res = await fetch(url);
      const data = await res.json()
      return data.data;
    }


    const sortData = function(type){
        let d;
        if(type == "up") d = 1;
        else d = -1;

        let ff = function(a, b){
            if(a.date > b.date) return d;
            else if(a.date < b.date) return -d;
            else return 0;
        }

        const temp = [...backendData];
        temp.sort(ff);
        setBackendData(temp);
    }  


    return (
        <div>
        <SidebarFinancialAdmin />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Scholarship List
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    <div className='scholarshipDetailsTitle'>
                        <br />
                        <span>&nbsp; &nbsp;</span>
                        <Button variant="primary" onClick={(e)=> sortData("up")}>
                            Sort &uarr;
                        </Button>
                        <span>&nbsp; &nbsp;</span>
                        
                        <Button variant="primary" onClick={(e)=> sortData("down")}>
                            Sort &darr;
                        </Button>
                        
                        <span>&nbsp; &nbsp;</span>
                        <Button variant="primary">
                            <a href={`single_apply_scholarship?name=${schol_name}&student_id=${std_id}&session=${sess}`} style={{color:'white'}}>Go Back</a>
                        </Button>
                        
                        <span>&nbsp; &nbsp;</span>
                        {
                            isDone == false ?
                                <Button variant="primary">   
                                    <a href={`update_scholarship_state?student_id=${std_id}&session_id=${sess}&applied_id=${applied_id}&name=${schol_name}`} style={{color:'white'}}>Add State</a>
                                </Button>
                            :   <p></p>
                        }
                    </div>
                    <div className='detailsForm'>
                    
                        { backendData.map(state => {
                            return(
                                <Card className='singleCourseNew' style={{marginBottom:'20px'}}>
                                <Card.Body className='cardBodyChange'>
                                    <Card.Title>{state.location}</Card.Title>
                                    <Card.Text>
                                        <p>Updated by: {state.updated_by}</p>
                                        <p>Id: {state.id}</p>
                                        <p>Applied Scholarship Id: {state.applied_scholarship_id}</p>
                                        <p>Update Date: {state.date}</p>
                                        {
                                            state.location == 'Accepted' ?
                                            <p>
                                                Payment Id: <a href={`singlepayment?student_id=${std_id}&id=${state.payment}`}> {state.payment}</a>
                        
                                            </p>
                                            :   <p></p>
                                        }
                                    </Card.Text>
                                </Card.Body>
                                </Card>
                            )
                        })}       
                    </div>
                </div>


        </div>
        </div>
    )
}

export default StateList