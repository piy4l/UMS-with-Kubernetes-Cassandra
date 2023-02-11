import React, { useEffect,  useState } from 'react'
import '../assets/css/CourseList.css'
import Sidebar from '../../../components/layout/SideBarHead'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import SidebarHead from '../../../components/layout/SideBarHead';


const AddCourse = () => {

    //const deptName = "CSE";
    
    
    const [backendData, setBackendData] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {

        const getCourse = async () =>{
          const courseFromServer = await fetchCourse()
          setBackendData(courseFromServer)
        }
    
        getCourse();
    }, [])
    
    const fetchCourse = async () =>{
        const name= localStorage.getItem('username');
        setUsername(name);

        console.log("teacher_id ??  ", name);
        const url = "http://localhost:5002/courselist?headName=" + name; 
        const res = await fetch(url);
        const data = await res.json()
    
        return data.data;
    }


   


    return (
        <div>
        <SidebarHead />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Course List
            </div>
        </div>
        <div className='rightSideCourseList'>
                <div className='courseList'>
                    
                        { backendData.map(course => {
                            return(
                                <Card className='singleCourseNew'>
                                <Card.Body className='cardBodyChange'>
                                    <Card.Title>{course.course_title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{course.course_label}</Card.Subtitle>
                                    <Card.Text>
                                        <p>Credit hour: {course.credit}</p>
                                        <p>Level: {course.level}</p>
                                        <p>Term: {course.term}</p>
                                        <p>Type: {course.type}</p>
                                    </Card.Text>
                                    <Card.Link href={`singlecourse/${course.id}`}>Go to course</Card.Link>
                                </Card.Body>
                                </Card>
                            )
                        })}
                        
                </div>


        </div>
        </div>
    )
}

export default AddCourse