import React, { useEffect,  useState } from 'react'
import '../assets/css/SingleScholarship.css'
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


const StudentSingleScholarship= () => {

    const query = new URLSearchParams(useLocation().search);

    const name = query.get("name");

    const url = "http://localhost:5023/scholarship/scholarship?name=" + name;

    const [backendData, setBackendData] = useState([]);
    const [initial, setInitial] = useState({
        name: "",
        id: "",
        amount: "",
        creation_date: "",
        level_term: []
    });
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [data, setData] = useState({
        name: "",
        id: "",
        amount: "",
        creation_date: "",
        level_term: []
    });


    useEffect(() => {
        const getData = async () =>{
          const dataFromServer = await fetchScholarship();
          if(dataFromServer.level_term == null) dataFromServer.level_term = ["All"];

          setBackendData([dataFromServer]);
          setData(dataFromServer);

          const dataFromServer2 = Object.assign({}, dataFromServer);
          dataFromServer2.level_term = Object.assign({}, dataFromServer.level_term);
          setInitial({...dataFromServer2});
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
        <Sidebar />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Scholarship Data
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
                                <Form.Control type="text" id="name" defaultValue={scholarship.name} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Id</Form.Label>
                                <Form.Control type="text" id="id" defaultValue={scholarship.id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={scholarship.amount} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Creation Date</Form.Label>
                                <Form.Control type="date" id="creation_date" defaultValue={scholarship.creation_date.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>  
                        </Row>
                        <Row className="mb-3">
                            <Form.Label style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>Level Term</Form.Label>
                            
                            
                            <Form.Group as={Col} controlId="formGridPassword">
                                {
                                    scholarship.level_term == null ?
                                        <Form.Control id={`lvl_trm-0`} defaultValue="All" onChange={(e)=> handle(e)} disabled/>
                                    :
                                    scholarship.level_term.map((lvl_trm, idx) => (
                                        <Form.Control id={`lvl_trm-${idx}`} defaultValue={lvl_trm} onChange={(e)=> handle(e)} disabled/>
                                    ))
                                }
                            </Form.Group>
                        </Row>

                        <Row>
                            <Button variant="primary">
                                <a href="scholarship_list" style={{color:'white'}}>Go Back</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href={`apply_scholarship?name=${name}`} style={{color:'white'}}>Apply</a>
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

export default StudentSingleScholarship