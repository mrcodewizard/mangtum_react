import React from 'react'
import { images } from '../../../utils/images'

const Companies = () => {
  return (
    <section className='section-y'>
        <div className='container'>
        <h4 className='companies-text'>Trusted By Over 4000 Big Companies</h4>
        <ul className='companies'>
            <li><img src={images['logo1.png']} alt=""/></li>
            <li><img src={images['logo2.png']} alt=""/></li>
            <li><img src={images['logo3.png']} alt=""/></li>
            <li><img src={images['logo4.png']} alt=""/></li>
            <li><img src={images['logo5.png']} alt=""/></li>
            <li><img src={images['logo6.png']} alt=""/></li>
        </ul>
    </div>
    </section>
  )
}

export default Companies