import React, { useEffect,  useState } from 'react'
import '../assets/css/SingleAppliedScholarship.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';
import SidebarHead from '../../../components/layout/SideBarHead';


const HeadSingleAppliedScholarship= () => {

    const query = new URLSearchParams(useLocation().search);
    const schol_name = query.get("name");
    const std_id = query.get("student_id");
    const sess = query.get("session");
    
    const url = "http://localhost:5023/scholarship/applied_scholarship?session="+sess+"&student_id="+std_id+"&name="+schol_name;

    const [backendData, setBackendData] = useState([]);

    const [data, setData] = useState({
        scholarship_name: schol_name,
        student_id: std_id,
        session_id: sess,
        level_term: "0-0",
        id: "",
        amount: 0.0,
        current_state: {},
        issue_time: "",
        scholarship_id: "",
        states: []
    });


    useEffect(() => {
        const getData = async () =>{
          const dataFromServer = await fetchScholarship();

          setBackendData([dataFromServer]);
          setData(dataFromServer);
        }
    
        getData();
    }, [])
    
    const fetchScholarship = async () =>{
      const res = await fetch(url);
      const data = await res.json()
      
      return data.data;
    }





    function handle(e){
    }
    

    return (
        <div>
        <SidebarHead />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Applied Scholarship 
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>

                    { backendData.map(scholarship => {
                            return(
                    <Form >

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Scholarship name</Form.Label>
                                <Form.Control type="text" id="scholarship_name" defaultValue={scholarship.scholarship_name} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={scholarship.student_id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Session Id</Form.Label>
                                <Form.Control type="text" id="session_id" defaultValue={scholarship.session_id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={scholarship.amount} onChange={(e)=> handle(e)} 
                                    disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Creation Date</Form.Label>
                                <Form.Control type="date" id="issue_time" defaultValue={scholarship.issue_time.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>  
                        </Row>

                        <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Current State Location</Form.Label>
                                        <Form.Control type="text" id="tr_id" defaultValue={scholarship.current_state.location} onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group> 
                                    <Form.Group as={Col} controlId="formGridPassword">
                                        <Form.Label>Updated By</Form.Label>
                                        <Form.Control id="tr_card" defaultValue={scholarship.current_state.updated_by}  onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" id="tr_date" defaultValue={scholarship.current_state.update_time.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group> 
                                    {
                                        scholarship.current_state.location == 'Accepted' ?

                                        <Form.Group as={Col} controlId="formGridAddress1">
                                            <Form.Label>Payment Id</Form.Label>
                                            <Form.Control type="text" id="payment" defaultValue={scholarship.current_state.payment} onChange={(e)=> handle(e)} disabled/>
                                        </Form.Group> 
                                        :
                                        <p></p>
                                    }
                        </Row>

                        <Row>
                            <Button variant="primary">
                                <a href={`scholarship_state_list?type=single&applied_id=${data.id}&session=${sess}&student_id=${std_id}&name=${schol_name}`} style={{color:'white'}}>All States</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            {
                                scholarship.current_state.location == 'Hall' ?
                                    <Button variant="primary">
                                        <a href={`update_scholarship_state?student_id=${std_id}&session_id=${sess}&applied_id=${data.id}&name=${schol_name}`} style={{color:'white'}}>Update State</a>
                                    </Button>
                                    :   <p></p>
                            }
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href={`applied_scholarship_list?name=${schol_name}`} style={{color:'white'}}>Applied Scholarship List</a>
                            </Button>
                        </Row>
                        </Form>



                            )
                    })}
                    </div>
                </div>


        </div>
        </div>
    )
}

export default HeadSingleAppliedScholarship