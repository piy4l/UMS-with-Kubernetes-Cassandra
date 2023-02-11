import React, { useState, useEffect } from 'react'
import '../assets/css/StudentRegister.css'
import Sidebar from '../../../components/layout/Sidebar'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SidebarHead from '../../../components/layout/SideBarHead';

const PendingCourseReg = () => {

    

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


    useEffect(() => {
      const getCourse = async () =>{
        const courseFromServer = await fetchCourse()
        setBackendData(courseFromServer)
      }
  
      getCourse();
    }, [])
    
    const fetchCourse = async () =>{
        const username = localStorage.getItem('username');
        console.log("username ------------------ ", username);
      const res = await fetch("http://localhost:5002/student/requestedCourses?student_id=" + username);
      const data = await res.json()
    
    
      for(var i = 0; i < data.data.length; i++){
        data.data[i]["selected"] = false;
      }
      console.log("pls hoye ja", data);
    
      return data.data;
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

        const url = "http://localhost:5002/student/offer_course_register";

        Axios.post(url, {
            "offered_course_id": offerCourseId,
            "student_id": localStorage.getItem("username"),
            }).then((response) => {
                console.log(response);
                //console.log(response.data.result);
                routeChangeToProfile();
                

            });
    
      }

    return (
        <div>
        <Sidebar />
        <div className='containerTitle'>
            <div className='pageTitleNew'>
                Course Registration Pending
            </div>
        </div>
        <div className='offerRightSide'>
                
                <div className='courseDetailsReqCourse'>
                  
                    <h3 >Waiting for approval </h3>
                    <div className='detailsForm'>
                      

                        <div className='allCourseRequest'>
                            <table className='ReqCourseTable'>
                                <thead>
                                    <tr>
                                        <th>Course title</th>
                                        <th>Course label</th>
                                        <th>Level</th>
                                        <th>Term</th>
                                        <th>Credit</th>
                                        <th>Type</th>
                                        <th>Remarks</th>
                                        
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
                                            <td>{row.state}</td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    
                    
                    </div>
                </div>


        </div>
        </div>
    )
}

export default PendingCourseReg;