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


const SingleScholarship= () => {

    const query = new URLSearchParams(useLocation().search);

    const name = query.get("name");

    const url = "http://localhost:5023/scholarship/scholarship?name=" + name; 
    const postUrl = "http://localhost:5023/scholarship/update_scholarship"; 
    const delUrl = "http://localhost:5023/scholarship/delete_scholarship";

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






    function addLevelField(e){
        const newData = {...data}
        newData.level_term.push("");
        setData(newData);
    }

    function processNewLevelTerm(){
        let temp = data.level_term;

        for(var i=0; i<temp.length; i++){
            if(temp[i] == 'All'){
                return { type:"remove", data: Object.values(initial.level_term) };
            }
            else if(temp[i] == "") temp.splice(i--, 1);
        }
        return { type:"set", data: temp };
    }





    function submit(e){
        e.preventDefault();

        let new_lv_trm = processNewLevelTerm();
        if(new_lv_trm.type == "remove" && new_lv_trm.data[0] == "All") new_lv_trm = null;
        else if(new_lv_trm.type == "set" && new_lv_trm.data.length == 0) new_lv_trm = null;

        let postData = {};
        postData.name = initial.name;
        postData.amount = data.amount;
        if(new_lv_trm != null) postData.level_term = new_lv_trm;
        
        console.log("Posting: ", postData);

        Axios.patch(postUrl, postData)
        .then(res=>{
            if(res.data.status == "success") {
                alert('Successfully edited');
            }
            else{
                alert('Data is invaild');
            } 
            window.location.reload(false);
        })
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


    

    let navigate = useNavigate(); 
    const routeChangeToProfile = () =>{ 
        const url = `../financial_admin/scholarship_list`;
        navigate(url);
    }

    function deleteScholarship(e){
        e.preventDefault();
        
        Axios.delete(delUrl, {data: {
            name: initial.name
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
                    Scholarship Data
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='transactionDetailsNew'>
                    
                    <div className='detailsForm'>

                    { backendData.map(scholarship => {
                            return(
                    <Form onSubmit={(e)=> submit(e)}>

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
                                <Form.Control type="text" id="amount" defaultValue={scholarship.amount} onChange={(e)=> handle(e)} />
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
                                        <Form.Control id={`lvl_trm-0`} defaultValue="All" onChange={(e)=> handle(e)} />
                                    :
                                    scholarship.level_term.map((lvl_trm, idx) => (
                                        <Form.Control id={`lvl_trm-${idx}`} defaultValue={lvl_trm} onChange={(e)=> handle(e)} />
                                    ))
                                }
                                <br />
                                <span>&nbsp;</span>
                                <Button variant="primary" onClick={(e)=> addLevelField(e)}>
                                    Add
                                </Button>
                            </Form.Group>
                        </Row>

                        <Row>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href="scholarship_list" style={{color:'white'}}>Go Back</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="primary">
                                <a href={`applied_scholarship_list?name=${name}`} style={{color:'white'}}>Applied Scholarship List</a>
                            </Button>
                            <span>&nbsp; &nbsp;</span>
                            <Button variant="danger" onClick={(e)=> deleteScholarship(e)}>
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

export default SingleScholarship