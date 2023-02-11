import React, { useEffect, useState } from 'react'
import '../assets/css/AddOutline.css'
import Sidebar from '../../../components/layout/SideBarTeacher.js'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import SideBarTeacher from '../../../components/layout/SideBarTeacher.js';

const AddOutline = () => {

    const [backendData, setBackendData] = useState([]);
    const [assignCourseList, setAssignCourseList] = useState([]);
    const [show, setShow] = useState(false);
    const [teacher, setTeacher] = useState("")
    const [teacherList, setTeacherList] = useState([{}])
    
    
    
    const [name, setName] = useState("");
    const [weight, setWeight] = useState(0.0);
    const [selectedOfferCourse, setSelectedOfferCourse] = useState([]);
    const [evaluationItem, setEvaluationItem] = useState([{
       
    }])

    const handleClose = () => setShow(false);
    
    const handleSaveOutline = () => {
        setShow(false);

        const url = "http://localhost:5002/teacher/addoutline/addtype"
        console.log("hello?????? ", selectedOfferCourse)

        Axios.post(url, {
            offerCourseId: selectedOfferCourse,
            name: name,
            weight: weight,

        })
        .then(res=>{
                alert("added")
        })


    }
    const handleShow = () => {
        setShow(true);
        // const dept_name = 'CSE';
        // const url = "http://localhost:5002/head/getTeacherList?dept_name=" + dept_name;
        // Axios.get(url)
        // .then(res=>{
        //     setTeacherList(res.data.data);
        // })
    }

    const teacher_username = localStorage.getItem("username");
    const url = 'http://localhost:5002/teacher/getassigncourse?username=' + teacher_username;

    useEffect(() => {
        const getAssignCourse = async () =>{
          const courseFromServer = await fetchCourse()
          setAssignCourseList(courseFromServer)
        }
    
        getAssignCourse();
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

    function getEvaluationItem(e){
        e.preventDefault();
        console.log(selectedOfferCourse, " ----------------- hello")

        const url = 'http://localhost:5002/teacher/getevaluationitem';

        Axios.post(url, {
            offered_course_id: selectedOfferCourse
        })
        .then(res =>{
            setEvaluationItem(res.data.data)
            console.log("fjalfjadjf  fj                     kfjlkajf")
            console.log(res.data.data)
            console.log(evaluationItem)
        })
    
    }

    function publishOutline(){
        const url = 'http://localhost:5002/teacher/publishOutline?offered_course_id=' + selectedOfferCourse;
        Axios.get(url)
        .then(res=>{
            alert("published")
            console.log(res.data)
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
        <SideBarTeacher />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Add outline
            </div>
        </div>
        <div className='rightSideAddCourse'>
                

                <div className='courseDetailsAddCourse'>
                    <div className='courseDetailsTitleAddCourse'>
                        Offer course details
                    </div>
                    <div className='detailsForm'>
                        
                    
                        <Form.Group as={Col} className="formGroupPadding" controlId="formGridState">
                            <Form.Label className="selectLabelMargin" >Select Offer course</Form.Label>
                            <Form.Select className="formSelect" id="assignCourse" onChange={(e) => setSelectedOfferCourse(e.target.value)} >
                                    <option value="none">Choose</option>
                                { assignCourseList.map(course => (
                                    <option value={course.offercourseid}>{course.course_title}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button onClick={(e) => getEvaluationItem(e)}>Get Evaluation</Button>
                    
                    
                    </div>

                    { evaluationItem.map((item) => (

                        <div className='AddType'>
                                    
                    

                            <Form.Group as={Col} className="formGroupPadding" controlId="formGridAddress1">
                                <Form.Label className="selectLabelMargin">Name:   </Form.Label>
                                <Form.Control type="text" id="name" defaultValue={item.name} disabled/>
                            </Form.Group>

                            <Form.Group as={Col} className="formGroupPadding" controlId="formGridAddress1">
                                <Form.Label className="selectLabelMargin">Weight:   </Form.Label>
                                <Form.Control type="text" id="teacher" defaultValue={item.weight} disabled/>
                            </Form.Group>
                        
                        </div>
                    ))}

                    
                        <Button className='AddButtonNewType' onClick={handleShow}>Add New Type</Button>
                        
                    
                        
                        <Button className='AddButtonPublish' onClick={publishOutline}>Publish</Button>
                    

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add new type</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                                <Form.Label className="selectLabelMargin">Name  </Form.Label>
                                <Form.Control type="text" id="teacher" defaultValue={teacher} onChange={e => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                                <Form.Label className="selectLabelMargin">Weight  </Form.Label>
                                <Form.Control type="text" id="teacher" defaultValue={teacher} onChange={e => setWeight(e.target.value)} />
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveOutline}>
                            Save 
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>


        </div>
        </div>
    )
}

export default AddOutline