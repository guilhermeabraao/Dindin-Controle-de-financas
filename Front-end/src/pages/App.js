import './App.css';
import Header from "./Header";
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Authentication from '../Authentication';


export default function App() {

    const [logged, setLogged] = useState(false);


    return (
        <div className={`app ${logged ? 'gradientBG' : ''}`}>
            <Header logged={logged} setLogged={setLogged} />
            <div className='pagesContainer'>
                <Routes>
                    <Route path='/' element={<Login logged={logged} setLogged={setLogged} />} />
                    <Route path='/login' element={<Login logged={logged} setLogged={setLogged} />} />
                    <Route path='*' element={<Navigate to={'/'} />} />

                    <Route path='/signup' element={<Signup />} />

                    <Route element={<Authentication redirectTo={'/'} />}>
                        <Route path='/home' element={<Home />} />
                    </Route>

                </Routes>
            </div>
        </div>
    )
}