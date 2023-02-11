import React, { useState }from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'
import Axios from 'axios'

export default function LoginPage({ setToken }) {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");

    const register = () => {
        Axios.post("http://localhost:3000/reg", {
            student_id: usernameReg, 
            username:usernameReg, 
            password: passwordReg 
        }).then((response) => {
            console.log(response)
        });
    }

    return (
        <div>
            <div className="text-center m-5-auto">
                <h2>Registration</h2>
                <form action="/">
                    <p>
                        <label>Username or Student ID</label><br/>
                        <input type="text" name="username" required onChange={e => setUsernameReg(e.target.value)} />
                    </p>
                    <p>
                        <label>Password</label>
                        <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>
                        <br/>
                        <input type="password" name="password" required onChange={e => setPasswordReg(e.target.value)} />
                    </p>
                    <p>
                        <button id="sub_btn" type="submit" onClick={register}>Register</button>
                    </p>
                </form>
                <footer>
                    <p><Link to="/">Back to Homepage</Link>.</p>
                </footer>
            </div>
        </div>
    )
}
