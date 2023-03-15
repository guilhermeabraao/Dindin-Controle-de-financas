import './login.css';
import { Link, Navigate } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { api } from '../../api/api';
import LoginContext from '../../contexts/LoginContext';

export default function Login() {

    const { logged, setLogged } = useContext(LoginContext);
    const emailRef = useRef();
    const passwordRef = useRef();
    const errorRef = useRef();

    async function handleLogin(e) {
        e.stopPropagation();
        e.preventDefault();

        clearError();

        const email = emailRef.current.value;
        const senha = passwordRef.current.value;

        if (email === '') {
            errorRef.current.innerText = 'E-mail obrigatório!'
            emailRef.current.classList.add('errorLabel')
            return;
        }

        if (senha === '') {
            errorRef.current.innerText = 'Senha obrigatória!'
            passwordRef.current.classList.add('errorLabel')
            return;
        }

        try {
            const { data } = await api.post('/login', {
                email,
                senha
            })


            localStorage.setItem('token', data.token);
            localStorage.setItem('userID', data.usuario.id);
            localStorage.setItem('userName', data.usuario.nome);
            localStorage.setItem('userEmail', data.usuario.email);

            setLogged(true);

        } catch (error) {
            console.log(error.message)
            errorRef.current.innerText = 'Usuário ou senha incorretos!'
        }
    }

    function clearError() {
        emailRef.current.classList.remove('errorLabel')
        passwordRef.current.classList.remove('errorLabel')
        errorRef.current.innerText = ''
    }

    return (
        <main className='loginContainer'>
            <div className='text'>
                <h1>Controle suas <strong>finanças</strong>, sem planilha chata.</h1>
                <span>Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você tem tudo num único lugar e em um clique de distância.</span>
                <Link to={'/signup'} className='linkStyle'>
                    <button className='cadastrese'>Cadastre-se</button>
                </Link>

            </div>
            <div className='login'>
                <form>
                    <span className='loginTitle'>Login</span>
                    <div className='divInputs'>
                        <div className='divLabelInput'>
                            <label className='formLabel'>E-mail</label>
                            <input type={'email'} className='formInput' ref={emailRef}></input>
                        </div>
                        <div className='divLabelInput'>
                            <label className='formLabel'>Password</label>
                            <input type={'password'} className='formInput' ref={passwordRef}></input>
                        </div>
                    </div>
                    <span className='errorMessage errorLogin' ref={errorRef}></span>
                    <button className='loginButton' onClick={(e) => handleLogin(e)}>Entrar</button>
                </form>
            </div>
            {logged && <Navigate to={'/home'} />}
        </main>
    )
}