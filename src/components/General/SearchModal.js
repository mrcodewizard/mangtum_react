import React, { useState, useRef } from 'react'
// import AutoComplete from './AutoComplete'
import { useOnClickOutside } from '../../utils/customHooks';

const SearchModal = ({setShowModal, setSearchTerm, searchTerm, handleSearch}) => {
    const ref = useRef(null);
    useOnClickOutside(ref, () => setShowModal(false));
  return (
    <div className='overlay'>
        <div className='main-modal' ref={ref}>
            <input type='text' placeholder='Search Here' onChange={e=>setSearchTerm({clicked:false, value:e.target.value})} onKeyDown={e=>handleSearch(e)}/>
            {/* <AutoComplete searchTerm={searchTerm} setSearchTerm={setSearchTerm}/> */}
        </div>
</div>
  )
}

export default SearchModal