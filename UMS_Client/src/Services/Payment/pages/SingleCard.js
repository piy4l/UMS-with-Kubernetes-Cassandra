import React, { useEffect,  useState } from 'react'
import '../assets/css/SingleCard.css'
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


const SingleCard= () => {

    const query = new URLSearchParams(useLocation().search);

    const std_id = query.get("student_id");
    const card_no = query.get("card_no");

    const url = "http://localhost:5022/payment/smart_card?student_id=" + std_id + "&card_no=" + card_no; 
    const postUrl = "http://localhost:5022/payment/update_smart_card"; 
    const delUrl = "http://localhost:5022/payment/delete_smart_card";

    const [backendData, setBackendData] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [data, setData] = useState({
        balance: "",
        expiry: "",
        pin: "",
        student_id: "",
        card_no: ""
    });


    useEffect(() => {
        const getCard = async () =>{
          const cardFromServer = await fetchCard();
          setBackendData([cardFromServer]);
          setData(cardFromServer);
        }
    
        getCard();
    }, [])
    
    const fetchCard = async () =>{
      const res = await fetch(url);
      const data = await res.json()
      
      return data.data;
    }

    
    function submit(e){
        e.preventDefault();
        Axios.patch(postUrl, {
            balance: data.balance,
            expiry: data.expiry,
            pin: data.pin,
            student_id: data.student_id,
            card_no: data.card_no
        })
        .then(res=>{
            
            if(res.data.status == "success") {
                alert('Successfully edited');
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



    let navigate = useNavigate(); 
    const routeChangeToProfile = () =>{ 
        const url = `../financial_admin/smart_card_list`;
        navigate(url);
    }

    function deleteCard(e){
        e.preventDefault();
        Axios.delete(delUrl, {data: {
            student_id: std_id
        }})
        .then(res=>{
            
            if(res.data.status == "success") {
                routeChangeToProfile();
            }
            else{
                alert('Data is invaild');
            }
        })
    }




    return (
        <div>
        <SidebarFinancialAdmin />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                    Card Data
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    <div className='detailsForm'>

                    { backendData.map(card => {
                            return(
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Student Id</Form.Label>
                                <Form.Control type="text" id="student_id" defaultValue={card.student_id} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Card No</Form.Label>
                                <Form.Control type="text" id="card_no" defaultValue={card.card_no} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Balance</Form.Label>
                                <Form.Control type="text" id="balance" defaultValue={card.balance} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Issue Date</Form.Label>
                                <Form.Control type="date" id="issue" defaultValue={card.issue.toString().substring(0,10)} onChange={(e)=> handle(e)} disabled/>
                            </Form.Group> 
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Expiry Date</Form.Label>
                                <Form.Control type="date" id="expiry" defaultValue={card.expiry.toString().substring(0,10)} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Pin</Form.Label>
                            <Form.Control id="pin" defaultValue={card.pin}  onChange={(e)=> handle(e)} />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href="smart_card_list" style={{color:'white'}}>Go Back</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href={`payment_list?type=single&student_id=${std_id}`} style={{color:'white'}}>Payment List</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="danger" onClick={(e)=> deleteCard(e)}>
                                Delete
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

export default SingleCard