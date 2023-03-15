import './App.css';
import Header from "./Header";
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import { Route, Routes, Navigate } from 'react-router-dom';
import Authentication from '../Authentication';
import { useState } from 'react';
import LoginContext from '../contexts/LoginContext';


export default function App() {


    const [logged, setLogged] = useState(false);

    return (
        <div className={`app ${logged ? 'gradientBG' : ''}`}>
            <LoginContext.Provider value={{ logged, setLogged }}>
                <Header />
                <div className='pagesContainer'>
                    <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='*' element={<Navigate to={'/'} />} />

                        <Route path='/signup' element={<Signup />} />

                        <Route element={<Authentication redirectTo={'/'} />}>
                            <Route path='/home' element={<Home />} />
                        </Route>

                    </Routes>
                </div>
            </LoginContext.Provider>
        </div >
    )
}