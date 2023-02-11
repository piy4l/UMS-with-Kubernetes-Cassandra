import React, { useState } from 'react'
import '../assets/css/AddCourse.css'
import Sidebar from '../../../components/layout/SideBarHead'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarHead from '../../../components/layout/SideBarHead';


const AddCourse = () => {

    const url = "http://localhost:5002/head/addcourse"

    let navigate = useNavigate(); 
    const routeChangeToProfile = (course_id) =>{ 
        console.log("course_id: ", course_id);
        const url = `singlecourse/${course_id}`;
        console.log("url: ", url);  
        navigate('/head/courselist');
    }

    const [data, setData] = useState({
        deptName: "",
        courseName: "",
        courseID: "",
        creditHour: "",
        level: "",
        term: "",
        type: "",
    });

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            deptName: data.deptName,
            courseName: data.courseName,
            courseID: data.courseID,
            creditHour: data.creditHour,
            level: data.level,
            term: data.term,
            type: data.type
        })
        .then(res=>{
            if(res.data.status == "yes") routeChangeToProfile(res.data.course_id);
            else{
                alert('Data is invaild');
            }
        })
    }

    function handle(e){
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
        console.log(newData)
    }


    return (
        <div>
        <SidebarHead />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Add New Course
            </div>
        </div>
        <div className='rightSideAddCourse'>
                

                <div className='courseDetailsAddCourse'>
                    <div className='courseDetailsTitleAddCourse'>
                        Course Details
                    </div>
                    <div className='detailsForm'>
                        <Form onSubmit={(e)=> submit(e)}>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                                    <Form.Label className="selectLabelMargin">Department Name</Form.Label>
                                    <Form.Select className="formSelect" id="deptName" onChange={(e)=> handle(e)} defaultValue="Choose...">
                                        <option>Choose...</option>
                                        <option value="CSE">CSE</option>
                                        <option value="ME">ME</option>
                                        <option value="EEE">EEE</option>
                                        <option value="MME">MME</option>
                                        <option value="CE">CE</option>
                                        <option value="IPE">IPE</option>
                                        <option value="ChE">ChE</option>
                                        <option value="URP">URP</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                <Form.Label>Course Name</Form.Label>
                                <Form.Control type="text" id="courseName" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                
                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridPassword">
                                <Form.Label>Course ID</Form.Label>
                                <Form.Control id="courseID" placeholder=""  onChange={(e)=> handle(e)} />
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                                    <Form.Label>Credit Hour</Form.Label>
                                    <Form.Control type="text" id="creditHour" placeholder="" onChange={(e)=> handle(e)}/>
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress2">
                                    <Form.Label>Level</Form.Label>
                                    <Form.Control type="text" id="level" placeholder=""  onChange={(e)=> handle(e)} />
                                </Form.Group>
                                
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridCity">
                                    <Form.Label>Term</Form.Label>
                                    <Form.Control type="text" id="term" placeholder=""  onChange={(e)=> handle(e)} />
                                </Form.Group>
                            </Row>
                            

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                                <Form.Label className="selectLabelMargin">Type</Form.Label>
                                <Form.Select className="formSelect" id="type" onChange={(e)=> handle(e)} defaultValue="Choose...">
                                    <option>Choose...</option>
                                    <option>Theory</option>
                                    <option>Sessional</option>
                                </Form.Select>
                                </Form.Group>

                            </Row>

                            <Button className="submitButton"variant="primary" type="submit">
                                Submit
                            </Button>
                            </Form>
                    
                    
                    
                    </div>
                </div>


        </div>
        </div>
    )
}

export default AddCourse