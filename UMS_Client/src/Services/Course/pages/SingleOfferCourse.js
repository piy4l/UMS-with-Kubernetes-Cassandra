import React, { useEffect,  useState } from 'react'
import '../assets/css/AddCourse.css'
import SideBarHead from '../../../components/layout/SideBarHead.js'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';


const SingleOfferCourse= () => {
    const { offerCourseId } = useParams();

    const url = "http://localhost:5002/head/singleoffercourse?offerCourseId=" + offerCourseId; 
    

    const [backendData, setBackendData] = useState([]);
    const [show, setShow] = useState(false);
    const [teacher, setTeacher] = useState("")
    const [teacherList, setTeacherList] = useState([{}])

    const handleClose = () => setShow(false);
    
    const handleSaveTeacher = () => {
        setShow(false);

        const url = "http://localhost:5002/head/singleoffercourse/saveteacher"
        setTeacher(teacher);
        Axios.post(url, {
            offerCourseId: offerCourseId,
            teacher: teacher,
        })
        .then(res=>{

        })


    }
    const handleShow = () => {
        setShow(true);
        //const dept_name = 'CSE';
        var loggedInUser = localStorage.getItem('username');
        const url = "http://localhost:5002/head/getTeacherList?headId=" + loggedInUser;
        Axios.get(url)
        .then(res=>{
            setTeacherList(res.data.data);
        })
    }


    useEffect(() => {
        const getCourse = async () =>{
          const courseFromServer = await fetchCourse()
          setBackendData(courseFromServer)
        }
    
        getCourse();
    }, [])
    
    const fetchCourse = async () =>{
      const res = await fetch(url);
      const data = await res.json()
    
      return data.data;
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
            if(res.data == "yes") {

            }
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
        <SideBarHead/>
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Offered Course
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='courseDetailsSingle'>
                    <div className='detailsForm'>

                    { backendData.map(course => {
                            return(
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                            <Form.Label className="selectLabelMargin">Course Name</Form.Label>
                            <Form.Control type="text" id="courseName" defaultValue={course.course_title} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>

                            
                        </Row>
                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridPassword">
                            <Form.Label className="selectLabelMargin">Course ID</Form.Label>
                            <Form.Control id="courseID" defaultValue={course.course_label}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                                <Form.Label className="selectLabelMargin">Credit Hour</Form.Label>
                                <Form.Control type="text" id="creditHour" defaultValue={course.credit} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>

                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress2">
                                <Form.Label className="selectLabelMargin">Level</Form.Label>
                                <Form.Control type="text" id="level" defaultValue={course.level}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                            
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridCity">
                                <Form.Label className="selectLabelMargin">Term</Form.Label>
                                <Form.Control type="text" id="term" defaultValue={course.term}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>


                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                            <Form.Label className="selectLabelMargin">Type</Form.Label>
                            <Form.Control type="text" id="type" defaultValue={course.type}  onChange={(e)=> handle(e)} disabled/>
                            {/* <Form.Select className="formSelect" id="type" onChange={(e)=> handle(e)} defaultValue={course.type} disabled>
                                <option>Choose...</option>
                                <option>Theory</option>
                                <option>Sessional</option>
                            </Form.Select> */}
                            </Form.Group>

                        </Row>

                        </Form>

                            )
                    })}
                    </div>

                    <div className='AddType'>
                    
                    <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                        <Form.Label className="selectLabelMargin">Teacher:   </Form.Label>
                        <Form.Control type="text" id="teacher" defaultValue={teacher} disabled/>
                    </Form.Group>
                    
                    <Button variant="primary" onClick={handleShow}>
                            Add Teacher
                    </Button>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Teacher Selection</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <Form.Group className="formGroup" controlId="formGridState">
                                <Form.Select className='selectLogin' id="loginas" onChange={e => setTeacher(e.target.value)}>
                                    {teacherList.map((teacher)=>(
                                        <option value={teacher.username}>{teacher.username}</option>
                                    ))}    
                                    
                                
                                </Form.Select>
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveTeacher}>
                            Save 
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>


        </div>
        </div>
    )
}

export default SingleOfferCourse