import React, { useState } from 'react'
import '../assets/css/OfferCourse.css'
import Sidebar from '../../../components/layout/SideBarHead'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarHead from '../../../components/layout/SideBarHead';

const OfferCourse = () => {

    

    let navigate = useNavigate(); 
    const routeChangeToProfile = () =>{ 
        // console.log("course_id: ", course_id);
        // const url = `singlecourse/${course_id}`;
        // console.log("url: ", url);  
        navigate('/head/showofferlist');
    }

    const [backendData, setBackendData] = useState([{

    }]);
    const [level, setLevel] = useState([]);
    const [term, setTerm] = useState([]);
    const [MasterChecked, setMasterChecked] = useState(false);
    const [SelectedList, setSelectedList] = useState([])

    function getCourse(e){
        e.preventDefault();
        document.getElementsByClassName("allCourseListOffer")[0].style.display = "block";
        const loggedInUser = localStorage.getItem('username');

        console.log(level, " ------ ", term, "------- ", "CSE")
        const url = "http://localhost:5002/head/getCourse?" + "level=" + level + "&term=" + term + "&headId=" + loggedInUser;


        Axios.get(url)
        .then(res=>{
            
            const newData = res.data.data;

            for(var i = 0; i < newData.length; i++){
                newData[i]["selected"] = false;
            }
            
            setBackendData(newData);
            
            console.log(res.data);
            console.log(backendData);
        })
    }

    const onMasterCheck = (e) => {
        let tempList = backendData;
        tempList.map((user) => (user.selected = e.target.checked));
      
        setMasterChecked(e.target.checked);
        setBackendData(tempList);
        setSelectedList(backendData.filter((e) => e.selected));
    }
    
    
      
      const onItemCheck = (e, item) => {
        let tempList = backendData;
        tempList.map((user) => {
          if (user.id === item.id) {
            user.selected = e.target.checked;
          }
          return user;
        });
    
        //To Control Master Checkbox State
        const totalItems = backendData.length;
        const totalCheckedItems = tempList.filter((e) => e.selected).length;
    
        setMasterChecked(totalItems === totalCheckedItems);
        setBackendData(tempList);
        setSelectedList(backendData.filter((e) => e.selected));
        // Update State
        // this.setState({
        //   MasterChecked: totalItems === totalCheckedItems,
        //   List: tempList,
        //   SelectedList: this.state.List.filter((e) => e.selected),
        // });
      }
    
      // Event to get selected rows(Optional)
      const getSelectedRows = () => {
        setSelectedList(backendData.filter((e) => e.selected));
        console.log("selected list", SelectedList);

        let offerCourseId = []

        for(var i = 0; i < SelectedList.length; i++){
            offerCourseId.push(SelectedList[i].id);
        }

        const url = "http://localhost:5002/head/offercourse"

        Axios.post(url, {
            "offered_course_id": offerCourseId,
            "level": level,
            "term": term,
            }).then((response) => {
                console.log(response);
                //console.log(response.data.result);
                routeChangeToProfile();
                

            });
    
      }

    return (
        <div>
        <SidebarHead />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Offer Course
            </div>
        </div>
        <div className='offerRightSide'>
                
                <div className='courseDetailsOfferCourse'>
                    
                    <div className='detailsForm'>
                        

                        <Form.Group className="formGroup" controlId="formGridState">
                            <Form.Label className="selectLabelMargin">Level</Form.Label>
                            <Form.Select className='selectLevelTerm' id="level" onChange={e => setLevel(e.target.value)}>
                                <option value="none" selected disabled hidden>Select an Option</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="formGroup" controlId="formGridState">
                            <Form.Label className="selectLabelMargin" >Term</Form.Label>
                            <Form.Select className='selectLevelTerm' id="term" onChange={e => setTerm(e.target.value)}>
                                <option value="none" selected disabled hidden>Select an Option</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </Form.Select>
                        </Form.Group>
                        
                        <Button variant="primary" className="submitButton" type="submit" onClick = {(e)=> getCourse(e)}>
                            Get Course
                        </Button>

                        <div className='allCourseListOffer'>
                            <table className='offerCourseTable'>
                                <thead>
                                    <tr>
                                        <th>Course title</th>
                                        <th>Course label</th>
                                        <th>Level</th>
                                        <th>Term</th>
                                        <th>Credit</th>
                                        <th>Type</th>
                                        <th><input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={MasterChecked}
                                            id="mastercheck"
                                            onChange={(e) => onMasterCheck(e)}
                                            />
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {backendData.map((row)=>(
                                        <tr>
                                            <td>{row.course_title}</td>
                                            <td>{row.course_label}</td>
                                            <td>{row.level}</td>
                                            <td>{row.term}</td>
                                            <td>{row.credit}</td>
                                            <td>{row.type}</td>
                                            <td>
                                                <input
                                                type="checkbox"
                                                checked={row.selected}
                                                className="form-check-input"
                                                id="rowcheck{i}"
                                                onChange={(e) => onItemCheck(e, row)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Button variant="success" className='offerButtonRight' type="submit" onClick = {(e)=> getSelectedRows(e)}>
                                Offer Course
                            </Button>
                        </div>
                    
                    
                    </div>
                </div>


        </div>
        </div>
    )
}

export default OfferCourse;