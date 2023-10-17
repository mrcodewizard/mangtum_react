import React, { useEffect } from "react";
import "swiper/css";
// import Swiper, { Navigation, Pagination } from 'swiper';
import "swiper/css/navigation";
import "swiper/css/pagination";
import ThemeBreadcrumb from "../components/common/ThemeBreadcrumb";

const Productdetail = () => {
  return (
    <>
      <main>
        <ThemeBreadcrumb title="Product Name" current_route="Product Name" />

        <section className="single-wrapper section-wrapper">
          <div className="container">
            <div className="row product-detail-wrap">
              <div className="col-md-5">
                <div className="zoom_product">
                  <div
                    style="--swiper-navigation-color: #fff; --swiper-pagination-color: #fff"
                    className="swiper swipe-main"
                  >
                    <ul className="swiper-wrapper" id="prodctglr">
                      <li
                        className="swiper-slide"
                        data-src="assets/img/product-cover-1.png"
                      >
                        <a href="#" className="gallery-item">
                          <img src="assets/img/product-cover-1.png" />
                        </a>
                      </li>
                      <li
                        className="swiper-slide"
                        data-src="assets/img/product-cover-2.png"
                      >
                        <a href="" className="gallery-item">
                          <img src="assets/img/product-cover-2.png" />
                        </a>
                      </li>
                      <li
                        className="swiper-slide"
                        data-src="assets/img/product-cover-3.png"
                      >
                        <a href="" className="gallery-item">
                          <img src="assets/img/product-cover-3.png" />
                        </a>
                      </li>
                      <li
                        className="swiper-slide"
                        data-src="assets/img/product-cover-4.png"
                      >
                        <a href="" className="gallery-item">
                          <img src="assets/img/product-cover-4.png" />
                        </a>
                      </li>
                      <li
                        className="swiper-slide"
                        data-src="assets/img/product-cover-2.png"
                      >
                        <a href="" className="gallery-item">
                          <img src="assets/img/product-cover-2.png" />
                        </a>
                      </li>
                    </ul>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                  </div>
                  <div thumbsSlider="" className="swiper swipe-slide">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <img src="assets/img/product-cover-1.png" />
                      </div>
                      <div className="swiper-slide">
                        <img src="assets/img/product-cover-2.png" />
                      </div>
                      <div className="swiper-slide">
                        <img src="assets/img/product-cover-3.png" />
                      </div>
                      <div className="swiper-slide">
                        <img src="assets/img/product-cover-4.png" />
                      </div>
                      <div className="swiper-slide">
                        <img src="assets/img/product-cover-2.png" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- end  --> */}
              </div>
              <div className="col-md-7">
                <div className="product-detail">
                  <h3>Pearl Necklace</h3>
                  <div className="review">
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-fill"></i>
                    <i className="ri-star-half-fill"></i>
                    <span className="grey-text">10 Reviews</span>
                  </div>
                  <div className="priceTag">$1,139.33</div>
                  <div className="available">
                    Availability : <span className="text-green">In Stock</span>
                  </div>
                  <p>
                    Met minim Mollie non desert Alamo est sit cliquey dolor do
                    met sent. RELIT official consequent door ENIM RELIT Mollie.
                    Excitation venial consequent sent nostrum met.
                  </p>
                  <hr />
                  <div className="flex-action">
                    <a href="#link" className="btn btn-lg btn-warning">
                      <i className="ri-shopping-cart-line"></i> Add to Cart
                    </a>
                    <a href="#link" className="wishlist round-btn">
                      <i className="ri-heart-3-line"></i>
                    </a>
                    <a href="#link" className="view round-btn">
                      <i className="ri-eye-2-line"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
        {/* <!-- description  --> */}
        <section className="section-wrapper description">
          <div className="container">
            <div className="desc-tab">
              <ul className="nav nav-tabs" id="desTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="description-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#description"
                    type="button"
                    role="tab"
                    aria-controls="description"
                    aria-selected="true"
                  >
                    Description
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="information-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#information"
                    type="button"
                    role="tab"
                    aria-controls="information"
                    aria-selected="false"
                  >
                    Additional Information
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="review-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#review"
                    type="button"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                  >
                    Review <span className="text-green">(0)</span>
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="desTabContent">
                <div
                  className="tab-pane fade show active"
                  id="description"
                  role="tabpanel"
                  aria-labelledby="description-tab"
                >
                  <div className="row">
                    <div className="col-md-4">
                      <div className="des-img">
                        <img src="assets/img/description.png" title="" alt="" />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="description-content">
                        <h3>the quick fox jumps over </h3>
                        <p>
                          Met minim Mollie non desert Alamo est sit cliquey
                          dolor do met sent. RELIT official consequent door ENIM
                          RELIT Mollie. Excitation venial consequent sent
                          nostrum met.
                        </p>
                        <p>
                          Met minim Mollie non desert Alamo est sit cliquey
                          dolor do met sent. RELIT official consequent door ENIM
                          RELIT Mollie. Excitation venial consequent sent
                          nostrum met.
                        </p>
                        <p>
                          Met minim Mollie non desert Alamo est sit cliquey
                          dolor do met sent. RELIT official consequent door ENIM
                          RELIT Mollie. Excitation venial consequent sent
                          nostrum met.
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="description-content">
                        <h3>the quick fox jumps over </h3>
                        <ul className="list-unstyled">
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                        </ul>
                        <h3>the quick fox jumps over </h3>
                        <ul className="list-unstyled">
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                          <li>the quick fox jumps over the lazy dog</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="information"
                  role="tabpanel"
                  aria-labelledby="information-tab"
                >
                  <div className="description-content">
                    <h3>the quick fox jumps over </h3>
                    <p>
                      Met minim Mollie non desert Alamo est sit cliquey dolor do
                      met sent. RELIT official consequent door ENIM RELIT
                      Mollie. Excitation venial consequent sent nostrum met.
                    </p>
                    <p>
                      Met minim Mollie non desert Alamo est sit cliquey dolor do
                      met sent. RELIT official consequent door ENIM RELIT
                      Mollie. Excitation venial consequent sent nostrum met.
                    </p>
                    <p>
                      Met minim Mollie non desert Alamo est sit cliquey dolor do
                      met sent. RELIT official consequent door ENIM RELIT
                      Mollie. Excitation venial consequent sent nostrum met.
                    </p>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="review"
                  role="tabpanel"
                  aria-labelledby="review-tab"
                >
                  <div className="description-content">
                    <h3>the quick fox jumps over </h3>
                    <ul className="list-unstyled">
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                    </ul>
                    <h3>the quick fox jumps over </h3>
                    <ul className="list-unstyled">
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                      <li>the quick fox jumps over the lazy dog</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-wrapper featured bg-light">
          <div className="container">
            <div className="wrapper-header text-center mb-4">
              <h4 className="grey-text wow animated fadeInUp">
                More from this Seller
              </h4>
              <h3 className="wow animated fadeInUp" data-wow-delay="0.3s">
                Related Items
              </h3>
              <p className="wow animated fadeInUp">
                Problems trying to resolve the conflict between.
              </p>
            </div>
            {/* <!-- product  --> */}
            <div className="flex-product flexgrow">
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-1.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-2.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-3.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-4.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-5.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-4.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-3.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-2.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-4.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="product-row wow animated fadeInUp">
                  <div className="product-cover">
                    <img
                      src="assets/img/product-cover-5.png"
                      className="img-fluid"
                      title=""
                      alt=""
                    />
                  </div>
                  {/* <!-- product-cont  --> */}
                  <div className="product-content p-3">
                    <h4> Pearl Necklace</h4>
                    <div className="title grey-text mb-2">This Unique</div>
                    <div className="price">
                      <div className="grey-text">
                        $16.48 <span className="text-warning">$6.48</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- view all  --> */}
            <div className="btn-center text-center mt-4">
              <a href="#link" className="btn text-uppercase btn-warning btn-lg">
                View More Products
              </a>
            </div>
          </div>
        </section>

        <hr />
        {/* <!-- clients  --> */}
        {/* <section className="section-wrapper">
    <div className="container">
      <div className="clients-wrap">
        <h4 className="text-center">Trusted By Over 4000 Big Companies</h4>
        <div className="clientLogo">
          <a href="#link"><img src="assets/img/logo1.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo2.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo3.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo4.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo5.png" className="img-fluid" title="" alt=""/></a>
          <a href="#link"><img src="assets/img/logo6.png" className="img-fluid" title="" alt=""/></a>
        </div>
      </div>
    </div>
  </section> */}
      </main>
    </>
  );
};

export default Productdetail;
