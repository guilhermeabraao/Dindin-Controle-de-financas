import './home.css';
import filterIcon from '../../assets/filter-icon.svg'
import Filter from './Filter';
import Transactions from './Transactions';
import { useEffect, useRef, useState } from 'react';
import AddTransaction from './AddTransation';
import { Navigate } from 'react-router-dom';
import { api } from '../../api/api';
import orderIcon from '../../assets/order-icon.svg'

export default function Home() {

    const [resume, setResume] = useState({});
    const [addTransactionWindow, setAddTransactionWindow] = useState(false);
    const [openFilter, setOpenFilter] = useState(false)
    const [categories, setCategories] = useState();
    const [categoriesFilter, setCategoriesFilter] = useState(null);
    const [transactionOrder, setTransactionOrder] = useState('asc');
    const orderRef = useRef();

    async function loadCategories() {
        const { data } = await api.get('/categoria', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setCategories(data);
    }

    function handleDateOrdanation() {
        if (transactionOrder === 'asc') {
            setTransactionOrder('desc');
            orderRef.current.style.transform = 'rotate(180deg)'

        } else {
            setTransactionOrder('asc')
            orderRef.current.style.transform = ''
        }
    }

    useEffect(() => {
        loadCategories();
    }, [])

    return (
        <div className='homeContainer'>
            <button className='filterBtn' onClick={() => setOpenFilter(!openFilter)}>
                <img src={filterIcon} alt='filter' />
                <span>Filtrar</span>
            </button>
            <main className='mainHome'>
                <div className='filterTransactionDiv'>
                    {openFilter && <Filter categories={categories} setCategoriesFilter={setCategoriesFilter} />}
                    <div className='transactionsDiv'>
                        <div className='transactionBar'>
                            <div className='strongBarDiv'>
                                <label className='dateLabel' onClick={() => handleDateOrdanation()}>Data
                                    <img className='orderIcon' alt='orderIcon' src={orderIcon} ref={orderRef} /></label>
                                <label className='dayLabel'>Dia da semana</label>
                                <label className='descriptionLabel'>Descrição</label>
                                <label className='categoryLabel'>Categoria</label>
                                <label className='valueLabel'>Valor</label>
                            </div>
                        </div>
                        <Transactions categories={categories} setResume={setResume} categoriesFilter={categoriesFilter} transactionOrder={transactionOrder} />
                    </div>
                </div>

            </main>
            <div className='resumeDiv'>
                <div className='resume'>
                    <strong>Resumo</strong>
                    <div className='inOutResume'>
                        <div className='inDiv'>
                            <label>Entradas</label>
                            <span className='inValueColor'>{`R$ ${resume.in > 0 ? resume.in / 100 + ',' + (resume.in % 100).toString().padEnd(2, '0') : '0,00'}`}</span>
                        </div>
                        <div className='outDiv'>
                            <label>Saídas</label>
                            <span className='outValueColor'>{`R$ ${resume.in > 0 ? resume.out / 100 + ',' + (resume.out % 100).toString().padEnd(2, '0') : '0,00'}`}</span>
                        </div>
                    </div>
                    <span className='grayLineSpan'></span>
                    <div className='balanceDiv'>
                        <label>Saldo</label>
                        <span className='balanceValueColor'>{`R$ ${(resume.in || resume.out) ? (resume.in - resume.out) / 100 + ',' + ((resume.in - resume.out) % 100).toString().padEnd(2, '0') : '0,00'}`}</span>
                    </div>

                </div>
                <button className='addtransaction' onClick={() => setAddTransactionWindow(true)}>Adicionar Registro</button>
            </div>
            {addTransactionWindow && <AddTransaction setAddTransactionWindow={setAddTransactionWindow} categories={categories} />}
            {(!localStorage.getItem('token')) && <Navigate to={'/'} />}
        </div>
    )
}