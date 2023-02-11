import React, { useEffect,  useState } from 'react'
import '../assets/css/SmartCardList.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';


const SmartCardList = () => {

    const tableName = "smart_card";
    const url = "http://localhost:5022/payment/get_list?table=" + tableName; 
    

    const [backendData, setBackendData] = useState([]);
    const [initial, setInitial] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getSmartCards = async () =>{
          const smart_card_list = await fetchList()
          
          setBackendData(smart_card_list)

          const temp = []
          for(var i=0; i<smart_card_list.length; i++)
            temp.push(Object.assign({}, smart_card_list[i]));
          setInitial(...[temp]);
        }
    
        getSmartCards();
    }, [])
    
    const fetchList = async () =>{
      const res = await fetch(url);
      const data = await res.json()
      
      return data.data;
    }




    

    const sortData = function(type){
        let d;
        if(type == "up") d = 1;
        else d = -1;

        let ff = function(a, b){
            if(a.student_id > b.student_id) return d;
            else if(a.student_id < b.student_id) return -d;
            else return 0;
        }

        const temp = [...backendData];
        temp.sort(ff);
        setBackendData(temp);
    }

    function handle(e){
        let newData = search
        newData = e.target.value;
        setSearch(newData);
    }

    const searchData = async () =>{
        console.log("Ekhane ashchhe!");
        console.log("Search: " , search);
        
        let temp = [];

        if(search == "" || search == " "){
          for(var i=0; i<initial.length; i++) temp.push(Object.assign({}, initial[i]));
        }
        else if(!Number.isNaN(parseInt(search))){
            console.log("Ekhane ashe!2")

            for(var i=0; i<initial.length; i++){
                if(initial[i].student_id != search) continue;
                temp.push(Object.assign({}, initial[i]));
            }

        }
        
        setBackendData(...[temp]);
    }



   


    return (
        <div>
        <SidebarFinancialAdmin />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Smart Card List
            </div>
        </div>
        <div className='rightSideAddCourse'>
                <div className='paymentDetailsNew'>
                    <div className='scholarshipDetailsTitle'>

                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label><h4>Search Card</h4></Form.Label>
                                <Form.Control type="text" id="search" defaultValue={search} onChange={(e)=> handle(e)} />
                        </Form.Group> 
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

                        <Button variant="primary">
                            <a href={`addcard`} style={{color:'white'}}>Add</a>
                        </Button>
                    </div>
                    <div className='detailsForm'>
                        { backendData.map(card => {
                            return(
                                <Card className='singleCourseNew' style={{marginBottom:'20px'}}>
                                <Card.Body className='cardBodyChange'>
                                    <Card.Title>{card.student_id}</Card.Title>
                                    <Card.Text>
                                        <p>Card no: {card.card_no}</p>
                                        <p>Balance: {card.balance}</p>
                                        <p>Expiry date: {card.expiry}</p>
                                        <p>Issue date: {card.issue}</p>
                                        <p>Pin: {card.pin}</p>
                                    </Card.Text>
                                    <Card.Link href={`singlecard?student_id=${card.student_id}&card_no=${card.card_no}`}>
                                        Go to card
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

export default SmartCardList