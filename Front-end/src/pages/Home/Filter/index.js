import { useRef, useState } from 'react';
import './filter.css';

export default function Filter({ categories, setCategoriesFilter }) {

    const [filterArray, setFilterArray] = useState([]);
    const categoriesRef = useRef();

    function handleFilter(description, id) {
        const newArray = filterArray;

        if (!newArray.includes(description)) {
            newArray.push(description);
            categoriesRef.current.children[id - 1].children[1].innerText = 'x'
        } else {
            newArray.splice(filterArray.indexOf(description), 1)
            categoriesRef.current.children[id - 1].children[1].innerText = '+'
        }
        setFilterArray(newArray)
        categoriesRef.current.children[id - 1].classList.toggle('selectedBtn')

    }

    function handleCleanFilter() {

        const childNodes = categoriesRef.current.childNodes;
        childNodes.forEach((child) => {
            child.classList.remove('selectedBtn');
            if (child.children[1].innerText === 'x') {
                child.children[1].innerText = '+'
            }
        })

        setFilterArray([]);
        setCategoriesFilter(null);
    }

    function HandleApplyFilter() {
        let filterString = '';
        filterArray.forEach(filter => {
            if (filterString === '') {
                filterString += `filtro[]=${filter}`
            } else {
                filterString += `&filtro[]=${filter}`
            }
        })
        setCategoriesFilter(filterString)
    }

    return (
        <>
            {<div className='categoryDiv'>
                <span className='categoryDivSpan'>Categoria</span>
                <div className='categories' ref={categoriesRef}>
                    {categories.map((category) => (
                        <button className='category' key={category.id} onClick={() => handleFilter(category.descricao, category.id)}>
                            <span>{category.descricao}</span><span>+</span>
                        </button>
                    ))}
                </div>
                <div className='filterButtons'>
                    <button className='cleanFilterBtn' onClick={() => handleCleanFilter()}>Limpar Filtros</button>
                    <button className='applyFilterBtn' onClick={() => HandleApplyFilter()}>Aplicar Filtros</button>
                </div>
            </div>}
        </>
    )
}