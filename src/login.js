import { AES, enc } from 'crypto-js';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Routes, Route, useNavigate} from 'react-router-dom';



const API = process.env.API_BACKEND;

const Login = (props) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(() => '');
    const storedUser = props.storedUser;

    useEffect(() => {
        if (storedUser) {
            const decrypted = AES.decrypt(storedUser.password, process.env.CRYPTO_SECRET).toString(enc.Utf8);
            autoLogin(storedUser.email, decrypted);
        }
    }, [storedUser])

    const handleLoginAttempt = (e) => {
        e.preventDefault();
        console.log (e);
        const data = JSON.stringify({
          email: e.target.elements.email.value,
          password: e.target.elements.password.value,
        });

        const config = {
          method: "post",
          url: `${API}/users/login/`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
            .then((res) => handleLoginSuccess(res, e.target.elements.save.checked, e.target.elements.password.value))
            .catch((err) => handleFail(err));
        
    }

    const autoLogin = (email, password) => {
        const data = JSON.stringify({
          email,
          password
        });

        const config = {
          method: "post",
          url: `${API}/users/login/`,
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then((res) => handleLoginSuccess(res, true, password))
          .catch((err) => handleFail(err));
    }

    const handleNewUserSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        const {username, email, password1, password2} = e.target.elements;
        
        const userData = {
            username: username.value,
            email: email.value,
            password1: password1.value,
            password2: password2.value
        }

        //LOTS MORE INPUT CHECKING TO DO HERE
        if (userData.password1 !== userData.password2) {
            setMessage("Passwords Don't Match!");
        } else {
            const data = JSON.stringify({
              name: userData.username,
              email: userData.email,
              password: userData.password1,
            });

            const config = {
              method: "post",
              url: `${API}/users/register/`,
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };

            axios(config)
              .then((res) => handleNewUserSuccess(res))
              .catch((err) => handleFail(err));
        }
    }

    const handleNewUserSuccess = () => {
        setMessage('New User Created Successfully!')
    }

    const handleLoginSuccess = (res, save, password) => {
        props.handleLogin(res.data.user, res.data.email, res.data.token, save, password)
    }
    const handleFail = (err) => {
        setMessage(err.response.data.error);
    }


    const handleNewUserClick = () => navigate('newUser');
    const backToLogin = () => navigate('');

    //ROUTES
    const LoginForm = () => {
        if (!storedUser) {
            return (
                <div id='login'>
                    <form onSubmit={handleLoginAttempt}>
                        <label>Email: </label>
                        <input type='text' name='email'></input>
                        <br />
                        <label>Password: </label>
                        <input type='password' name='password'></input>
                        <br />
                        <input type="submit" value='Submit' />
                        <label>Auto Login</label>
                        <input type='checkbox' name='save' />
                    </form>
                    <br />
                    <button id='newUser' onClick={handleNewUserClick}>Sign Up</button>
                    <p id='loginMessage'>{message}</p>
                </div>
            )
        } else {
            return '';
        }
    }

    const NewUser = () => {
        return (
            <div id='newUser'>
                <form onSubmit={handleNewUserSubmit}>
                    <label>Username: </label>
                    <input type='text' name='username' id='username' placeholder='username' required />
                    <br />
                    <label>Email: </label>
                    <input type='text' name='email' placeholder='email' required />
                    <br />
                    <label>Password: </label>
                    <input type='password' name='password1' placeholder='password' required />
                    <br />
                    <label>Re-type Password: </label>
                    <input type='password' name='password2' placeholder='re-type password' required />
                    <br />
                    <input type='submit' value='Submit' />
                </form>
                    <button onClick={backToLogin}>Back to Login</button>
                    <p id='loginMessage'>{message}</p>
            </div>
        )
    }

    return (
        <Routes>
            <Route path='/' element={<LoginForm />} /> 
            <Route path='newUser' element={<NewUser />} />
        </Routes>
    ) 
}

export { Login };