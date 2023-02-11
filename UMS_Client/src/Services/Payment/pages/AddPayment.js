import React, { useState } from 'react'
import '../assets/css/AddPayment.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';

const AddPayment = () => {

    const url = "http://localhost:5022/payment/create_payment"
    let navigate = useNavigate(); 

    const routeChangeToProfile = (student_id, id) =>{ 
        //const url = `../singlepayment?student_id=${student_id}&id=${id}`;
        const url = `../financial_admin/singlepayment?student_id=${student_id}&id=${id}`;
        

        navigate(url);
    }

    const [data, setData] = useState({
        student_id: "170503",
        amount: "10.0",
        due_date: "2021-02-03",
        fine: "1.0",
        type: "library"
    });

    function submit(e){
        e.preventDefault();

        Axios.post(url, {
            student_id: data.student_id,
            amount: data.amount,
            due_date: data.due_date,
            fine: data.fine,
            type: data.type
        })
        .then(res=>{
            console.log(res);
            if(res.data.status == "success") {
                routeChangeToProfile(data.student_id, res.data.data.id);
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
    }


    return (
        <div>
       <SidebarFinancialAdmin />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Add New Due Payment
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>
                        <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={data.student_id} onChange={(e)=> handle(e)}/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={data.amount} onChange={(e)=> handle(e)}/>
                            </Form.Group>
                        </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridAddress1">
                                    <Form.Label>Fine</Form.Label>
                                    <Form.Control type="text" id="fine" defaultValue={data.fine} onChange={(e)=> handle(e)} />
                                </Form.Group> 
                                <Form.Group as={Col} controlId="formGridAddress1">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control type="text" id="type" defaultValue={data.type} onChange={(e)=> handle(e)} />
                                </Form.Group> 
                            </Row>

                            <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridAddress1">
                                        <Form.Label>Due Date</Form.Label>
                                        <Form.Control type="date" id="due_date" defaultValue={data.due_date} />
                                    </Form.Group>
                            </Row>

                            

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            </Form>
                    
                    
                    
                    </div>
                </div>


        </div>
        </div>
    )
}

export default AddPayment