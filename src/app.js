//Dependencies
import { AES, enc } from 'crypto-js';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';


//Components
import { Login } from './login.js';
import { NavBar } from './navbar.js';

//Styles
import './styles/navbar.css'

//Globals
const LOCAL_STORAGE_KEY = 'mmgps.credentials';
const ENCRYPT_KEY = process.env.CRYPTO_SECRET;


let storedUser =JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
if (!storedUser) storedUser = '';

    


const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(() => {});
    const navigate = useNavigate();

    useEffect(() => !loggedIn ? navigate('login') : navigate('/'), [loggedIn]);
    

    const handleLogin = (name, email, token, save, password) => {
        setUser({name, email, token});
        setLoggedIn(true);
        if (save && storedUser.email !== email) {
            console.log (password);
            const encryptedPW = AES.encrypt(password, ENCRYPT_KEY).toString();
            console.log (encryptedPW);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ email, password: encryptedPW }));
        }
    }

    const logout = () => {
        localStorage.clear();
        storedUser = '';
        setUser({});
        setLoggedIn(false);
        navigate('login');
    }


    //ROUTES
    const Home = () => {
        return (
            <div>
                <NavBar user={user} logout={logout} />
            </div>
        )
    }

    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='login/*' element={<Login handleLogin={handleLogin} storedUser={storedUser} />} />
        </Routes>
    ) 
}


export { App };