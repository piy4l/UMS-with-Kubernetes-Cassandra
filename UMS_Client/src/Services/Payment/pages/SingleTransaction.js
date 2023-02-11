import React, { useEffect,  useState } from 'react'
import '../assets/css/SingleTransaction.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { useLocation, useParams, Link } from "react-router-dom";
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';


const SingleTransaction= () => {

    const query = new URLSearchParams(useLocation().search);

    const std_id = query.get("student_id");
    const id = query.get("id");

    const url = "http://localhost:5022/payment/transaction?student_id=" + std_id + "&id=" + id; 

    const [backendData, setBackendData] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        const getData = async () =>{
          const cardFromServer = await fetchData();
          setBackendData([cardFromServer]);
        }
    
        getData();
    }, [])
    
    const fetchData = async () =>{
      const res = await fetch(url);
      const data = await res.json()
      
      return data.data;
    }

    return (
        <div>
        <SidebarFinancialAdmin />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Transaction Data
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>

                    { backendData.map(transaction => {
                            return(
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Id</Form.Label>
                                <Form.Control type="text" id="id" defaultValue={transaction.id} disabled/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={transaction.student_id} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Card No</Form.Label>
                                <Form.Control type="text" id="card_no" defaultValue={transaction.card_no} disabled/>
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={transaction.amount} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Type</Form.Label>
                                <Form.Control type="text" id="type" defaultValue={transaction.type} disabled/>
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Trx Id</Form.Label>
                                <Form.Control type="text" id="trx_id" defaultValue={transaction.trx_id} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Issue Date</Form.Label>
                                <Form.Control type="date" id="date" defaultValue={transaction.date.toString().substring(0,10)} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row>
                            <Button variant="primary">
                                <a href={`transaction_list?type=single&student_id=${transaction.student_id}`} style={{color:'white'}}>Go Back</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            {
                                transaction.type_id != null ?
                                        <Button variant="primary">
                                            <a href={`singlepayment?student_id=${transaction.student_id}&id=${transaction.type_id}`} style={{color:'white'}}>Go To Payment</a>
                                        </Button> 
                                :   <p></p>
                            }
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

export default SingleTransaction