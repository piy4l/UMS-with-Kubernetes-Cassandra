import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import SidebarLibraryAdmin from '../../../../components/layout/SidebarLibraryAdmin';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
export default function AdminShowBorrowInfo() {
    const [backendData, setBackendData] = useState("")
    const [initial, setInitial] = useState("");
    const [is_returned, setIsReturned] = useState("")
    const [search, setSearch] = useState("");
    const [id, setId] = useState("")
    useEffect(() => {
        fetch("http://localhost:5009/get_pending_borrowed_books").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)

            const data2 = [];
            for(var i=0; i<data.results.length; i++){
                var temp = Object.assign({}, data.results[i]);
                data2.push(temp);
            }
            const tempp = {results: data2}
            setInitial(tempp);
        }
        )
    }, [])
    
    let navigate = useNavigate(); 
        const routeChangeToAdminShowBorrowInfo= () =>{ 
            alert("Borrow History Updated!");
            navigate('/library/admin_show_borrow_info');
        }

    const update_borrow_info= (e) => {
        e.preventDefault();
        console.log('id : ', id);
        console.log('is returned? : ', is_returned)
        Axios.post("http://localhost:5009/update_borrow_info", {
            id: id,
            is_returned: is_returned
        }).then((response) => {
            console.log(response)
            //routeChangeToAdminShowBorrowInfo()
        });
    }

    const searchData = async () =>{


        let newData = backendData
        
        newData.results = []
        for(var i=0; i<initial.results.length; i++){
            if(initial.results[i].student_id == search){
                newData.results.push(initial.results[i])
            }
        }
        setBackendData(newData);
        console.log("new data: ", newData)
        console.log("back data: ", backendData)
                

        // console.log("Ekhane ashchhe!");
        // console.log("Search: " , search);


        // // const temp = [...backendData];
        
        // console.log(backendData);
        // console.log(initial);
        
        
        
        // // temp.sort(ff);




        // setBackendData(temp);

        // let url_p;
        // if(search != "") url_p = url + "?level_term=" + search;
        // else url_p = url;

        // const ret = await fetchList(url_p);
        // const temp = [...ret];
        // setBackendData(temp);
    }

    function handle(e){
        let newData = search
        newData = e.target.value;
        setSearch(newData);
    }
    return (    
        <div className="container rounded bg-white mt-5 mb-5">
           <SidebarLibraryAdmin/>
            <div class="jumbotron">
            <div className='scholarshipDetailsTitle'>
                        
                        <br /> <br />

                        <Form.Group as={Col} controlId="formGridAddress1" className="search">
                            <Form.Label>Search Student ID</Form.Label>
                                <Form.Control type="text" id="search" defaultValue={search} onChange={(e)=> handle(e)} />
                        </Form.Group> 
                        
                        <br/><Button variant="primary" onClick={(e)=> searchData()}>
                            Search
                        </Button>

                    </div>

                <h1 class="display-4" align="center">Books Borrow List</h1>
                
                <hr class="my-4" />
                <p align="center">Edit Book Borrow History</p>
                <a class="btn btn-primary btn-lg" href="http://localhost:3000/library/admin_show_borrow_info_history" role="button">History</a>
            </div>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Student ID</th>
                    <th scope="col">Book Name</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Is Returned?</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    (typeof backendData.results === 'undefined') ? (
                        <p>loading...</p>
                    ) : (
                    backendData.results.map((result, i) => (  
                        
                        <tr>
                        <td>{result.student_id}</td>
                        <td>{result.book_name}</td>
                        <td>{result.due_date}</td>
                        <td><a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ e => {setIsReturned('On'); setId(result.id); update_borrow_info(e) }}>Returned</a></td>
                       
                        </tr>
                        
                    )
                    )
                    )
                }  
                </tbody>
                </table>
                <a class="btn btn-primary btn-lg" align="center" href="#" role="button" onClick={ routeChangeToAdminShowBorrowInfo }>Done</a>
        </div>
    )
}
