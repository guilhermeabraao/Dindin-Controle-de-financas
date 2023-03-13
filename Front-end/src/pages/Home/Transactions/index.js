import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import './transactions.css'
import editIcon from '../../../assets/edit-icon.svg';
import deleteIcon from '../../../assets/delete-icon.svg';
import { useState, useRef, useEffect } from 'react';
import EditTransaction from './EditTransaction';
import { api } from '../../../api/api';


export default function Transactions({ categories, setResume, categoriesFilter, transactionOrder }) {

    const [transactions, setTransactions] = useState([]);
    const [editTransactionWindow, setEditTransactionWindow] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState({})
    const [openDeleteMessage, setOpenDeleteMessage] = useState(false)
    const deleteMessageRef = useRef();
    const deleteIdRef = useRef();

    async function loadTransactions() {

        try {
            let transactionResponse;
            if (!categoriesFilter) {
                transactionResponse = await api.get('/transacao', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else {
                transactionResponse = await api.get(`/transacao?${categoriesFilter}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }



            const transactions = transactionResponse.data;
            if (transactionOrder === 'asc') {
                transactions.sort((a, b) => new Date(a.data) - new Date(b.data))
            } else {
                transactions.sort((a, b) => new Date(b.data) - new Date(a.data))
            }

            const resumeResponse = await api.get('/transacao/extrato', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const resume = {
                in: resumeResponse.data.entrada,
                out: resumeResponse.data.saida
            }


            setResume(resume);
            setTransactions(transactions)

        } catch (error) {
            console.log(error.message)
        }
    }


    function handleEdit(transaction) {
        setTransactionToEdit(transaction);
        setEditTransactionWindow(true);
    }

    function handleDeleteMessage(e, id) {

        deleteIdRef.current = id;
        deleteMessageRef.current.style.visibility = openDeleteMessage ? 'hidden' : 'visible'
        setOpenDeleteMessage(!openDeleteMessage);
        const top = e.clientY - 105;
        deleteMessageRef.current.style.top = `${top}px`;
    }

    async function handleDeleteTransaction() {

        try {
            await api.delete(`/transacao/${deleteIdRef.current}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            deleteMessageRef.current.style.visibility = 'hidden';
            setOpenDeleteMessage(!openDeleteMessage);

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        loadTransactions();
    })

    return (
        <>
            {transactions.map((transaction) => (

                <div key={transaction.id} className='transactionBar transactionDetailDiv'>
                    <label className='dateLabel'>{format(new Date(transaction.data), "dd/MM/yy",)}</label>
                    <label className='dayLabel'>
                        {format(new Date(transaction.data), 'EEEE', { locale: ptBR }).split('-')[0].charAt(0).toUpperCase() + format(new Date(transaction.data), 'EEEE', { locale: ptBR }).split('-')[0].slice(1)}
                    </label>
                    <label className='descriptionLabel'>{transaction.descricao}</label>
                    <label className='categoryLabel'>{transaction.categoria_nome}</label>
                    <label className={`valueLabel ${transaction.tipo === 'entrada' ? 'inValueColor' : 'outValueColor'}`}>{`R$ ${transaction.valor / 100 + ',' + (transaction.valor % 100).toString().padEnd(2, '0')}`}</label>
                    <div className='editDeleteDiv'>
                        <img src={editIcon} alt='editIcon' onClick={() => handleEdit(transaction)} />
                        <img src={deleteIcon} alt='deleteIcon' onClick={(e) => handleDeleteMessage(e, transaction.id)} />
                    </div>
                </div>

            ))
            }
            <div className='deleteMessageDiv' ref={deleteMessageRef}>
                {openDeleteMessage && <div className='deleteBG'>
                    <button className='confirmationDeleteBtn' onClick={() => handleDeleteTransaction()}></button>
                    <button className='confirmationDeleteBtn' onClick={(e) => handleDeleteMessage(e)}></button>
                </div>}
            </div>
            {editTransactionWindow && <EditTransaction setEditTransactionWindow={setEditTransactionWindow} categories={categories} transactionToEdit={transactionToEdit} />}
        </>
    )
}