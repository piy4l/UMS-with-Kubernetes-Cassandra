import React, { useEffect,  useState } from 'react'
import '../assets/css/ApplyScholarship.css'
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


const ApplyScholarship= () => {

    const url = "http://localhost:5023/scholarship/apply_scholarship"; 

    let navigate = useNavigate(); 
    const query = new URLSearchParams(useLocation().search);

    const routeChangeToProfile = () =>{ 
        const url = `../student/single_apply_scholarship?name=${data.scholarship_name}&student_id=${data.student_id}&session=${data.session_id}`;
        navigate(url);
    }

    const [data, setData] = useState({
        scholarship_name: query.get("name"),
        student_id: localStorage.getItem("username"),
        session_id: 0,
        level_term: "0-0"
    });







    function handle(e){
        const newData = {...data};
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    function submit(e){
        e.preventDefault();

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
        <Sidebar />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Apply Scholarship 
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>

                    
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Scholarship name</Form.Label>
                                <Form.Control type="text" id="scholarship_name" defaultValue={data.scholarship_name} onChange={(e)=> handle(e)} />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={data.student_id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Session id</Form.Label>
                                <Form.Control type="text" id="session_id" defaultValue={data.session_id} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Level-term</Form.Label>
                                <Form.Control type="text" id="level_term" defaultValue={data.level_term} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>

                        <Row>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary" type="submit">
                                <a href={`single_scholarship?name=${data.scholarship_name}`} style={{color:'white'}}>Go Back</a>
                            </Button>
                        </Row>
                        </Form>

                    </div>
                </div>


        </div>
        </div>
    )
}

export default ApplyScholarship