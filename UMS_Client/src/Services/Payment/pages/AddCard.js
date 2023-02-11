import React, { useState } from 'react'
import '../assets/css/AddCard.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';

const AddCard = () => {

    const url = "http://localhost:5022/payment/create_smart_card"

    // singlecard?student_id=${card.student_id}&card_no=${card.card_no}

    let navigate = useNavigate(); 

    const routeChangeToProfile = (student_id, card_no) =>{ 
        // const url = `../singlecard?student_id=${student_id}&card_no=${card_no}`;
        const url = `../financial_admin/singlecard?student_id=${student_id}&card_no=${card_no}`;
        navigate(url);
    }

    const [data, setData] = useState({
        balance: "100.0",
        pin: "1234",
        student_id: "1705",
        card_no: "card_no"
    });

    function submit(e){
        e.preventDefault();
        Axios.post(url, {
            balance: data.balance,
            pin: data.pin,
            student_id: data.student_id,
            card_no: data.card_no
        })
        .then(res=>{
            if(res.data.status == "success") {
                routeChangeToProfile(data.student_id, data.card_no);
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
                    Add New Smart Card
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
                                <Form.Label>Card No</Form.Label>
                                <Form.Control type="text" id="card_no" defaultValue={data.card_no} onChange={(e)=> handle(e)}/>
                            </Form.Group>
                        </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridAddress1">
                                    <Form.Label>Balance</Form.Label>
                                    <Form.Control type="text" id="balance" defaultValue={data.balance} onChange={(e)=> handle(e)} />
                                </Form.Group> 
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridAddress1">
                                    <Form.Label>Pin</Form.Label>
                                    <Form.Control type="text" id="pin" defaultValue={data.pin} onChange={(e)=> handle(e)} />
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

export default AddCard