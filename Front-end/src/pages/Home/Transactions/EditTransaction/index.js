import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../api/api";
import close from '../../../../assets/close.svg'
import './editTransaction.css';

export default function EditTransaction({ setEditTransactionWindow, categories, transactionToEdit }) {

    const [selectedDiv, setSelectedDiv] = useState('in');
    const [formRender, setFormRender] = useState('false')
    const valueRef = useRef();
    const categoryRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();
    const transactionIdRef = useRef();
    const errorRef = useRef();


    async function handleEditTransaction(e) {
        e.stopPropagation();
        e.preventDefault();
        clearError();

        const categoria_id = categoryRef.current.value;
        const data = dateRef.current.value;
        const descricao = descriptionRef.current.value;
        const valor = valueRef.current.value;
        const tipo = selectedDiv === 'in' ? 'entrada' : 'saida';

        if (valor === '') {
            errorRef.current.innerText = 'Valor obrigatório!'
            valueRef.current.classList.add('errorLabel')
            return;
        }
        if (categoria_id === '') {
            errorRef.current.innerText = 'Categoria obrigatória!'
            categoryRef.current.classList.add('errorLabel')
            return;
        }
        if (data === '') {
            errorRef.current.innerText = 'Escolha uma data!'
            dateRef.current.classList.add('errorLabel')
            return;
        }
        if (descricao === '') {
            errorRef.current.innerText = 'Descrição obrigatória!'
            descriptionRef.current.classList.add('errorLabel')
            return;
        }


        try {


            const response = await api.put(`/transacao/${transactionIdRef.current}`, {
                tipo,
                descricao,
                valor,
                data,
                categoria_id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        } catch (error) {
            console.log(error.message)
        }

        setEditTransactionWindow(false)
    }

    function clearError() {
        dateRef.current.classList.remove('errorLabel')
        valueRef.current.classList.remove('errorLabel')
        descriptionRef.current.classList.remove('errorLabel')
        categoryRef.current.classList.remove('errorLabel')
        errorRef.current.innerText = ''
    }


    useEffect(() => {
        if (transactionToEdit.tipo === 'saida') {
            setSelectedDiv('out')
        }
        transactionIdRef.current = transactionToEdit.id;
        setFormRender(true);


    }, [])

    return (
        <div className='editBackgroundDiv'>
            {formRender && <form className='transactionForm'>
                <div className='titleDiv'>
                    <h1>Editar Registro</h1>
                    <img src={close} onClick={() => setEditTransactionWindow(false)} />
                </div>
                <div className='inOutDivs'>
                    <div className={`inOutDiv ${selectedDiv === 'in' ? 'inSelectedColor' : ''}`} onClick={() => setSelectedDiv('in')}>
                        <span>Entrada</span>
                    </div>
                    <div className={`inOutDiv ${selectedDiv === 'out' ? 'outSelectedColor' : ''}`} onClick={() => setSelectedDiv('out')}>
                        <span>Saída</span>
                    </div>
                </div>
                <div className='errorMessage errorAddMessage'>
                    <span className=' ' ref={errorRef}></span>

                </div>
                <div className='divInputs'>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Valor</label>
                        <input type={'number'} className='formInput' ref={valueRef} defaultValue={transactionToEdit.valor}></input>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Categoria</label>
                        <select className='formInput' ref={categoryRef}>
                            {categories.map((category) => (
                                category.descricao === transactionToEdit.categoria_nome ?
                                    <option value={category.id} key={category.id} selected>{category.descricao}</option>
                                    :
                                    <option value={category.id} key={category.id}>{category.descricao}</option>

                            ))}

                        </select>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Data</label>
                        <input type={'date'} className='formInput' ref={dateRef} defaultValue={format(new Date(transactionToEdit.data), "yyyy-MM-dd")}></input>
                    </div>
                    <div className='divLabelInput'>
                        <label className='formLabel'>Descrição</label>
                        <input type={'text'} className='formInput' ref={descriptionRef} defaultValue={transactionToEdit.descricao}></input>
                    </div>


                </div>
                <div className='divButton'>
                    <button className='editProfileButton' onClick={(e) => handleEditTransaction(e)}>Confirmar</button>
                </div>
            </form>}
        </div>
    )
}