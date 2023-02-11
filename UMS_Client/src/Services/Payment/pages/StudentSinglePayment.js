import React, { useEffect,  useState } from 'react'
import '../assets/css/SinglePayment.css'
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


const StudentSinglePayment= () => {

    const query = new URLSearchParams(useLocation().search);

    const std_id = localStorage.getItem("username");
    const id = query.get("id");

    const url = "http://localhost:5022/payment/due_payment?student_id=" + std_id + "&id=" + id;

    const [backendData, setBackendData] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [data, setData] = useState({
        student_id: "",
        id: "",
        amount: "",
        fine: "",
        type: "",
        due_date: "",
        new_student_id: "",
        transaction_id: ""
    });


    useEffect(() => {
        const getData = async () =>{
          const dataFromServer = await fetchData();

          setBackendData([dataFromServer]);
          setData(dataFromServer);
        }
    
        getData();
    }, [])
    
    const fetchData = async () =>{
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
                    Payment Data
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>
                    { backendData.map(payment => {
                            return(
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Id</Form.Label>
                                <Form.Control type="text" id="id" defaultValue={payment.id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="new_student_id" defaultValue={payment.student_id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Issue Date</Form.Label>
                                <Form.Control type="date" id="creation_date" defaultValue={payment.creation_date.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control type="date" id="due_date" defaultValue={payment.due_date.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={payment.amount} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Fine</Form.Label>
                                <Form.Control id="fine" defaultValue={payment.fine}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Type</Form.Label>
                                <Form.Control id="fine" defaultValue={payment.type}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Is Paid</Form.Label>
                                <Form.Control id="ispaid" defaultValue={payment.ispaid}  onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        {
                            payment.ispaid == true ? 

                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Id</Form.Label>
                                        <Form.Control type="text" id="tr_id" defaultValue={payment.transaction.id} onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group> 
                                    <Form.Group as={Col} controlId="formGridPassword">
                                        <Form.Label>Card No</Form.Label>
                                        <Form.Control id="tr_card" defaultValue={payment.transaction.card_no}  onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridPassword">
                                        <Form.Label>Transaction Id</Form.Label>
                                        <Form.Control id="tr_trx" defaultValue={payment.transaction.trx_id}  onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" id="tr_date" defaultValue={payment.transaction.date.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group> 
                                </Row>

                            : 
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Transaction Id</Form.Label>
                                        <Form.Control type="text" id="transaction_id" defaultValue="" onChange={(e)=> handle(e)} disabled/>
                                    </Form.Group> 
                            </Row>
                        }

                        <Row>
                            <Button variant="primary">
                                <a href={`payment_list?type=single&student_id=${payment.student_id}`} style={{color:'white'}}>Go Back</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            {
                                payment.ispaid == true ? 
                                
                                        <Button variant="primary">
                                            <a href={`singletransaction?student_id=${payment.student_id}&id=${payment.transaction.id}`} style={{color:'white'}}>Go To Transaction</a>
                                        </Button>
                                    
                                :  <p></p>
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

export default StudentSinglePayment;