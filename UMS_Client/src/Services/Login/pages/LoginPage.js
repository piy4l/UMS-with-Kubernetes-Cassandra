import React, {useEffect, useState} from 'react'
import { Link, resolvePath } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../assets/css/Login.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import loginImg from '../assets/images/login.webp'


export default function LoginPage() {
    const [who, setWho] = useState("student");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState("");
    const [usernameTopass, setUsernameTopass] = useState("");
    //const [userId, setUserId] = useState("");


    Axios.defaults.withCredentials  = true;
    let navigate = useNavigate(); 
    const routeChangeToProfile = (id) =>{ 
        console.log("who who who who -------", who); 
        localStorage.setItem('username',  id);
        localStorage.setItem('who', who);
      if(who === "student"){
        navigate('/dashboard');
      }
      else if(who  === "head"){
        navigate('/head/addcourse');
      }
      else if(who === "teacher"){
        navigate('/teacher/addoutline');
      }
      else if(who === "advisor"){
        navigate('/advisor/course_registration');
      }
      else if(who === "admin"){
        navigate('/admin/add_student');
      }
      else if(who === "librarian"){
        navigate('/library/admin_home');
      }
      else if(who === "financial"){
        navigate('/financial_admin/dashboard');
      }
      else if(who === "medical"){
        navigate('/medical/admin_home');
      }


    }

    useEffect(() => {
        document.title = "Login"
      }, [])

    useEffect(()=>{
        Axios.get("http://localhost:5000/login").then((response)=>{
            if(response.data.loggedIn){
                setLoginState(response.data.userID)
                console.log(response.data.userID);
                routeChangeToProfile();
            }
            else{
                setLoginState("invalid")
            }
        })
    })

    const login= (e) => {
        e.preventDefault();
        //const who_who = document.getElementById("loginas").value;
        //setWho(who_who);
        console.log("sending to server");
        console.log("who: ", who);
        console.log("username: ", username);
        console.log("password: ", password);
        
        Axios.post("http://localhost:5000/login", {
            who: who,
            username: username, 
            password: password,
        }).then((response) => {
            console.log(response);
            console.log(response.data.result);
            if(response.data.msg === "approved"){
                const id = response.data.id;
                routeChangeToProfile(id);
            }
            else if(response.data.msg === "invalid_username"){
                setLoginState("Invalid username/password");
                alert("Invalid username");
            }
            else{
                setLoginState("Invalid username/password");
                alert("Invalid password");
            }

        });
    }

    return (
        <div>  
            <div className='imageDiv'>
                <img src={loginImg} />
            </div>
            <div className='form-div'>
                <div className='loginHeader'>
                    <h3>Sign In</h3>
                </div>
                    
                <Form onSubmit={(e)=> login(e)}>
                    <Form.Group className="formGroup" controlId="formGridState">
                        <Form.Select className='selectLogin' id="loginas" onChange={(e)=> setWho(e.target.value)} >
                            <option value="student">Login As Student</option>
                            <option value="teacher">Login As Teacher</option>
                            <option value="admin">Login As Admin</option>
                            <option value="advisor">Login As Advisor</option>
                            <option value="head">Login As Head</option>
                            <option value="financial">Login As Financial Admin</option>
                            <option value="librarian">Login As Librarian</option>
                            <option value="medical">Login As Medical Staff</option>
                        </Form.Select>
                    </Form.Group>
                                
                    <Form.Group className="formGroup" controlId="formBasicEmail">
                
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="username"
                        className="form-control"
                        placeholder="Enter username"
                        required onChange={e => setUsername(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group className="formGroup" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        required onChange={e => setPassword(e.target.value)}
                    />
                    </Form.Group>

                    <hr class="solid"></hr>
                    <div className='formSubmit'>
                        <Button className="formGroup formSubmitButton" variant="primary" type="submit">
                            Login
                        </Button>
                    </div>

                </Form>
            </div>
        </div> 
    )
}