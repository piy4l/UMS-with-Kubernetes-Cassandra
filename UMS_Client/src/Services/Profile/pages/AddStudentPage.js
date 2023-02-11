import React, { useEffect, useState } from 'react'
import '../assets/css/AddStudent.css'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AddCourse = () => {

    const url = "http://localhost:5015/admin/addStudent"

    const [startDate, setStartDate] = useState(new Date());
    const [loggedInName, setLoggedInName] = useState("");


    useEffect(() => {
        const name= localStorage.getItem('username');
        setLoggedInName(name);
        //console.log("username: ", username);
        //console.log("items: ", name);
    
    }, []);

    let navigate = useNavigate(); 
    const routeChangeToProfile = (course_id) =>{ 
        console.log("course_id: ", course_id);
        const url = `singlecourse/${course_id}`;
        console.log("url: ", url);  
        navigate('/courselist');
    }

    const [data, setData] = useState({
        name: "",
        phoneNumber: "",
        nid: "",
        gender: "",
        bcn: "",
        countryPre: "",
        districtPre: "",
        thanaPre: "",
        postOfficePre: "",
        addressPre: "",
        countryPar: "",
        districtPar: "",
        thanaPar: "",
        postOfficePar: "",
        addressPar: "",
        gmail: "",
        studentId: "",
        username: "",
        deptName: "",


    });

    function submit(e){
        e.preventDefault();
        console.log("date formaat: ", startDate);
        console.log("type of date: ", typeof startDate);
        Axios.post(url, {
            name: data.name,
            phoneNumber: data.phoneNumber,
            nid: data.nid,
            gender: data.gender,
            bcn: data.bcn,
            religion: data.religion,
            countryPre: data.countryPre,
            districtPre: data.districtPre,
            thanaPre: data.thanaPre,
            postOfficePre: data.postOfficePre,
            addressPre: data.addressPre,
            countryPar: data.countryPar,
            districtPar: data.districtPar,
            thanaPar: data.thanaPar,
            postOfficePar: data.postOfficePar,
            addressPar: data.addressPar,
            gmail: data.gmail,
            studentId: data.studentId,
            username: data.username,
            deptName: data.deptName,
            dob: startDate,
            loggedInName: loggedInName,
        
        })
        .then(res=>{
            alert("student added");

            console.log("done ")
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
        <SidebarAdmin/>
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Add New Student
            </div>
        </div>
        <div className='rightSideAddCourse'>
                

                <div className='courseDetailsAddCourse'>
                    <div className='subDivTitle'>
                        Personal Info Details
                    </div>
                    <div className='detailsForm'>
                        <Form onSubmit={(e)=> submit(e)}>
                            
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" id="name" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>
                            </Row>
                            
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Control type="text" id="phoneNumber" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>NID(National ID Card Number)</Form.Label>
                                    <Form.Control type="text" id="nid" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                                    <Form.Label className="selectLabelMargin">Gender </Form.Label>
                                    <Form.Select className="formSelect" id="gender" onChange={(e)=> handle(e)} defaultValue="Choose...">
                                        <option>Choose...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                                    <Form.Label className="selectLabelMargin">Religion</Form.Label>
                                    <Form.Select className="formSelect" id="religion" onChange={(e)=> handle(e)} defaultValue="Choose...">
                                        <option>Choose...</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Hinduism">Hinduism</option>
                                        <option value="Buddhism">Buddhism</option>
                                        <option value="Christianity">Christianity</option>
                                    </Form.Select>
                                </Form.Group>

                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                <Form.Label>Birth Certificate No</Form.Label>
                                <Form.Control type="text" id="bcn" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                
                            </Row>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridPassword">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
                                </Form.Group>
                            </Row>

                            <div className='subDivTitleInsideForm'>
                                Present Address Details
                            </div>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" id="countryPre" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control type="text" id="districtPre" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Thana</Form.Label>
                                    <Form.Control type="text" id="thanaPre" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Post Office</Form.Label>
                                    <Form.Control type="text" id="postOfficePre" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" id="addressPre" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>



                            <div className='subDivTitleInsideForm'>
                                Parmanent Address Details
                            </div>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control type="text" id="countryPar" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control type="text" id="districtPar" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Thana</Form.Label>
                                    <Form.Control type="text" id="thanaPar" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Post Office</Form.Label>
                                    <Form.Control type="text" id="postOfficePar" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" id="addressPar" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <div className='subDivTitleInsideForm'>
                                Student Information
                            </div>
                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" id="gmail" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

                            <Row className="mb-3">
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Student Id</Form.Label>
                                    <Form.Control type="text" id="studentId" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>
                                <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" id="username" placeholder="" onChange={(e)=> handle(e)} />
                                </Form.Group>

                            </Row>

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