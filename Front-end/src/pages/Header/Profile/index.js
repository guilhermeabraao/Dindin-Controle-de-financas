import './profile.css';
import close from '../../../assets/close.svg'
import { useEffect, useRef } from 'react';
import { api } from '../../../api/api';

export default function Profile({ setProfileWindow }) {

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const errorRef = useRef();

    useEffect(() => {
        nameRef.current.value = localStorage.getItem('userName');
        emailRef.current.value = localStorage.getItem('userEmail')
    }, [setProfileWindow])


    async function handleEditProfile(e) {
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

            await api.put('/usuario', {
                nome,
                email,
                senha
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            localStorage.setItem('userName', nome);
            localStorage.setItem('userEmail', email);
            setProfileWindow(false)

        } catch (error) {
            console.log(error.message)
            errorRef.current.innerText = 'já existe um usuário com este e-mail!'
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
        <div className='profileBackgroundDiv'>
            <form className='profileForm'>
                <div className='titleDiv'>
                    <h1>Editar Perfil</h1>
                    <img src={close} alt='profile' onClick={() => setProfileWindow(false)} />
                </div>

                <div className='divInputs'>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Nome</label>
                        <input type={'text'} className='formInput' ref={nameRef}></input>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>E-mail</label>
                        <input type={'email'} className='formInput' ref={emailRef}></input>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Senha</label>
                        <input type={'password'} className='formInput' ref={passwordRef}></input>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Confirmação de senha</label>
                        <input type={'password'} className='formInput' ref={passwordConfirmationRef}></input>
                    </div>

                </div>
                <div className='errorMessage'>
                    <span ref={errorRef}></span>
                </div>
                <div className='divButton'>
                    <button className='editProfileButton' onClick={(e) => handleEditProfile(e)}>Confirmar</button>
                </div>
            </form>
        </div>
    )
}