import React, { useEffect,  useState } from 'react'
import '../assets/css/PendingList.css'
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
import SideBarAdvisor from '../../../components/layout/SideBarAdvisor';
import SidebarHead from '../../../components/layout/SideBarHead';


const StudentPendingList = () => {

    const query = new URLSearchParams(useLocation().search);
    const schol_name = query.get("name");
    const std_id = localStorage.getItem("username");
    const sess = query.get("session");
    const state = query.get("state");

    const options = [ '...', 'Applied', 'Advisor', 'Hall', 'Head', 'Accepted', 'Rejected' ];

    const url = "http://localhost:5023/scholarship/pending_scholarship_list"; 
    
    const [backendData, setBackendData] = useState([]);
    const [search, setSearch] = useState(() => {

        let ret = {};
        
        if(sess != null && !Number.isNaN(parseInt(sess))) ret.session = sess;
        else ret.session = "";
        
        if(schol_name != null) ret.name = schol_name;
        else ret.name = "";
        
        if(state != null) ret.state = state;
        else ret.state = "...";

        ret.student_id = std_id;
        return ret;
    });
    

    useEffect(() => {
        const getData = async () =>{
          const scholarship_list = await fetchList(urlBuilder())
          
          setBackendData(scholarship_list)
        }

        getData();
    }, [])
    
    const fetchList = async (url) =>{
      const res = await fetch(url);
      const data = await res.json()
      return data.data;
    }




    const urlBuilder = function(){
        let started = false;
        let url_p = url + "?";

        if(search.session != "" && !Number.isNaN(parseInt(search.session))) {
            started = true;
            url_p += "session="+search.session;
        }
        if(search.name != "") {
            if(started) url_p += "&";
            started = true;
            url_p += "name="+search.name;
        }
        if(search.state != "...") {
            if(started) url_p += "&";
            started = true;
            url_p += "state="+search.state;
        }

        if(started) url_p += "&";
        url_p += "student_id="+search.student_id;

        return url_p;
    }

    const sortData = function(type){
        let d;
        if(type == "up") d = 1;
        else d = -1;

        let ff = function(a, b){
            if(a.issue_time > b.issue_time) return d;
            else if(a.issue_time < b.issue_time) return -d;
            else return 0;
        }

        const temp = [...backendData];
        temp.sort(ff);
        setBackendData(temp);
    }

    function handle(e){
        let newData = search
        newData[e.target.id] = e.target.value;
        setSearch(newData);
    }

    const searchData = async () =>{

        let url_p = urlBuilder();

        const ret = await fetchList(url_p);
        const temp = [...ret];
        setBackendData(temp);
    }
   


    return (
        <div>
        <Sidebar />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Pending Scholarship List
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='transactionDetailsNew'>
                    <div>
                        <br /> <br />

                        <Row>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label><h5>Search Session</h5></Form.Label>
                                    <Form.Control type="text" id="session" defaultValue={search.session} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label><h5>Search Scholarship Name</h5></Form.Label>
                                    <Form.Control type="text" id="name" defaultValue={search.name} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>
                        <br />
                        <Row>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label><h5>Select State</h5></Form.Label>
                                    <Form.Control as="select" id="state" defaultValue={search.state} onChange={(e)=> handle(e)}>
                                    {
                                        options.map((option) => {
                                            return(
                                                <option value={option}>{option}</option>
                                            )
                                        })
                                    }
                                    </Form.Control>
                            </Form.Group> 
                        </Row>
                        <br />
                        <span>&nbsp; &nbsp;</span>
                        <Button variant="primary" onClick={(e)=> searchData()}>
                            Search
                        </Button>

                        <br /><br />
                        <span>&nbsp; &nbsp;</span>
                        <Button variant="primary" onClick={(e)=> sortData("up")}>
                            Sort &uarr;
                        </Button>
                        <span>&nbsp; &nbsp;</span>
                        
                        <Button variant="primary" onClick={(e)=> sortData("down")}>
                            Sort &darr;
                        </Button>
                        <span>&nbsp; &nbsp;</span>
                    </div>
                    <div className='detailsForm'>
                    
                        { backendData.map(scholarship => {
                            return(
                                <Card className='singleCourseNew' style={{marginBottom:'20px'}}>
                                <Card.Body className='cardBodyChange'>
                                    <Card.Title>{scholarship.student_id} applied {scholarship.scholarship_name}</Card.Title>
                                    <Card.Text>
                                        <p>Student Id: {scholarship.student_id}</p>
                                        <p>Session Id: {scholarship.session_id}</p>
                                        <p>Scholarship Name: {scholarship.scholarship_name}</p>
                                        <p>Scholarship amount: {scholarship.amount}</p>
                                        <p>Scholarship creation date: {scholarship.issue_time}</p> <br />
                                        <p>Current State: </p> 
                                        <p>Location: {scholarship.current_state.location} Updated By: {scholarship.current_state.updated_by}</p>
                                        <p>Update Time: {scholarship.current_state.update_time}</p>
                                    </Card.Text>
                                    <Card.Link href={`single_apply_scholarship?name=${scholarship.scholarship_name}&student_id=${scholarship.student_id}&session=${scholarship.session_id}`}>
                                        Go to applied scholarship
                                    </Card.Link>
                                    <Card.Link href={`single_scholarship?name=${scholarship.scholarship_name}`}>
                                        Go to scholarship
                                    </Card.Link>
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

export default StudentPendingList