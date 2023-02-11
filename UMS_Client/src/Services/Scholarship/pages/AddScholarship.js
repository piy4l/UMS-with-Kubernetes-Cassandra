import React, { useEffect,  useState } from 'react'
import '../assets/css/AddScholarship.css'
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


const AddScholarship= () => {

    const url = "http://localhost:5023/scholarship/create_scholarship"; 

    let navigate = useNavigate(); 

    const routeChangeToProfile = (name) =>{ 
        const url = `../financial_admin/single_scholarship?name=${name}`;
        navigate(url);
    }

    const [data, setData] = useState({
        name: "",
        amount: "0.0",
        level_term: ['All']
    });




    function addLevelField(e){
        const newData = {...data}
        newData.level_term.push("");
        setData(newData);
    }

    function processNewLevelTerm(){
        let temp = data.level_term;

        for(var i=0; i<temp.length; i++){
            if(temp[i] == 'All'){
                return [];
            }
            else if(temp[i] == "") temp.splice(i--, 1);
        }
        return temp;
    }




    function handle(e){
        const newData = {...data}

        var str = e.target.id.split("-");
        if(str[0] == 'lvl_trm'){
            var id = parseInt(str[1]);
            newData.level_term[id] = e.target.value;
        }
        else newData[e.target.id] = e.target.value
        
        setData(newData);
    }

    function submit(e){
        e.preventDefault();

        let postData = {};
        postData.name = data.name;
        postData.amount = data.amount;
        postData.level_term = processNewLevelTerm();
        
        console.log("Posting: ", postData);

        Axios.post(url, postData)
        .then(res=>{
            if(res.data.status == "success") {
                routeChangeToProfile(data.name);
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
                    Add Scholarship 
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    
                    <div className='detailsForm'>

                    
                    <Form onSubmit={(e)=> submit(e)}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Scholarship name</Form.Label>
                                <Form.Control type="text" id="name" defaultValue={data.name} onChange={(e)=> handle(e)} />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" id="amount" defaultValue={data.amount} onChange={(e)=> handle(e)} />
                            </Form.Group> 
                        </Row>

                        <Row className="mb-3">
                            <Form.Label style={{ display:"flex", flexDirection:"row", alignItems:"center",  }}>Level Term</Form.Label>
                            
                            <Form.Group as={Col} controlId="formGridPassword">
                                {
                                    data.level_term.map((lvl_trm, idx) => (
                                        <Form.Control id={`lvl_trm-${idx}`} defaultValue={lvl_trm} onChange={(e)=> handle(e)} />
                                    ))
                                }
                                
                                <span>&nbsp;</span>
                                <br />
                                <Button variant="primary" onClick={(e)=> addLevelField(e)}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary" type="submit">
                                <a href={`scholarship_list`} style={{color:'white'}}>Go Back</a>
                            </Button>
                        </Row>
                        </Form>

                    </div>
                </div>


        </div>
        </div>
    )
}

export default AddScholarship