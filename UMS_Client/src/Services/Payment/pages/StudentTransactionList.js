import React, { useEffect,  useState } from 'react'
import '../assets/css/TransactionList.css'
import Sidebar from '../../../components/layout/Sidebar.js'
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarFinancialAdmin from '../../../components/layout/SidebarFinancialAdmin';


const StudentTransactionList = () => {

    const query = new URLSearchParams(useLocation().search);
    let type = "single";
    let std_id = localStorage.getItem("username");

    if(type == null) type = "all";

    let url, title;
    if(type == "all"){
        url = "http://localhost:5022/payment/get_list?table=" + "transactions";
        title = "Transaction List"; 
    }
    else{
        url = "http://localhost:5022/payment/transaction?student_id=" + std_id;
        title = "Transaction History of " + std_id;
    }
    const [backendData, setBackendData] = useState([]);
    const [initial, setInitial] = useState([]);
    const [search, setSearch] = useState("...");

    const options = [ '...', 'course', 'library', 'medical', 'scholarship' ];


    useEffect(() => {
        const getData = async () =>{
          const data = await fetchList()
          
          setBackendData(data)

          const temp = []
          for(var i=0; i<data.length; i++)
            temp.push(Object.assign({}, data[i]));
          setInitial(...[temp]);
        }
    
        getData();
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
            if(a.date > b.date) return d;
            else if(a.date < b.date) return -d;
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

        if(search == "..."){
          for(var i=0; i<initial.length; i++) temp.push(Object.assign({}, initial[i]));
        }
        else{

            for(var i=0; i<initial.length; i++){
                if(initial[i].type != search) continue;
                temp.push(Object.assign({}, initial[i]));
            }

        }
        
        setBackendData(...[temp]);
    }



    return (
        <div>
        <Sidebar />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                {title}
            </div>
        </div>
        <div className='rightSideAddCourse'>

                <div className='transactionDetailsNew'>

                    <div className='scholarshipDetailsTitle'>
                        <Row>
                            <Form.Group as={Col} controlId="formGridAddress1">
                                <Form.Label><h5>Select Type</h5></Form.Label>
                                    <Form.Control as="select" id="search" defaultValue={search} onChange={(e)=> handle(e)}>
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
                    </div>


                    <div className='detailsForm'>
                        { backendData.map(transaction => {
                            return(
                                <Card className='singleCourseNew' style={{marginBottom:'20px'}}>
                                <Card.Body className='cardBodyChange'>
                                    <Card.Title>{transaction.student_id}</Card.Title>
                                    <Card.Text>
                                        <p>Id: {transaction.id}</p>
                                        <p>Amount: {transaction.amount}</p>
                                        <p>Card no: {transaction.card_no}</p>
                                        <p>Date: {transaction.date}</p>
                                        <p>Type: {transaction.type}</p>
                                        <p>Type id: {transaction.type_id}</p>
                                        <p>Trx id: {transaction.trx_id}</p>
                                    </Card.Text>
                                    <Card.Link href={`singletransaction?student_id=${transaction.student_id}&id=${transaction.id}`}>
                                        Go to Transaction
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

export default StudentTransactionList