import React, { useEffect,  useState } from 'react'
import '../assets/css/SingleCourse.css'
import Sidebar from '../../../components/layout/SideBarHead'
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import SidebarHead from '../../../components/layout/SideBarHead';


const SingleCourse= () => {
    const { courseId } = useParams();

    const url = "http://localhost:5002/singlecourse?courseId=" + courseId; 
    

    const [backendData, setBackendData] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        <SidebarHead />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Course
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='courseDetailsSingle'>
                    <div className='detailsForm'>

                    { backendData.map(course => {
                            return(
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                                <Form.Label className="selectLabelMargin">Department Name</Form.Label>
                                <Form.Select id="deptName" className="formSelect" onChange={(e)=> handle(e)} defaultValue={course.dept_name}>
                                    <option>Choose...</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ME">ME</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ARCHI">ARCHI</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridEmail">
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control type="text" id="courseName" defaultValue={course.course_title} onChange={(e)=> handle(e)} />
                            </Form.Group>

                            
                        </Row>
                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridPassword">
                            <Form.Label>Course ID</Form.Label>
                            <Form.Control id="courseID" defaultValue={course.course_label}  onChange={(e)=> handle(e)} />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress1">
                                <Form.Label>Credit Hour</Form.Label>
                                <Form.Control type="text" id="creditHour" defaultValue={course.credit} onChange={(e)=> handle(e)}/>
                            </Form.Group>

                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridAddress2">
                                <Form.Label>Level</Form.Label>
                                <Form.Control type="text" id="level" defaultValue={course.level}  onChange={(e)=> handle(e)} />
                            </Form.Group>
                            
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridCity">
                                <Form.Label>Term</Form.Label>
                                <Form.Control type="text" id="term" defaultValue={course.term}  onChange={(e)=> handle(e)} />
                            </Form.Group>
                        </Row>


                        <Row className="mb-3">
                            <Form.Group className="formGroupPadding" as={Col} controlId="formGridState">
                            <Form.Label className="selectLabelMargin">Type</Form.Label>
                            <Form.Select id="type" className="formSelect" onChange={(e)=> handle(e)} defaultValue={course.type}>
                                <option>Choose...</option>
                                <option>Theory</option>
                                <option>Sessional</option>
                            </Form.Select>
                            </Form.Group>

                        </Row>

                        <Button variant="primary" className="submitButton" type="submit">
                            Edit
                        </Button>
                        </Form>

                            )
                    })}
                    </div>

                    {/* <div className='AddType'>
                    <Button variant="primary" onClick={handleShow}>
                            Add type
                    </Button>
                    </div> */}

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                autoFocus
                            />
                            </Form.Group>
                            <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                            >
                            <Form.Label>Example textarea</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                            </Form.Group>
                        </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>


        </div>
        </div>
    )
}

export default SingleCourse