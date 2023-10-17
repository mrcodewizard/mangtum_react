import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import ntfoundimg from '../components/img/404.png';
const Pagenotfound = () => {
  return (
    <div className='not-found col-md-6 offset-md-3' >
      <img src={ntfoundimg} className="img-fluid" title="" alt="" />
      <div className='not-found col-md-6 offset-md-3' style={{ 'line-height': '35px' }} >
        <p style={{ 'margin-top': '40px' }}>We're sorry, but the product you are looking for is currently unavailable. Please check back later <br /> or <br /> <strong><span className="explore-more">

          <Link to="/">
            <div className="waviy">
              <span style={{ '--i': '1' }}>E</span>
              <span style={{ '--i': '2' }}>X</span>
              <span style={{ '--i': '3' }}>P</span>
              <span style={{ '--i': '4' }}>L</span>
              <span style={{ '--i': '5' }}>O</span>
              <span style={{ '--i': '6' }}>R</span>
              <span style={{ '--i': '7' }}>E</span>
            </div>
          </Link></span></strong></p>

      </div>
    </div>
  );
}

export default Pagenotfound;
