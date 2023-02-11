import React, {useEffect, useState} from 'react'
import { Link, resolvePath } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios'
import '../../assets/css/Login.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import loginImg from '../../assets/images/login.webp'


export default function LoginPage( ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginState, setLoginState] = useState("");


    Axios.defaults.withCredentials  = true;
    let navigate = useNavigate(); 
    const routeChangeToProfile = () =>{ 
      navigate('/profile');
    }

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
        console.log("sending to server");
        console.log("username: ", username);
        console.log("password: ", password);
        Axios.post("http://localhost:5000/login", {
            username: username, 
            password: password 
        }).then((response) => {
            console.log(response);
            console.log(response.data.result);
            if(response.data.result === "approved"){
                routeChangeToProfile();
            }
            else{
                setLoginState("Invalid username/password")
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
                        <Form.Select className='selectLogin' id="loginas" >
                            <option value="Student">Login As Student</option>
                            <option value="Teacher">Login As Teacher</option>
                            <option value="Admin">Login As Admin</option>
                            <option value="Advisor">Login As Advisor</option>
                            <option value="Head">Login As Head</option>
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