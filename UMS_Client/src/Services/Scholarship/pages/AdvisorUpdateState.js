import React, { useEffect,  useState } from 'react'
import '../assets/css/UpdateState.css'
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
import SideBarAdvisor from '../../../components/layout/SideBarAdvisor';


const AdvisorUpdateState= () => {

    const query = new URLSearchParams(useLocation().search);
    const schol_name = query.get("name");
    const std_id = query.get("student_id");
    const applied_id = query.get("applied_id");
    const sess = query.get("session_id");

    const url = "http://localhost:5023/scholarship/update_apply_state"; 

    let navigate = useNavigate(); 

    const routeChangeToProfile = () =>{ 
        const url = `../advisor/single_apply_scholarship?name=${schol_name}&student_id=${std_id}&session=${sess}`;
        navigate(url);
    }

    const [data, setData] = useState({
        student_id: std_id,
        session_id: sess,
        applied_id: applied_id,
        state: "",
        updated_by: ""
    });





    function handle(e){
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData);
    }

    function submit(e){
        e.preventDefault();
        console.log("Ekhon submit dibe!");
        console.log("Data ", data);
        
        Axios.post(url, data)
        .then(res=>{
            if(res.data.status == "success") {
                routeChangeToProfile();
            }
            else{
                alert('Data is invaild');
            } 
        })
    }

    

    return (
        <div>
        <SideBarAdvisor />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Add Scholarship State
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>

                    
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Scholarship Name</Form.Label>
                                <Form.Control type="text" id="name" defaultValue={schol_name}  disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={data.student_id}  disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Session Id</Form.Label>
                                <Form.Control type="text" id="session_id" defaultValue={data.session_id} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Applied Id</Form.Label>
                                <Form.Control type="text" id="applied_id" defaultValue={data.applied_id} disabled/>
                            </Form.Group> 
                        </Row>
                        
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>New State</Form.Label>
                                <Form.Control type="text" id="state" defaultValue={data.state} onChange={(e)=> handle(e)}/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Updated By</Form.Label>
                                <Form.Control type="text" id="updated_by" defaultValue={data.updated_by} onChange={(e)=> handle(e)}/>
                            </Form.Group> 
                        </Row>

                        <Row>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Row>
                        </Form>

                    </div>
                </div>


        </div>
        </div>
    )
}

export default AdvisorUpdateState