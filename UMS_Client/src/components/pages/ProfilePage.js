import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import Axios from 'axios'
import '../../assets/css/ProfilePage.css'
import '../../assets/css/Course.css'
import Sidebar from '../layout/Sidebar';


// get the id which is passed from login page

export default function LoginPage() {
    // get the user id which is sent from the login Page

    
    const [backendData, setBackendData] = useState("")

    const [name, setName] = useState("");
    const [birthCertificateNo, setBirthCertificateNo] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [nid, setNid] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [religion, setReligion] = useState("");
    const [id, setId] = useState("");


    useEffect(() => {
        fetch("/profile").then(
        response => response.json()
        ).then(
        data => {
            setBackendData(data)
        }
        )
    }, [])
    
    let navigate = useNavigate(); 
    const routeChangeToProfile = () =>{ 
        // sent user id to profile page
        
        //navigate('/profile');
      }
    const edit_profile= () => {
        const phone = document.getElementById("phone").value;
        const id = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const gender = document.getElementById("gender").value;
        const nid = document.getElementById("nid").value;
        const birthCertificateNo = document.getElementById("birthCertificateNo").value;
        const dob = document.getElementById("dob").value;
        const religion = document.getElementById("religion").value;
        console.log("phone: ", phone)
        console.log("nid: ", nid)
        Axios.post("http://localhost:5000/edit_profile", {
            name: name,
            birthCertificateNo: birthCertificateNo,
            dob: dob,
            email: email,
            nid: nid,
            phone: phone,
            gender: gender,
            religion: religion,
            id: id
        }).then((response) => {
            alert("Profile Updated!");
            routeChangeToProfile();
        });
    }

    return (
        <div>
            <Sidebar />
            <div className='rightSide'>
            <div class="container rounded bg-white mt-5 mb-5">
             {/* {(typeof backendData.results === 'undefined') ? (
                <p>loading...</p>
            ) : (
                backendData.results.map((result, i) => (
                    <p key={i}>{result.phone}</p>
                )
                )
            )
            
            } */}
                <div class="row">
                    <div class="col-md-3 border-right">
                    {(typeof backendData.student_id === 'undefined') ? (
                                <p></p>
                            ) : (
                                <div>
                        <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" /><span class="font-weight-bold">{backendData.student_id}</span><span> </span></div>
                                </div>
                        )
                        
                    
                    
                    }
                    
                    
                        </div>
                    <div class="col-md-5 border-right">
                        <div class="p-3 py-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="text-right">Profile Information</h4>
                            </div>
                            
                            {(typeof backendData.results === 'undefined') ? (
                                <p>loading...</p>
                            ) : (
                                backendData.results.map((result, i) => (
                                <div>
                                <div class="row mt-3">
                                    <div class="col-md-12"><label class="labels">Name</label><input id="name" type="text" class="form-control" value={result.name}  /></div>
                                    <div class="col-md-12"><label class="labels">Mobile Number</label><input id="phone" type="text" class="form-control" defaultValue={result.phone} onChange={e => setPhone(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Email</label><input id="email" type="text" class="form-control" defaultValue={result.gmail} onChange={e => setEmail(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Gender</label><input id="gender" type="text" class="form-control" defaultValue={result.gender} onChange={e => setGender(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Religion</label><input id="religion" type="text" class="form-control" defaultValue={result.religion} onChange={e => setReligion(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">NID</label><input id="nid" type="text" class="form-control" defaultValue={result.nid} onChange={e => setNid(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Date of Birth</label><input id="dob" type="text" class="form-control" defaultValue={result.dob} onChange={e => setDob(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Birth Certificate No.</label><input id="birthCertificateNo" type="text" class="form-control" defaultValue={result.birth_certificate_no} onChange={e => setBirthCertificateNo(e.target.value)}/></div>
                                    <div class="col-md-12"><label class="labels">Department</label><input id="department" type="text" class="form-control" value="CSE" /></div>
                                    </div>
                                    <div class="row mt-3">
                                    <div class="col-md-6"><label class="labels">Country</label><input type="text" class="form-control" value="Bangladesh" /></div>
                                    <div class="col-md-6"><label class="labels">State/Region</label><input type="text" class="form-control" value="Dhaka" /></div>
                                    <div class="col-md-12"><label class="labels">Department</label><input type="hidden" id="id" name="custId" value={result.id} /></div>
                                    </div>
                                </div>
                                )
                                )
                            )
                            
                            }
                                
                            
                            
                            <div class="mt-5 text-center"><button class="btn btn-primary profile-button" type="button" onClick={ edit_profile }>Save Profile</button></div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 py-5">
                            {/* <div class="d-flex justify-content-between align-items-center experience"><span>Edit Experience</span><span class="border px-3 p-1 add-experience"><i class="fa fa-plus"></i>&nbsp;Experience</span></div><br />
                            <div class="col-md-12"><label class="labels">Experience in Designing</label><input type="text" class="form-control" placeholder="experience" value="" /></div> <br />
                            <div class="col-md-12"><label class="labels">Additional Details</label><input type="text" class="form-control" placeholder="additional details" value="" /></div> */}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}
