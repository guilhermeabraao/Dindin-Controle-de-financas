import './header.css';
import logo from '../../assets/logo.svg';
import profile from '../../assets/profile.svg';
import logoutIcon from '../../assets/logout.svg';
import Profile from './Profile';
import { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { validateLogin } from '../../Authentication';
import LoginContext from '../../contexts/LoginContext';

export default function Header() {
    const { logged, setLogged } = useContext(LoginContext);
    const [profileWindow, setProfileWindow] = useState(false);
    const [logout, setLogout] = useState(false);


    useEffect(() => {
        if (localStorage.getItem('token') && logged === false) {
            setLogged(validateLogin())
        }
    })



    function handleLogout(e) {
        e.stopPropagation();
        e.preventDefault();
        localStorage.clear();
        setLogged(false);
        setLogout(true);
        setLogout(false);
    }

    return (
        <header>
            <div className='logo'>
                <img src={logo} alt='logo' />
                <span>Dindin</span>
            </div>
            <div className='profileArea'>
                {logged && <>
                    <img src={profile} className='profileIcon' alt='profile' onClick={() => setProfileWindow(true)} />
                    <span className='nomeUsuario' >{localStorage.getItem('userName')}</span>
                    <img src={logoutIcon} alt='logout' onClick={(e) => handleLogout(e)} />
                </>}
            </div>
            {profileWindow && <Profile setProfileWindow={setProfileWindow} />}
            {logout && <Navigate to='/' />}
        </header>
    )
}