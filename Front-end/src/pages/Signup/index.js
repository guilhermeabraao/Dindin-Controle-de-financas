import './signup.css';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../../api/api';
import { useRef, useState } from 'react';

export default function Signup() {

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const errorRef = useRef();
    const [success, setSuccess] = useState(false)

    async function handleSignup(e) {
        e.stopPropagation();
        e.preventDefault();

        clearError();

        const nome = nameRef.current.value;
        const email = emailRef.current.value;
        const senha = passwordRef.current.value;
        const confirmacaoSenha = passwordConfirmationRef.current.value;

        if (nome === '') {
            errorRef.current.innerText = 'Nome obrigatório!'
            nameRef.current.classList.add('errorLabel')
            return;
        }

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

        if (confirmacaoSenha === '') {
            errorRef.current.innerText = 'Confirme a senha!'
            passwordConfirmationRef.current.classList.add('errorLabel')
            return;
        }

        if (senha !== confirmacaoSenha) {
            errorRef.current.innerText = 'Senhas não coincidem!'
            passwordRef.current.classList.add('errorLabel')
            passwordConfirmationRef.current.classList.add('errorLabel')
            return;
        }

        try {

            const { data } = await api.post('/usuario', {
                nome,
                email,
                senha
            })

            if (data) {
                setSuccess(true);
                return;
            }

        } catch (error) {
            console.log(error.message)
            errorRef.current.innerText = 'E-mail já cadastrado!'
        }

    }

    function clearError() {
        nameRef.current.classList.remove('errorLabel')
        emailRef.current.classList.remove('errorLabel')
        passwordRef.current.classList.remove('errorLabel')
        passwordConfirmationRef.current.classList.remove('errorLabel')
        errorRef.current.innerText = ''
    }

    return (
        <main className='signupContainer'>
            <form className='signupForm'>
                <h1 className='signupH1'>Cadastre-se</h1>

                <div className='divInputs'>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Nome</label>
                        <input className='formInput' ref={nameRef}></input>
                    </div>

                    <div className='divLabelInput'>
                        <label className='formLabel'>E-mail</label>
                        <input className='formInput' ref={emailRef}></input>
                    </div>

                    <div className='divLabelInput'>
                        <label className='formLabel'>Senha</label>
                        <input className='formInput'
                            ref={passwordRef}></input>
                    </div>

                    <div className='divLabelInput'>
                        <label className='formLabel'>Confirmação de senha</label>
                        <input className='formInput' ref={passwordConfirmationRef}></input>
                    </div>
                </div>
                <span className='errorMessage errorSignup' ref={errorRef}></span>

                <div className='divButton'>
                    <button className='signupButton' onClick={(e) => handleSignup(e)}>Cadastrar</button>
                    <Link to={'/'} className='linkStyle'>
                        <span>Já tem cadastro? Clique aqui!</span>
                    </Link>
                    {success && <Navigate to='/login' />}

                </div>
            </form>

        </main>
    )
}