import React, { Component } from 'react';
import ReactImageMagnify from 'react-image-magnify';     

import ReactSlick from 'react-slick';

const ProductImageZoom = (props) => {

        const rimProps = props.rimProps
        const rsProps = props.rsProps

        const frontSrcSet = [
            { src: props.main_image, setting: '1426w' }
        ]

        const dataSource = [
            {
                srcSet: frontSrcSet,
                small: props.main_image,
                large: props.main_image
            }
        ];

        if(props.images?.length > 0){
            props.images.forEach(element => {

                dataSource.push({
                    srcSet: [{src: element.original, setting: '1426w'}],
                    small: element.original,
                    large: element.original
                })

            })
        }

            return (
                <>
                        <ReactSlick
                            {...{
                                customPaging: function (i) {
                                    return (
                                            <a>
                                                <img
                                                src={dataSource[i].small}
                                                //   style={{   width:'300px', height:'70px'}}
                                                //   marginTop:'70px',
                                                //   height="100%"
                                                //   width="100%"
                                                //   alt={dataSource[i]}
                                                />
                                            </a>
                                    );
                                },
                                // // vertical: true,
                                // lazyLoad: true,
                                // // verticalSwiping: true,
                                // // fade: true,
                                // // autoplay: true,
                                // // autoplaySpeed: 2000,
                                // cssEase: "linear",

                                dots: true,
                                dotsClass: "slick-dots product-image-dots slick-thumb ",
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }}
                            {...rsProps}
                        >

                            
                            {dataSource.map((src, index) => (

                                <div key={index}>
                                    <ReactImageMagnify
                                        {...{
                                            smallImage: {
                                                // isFluidWidth: true,
                                                src: src.small,
                                                srcSet: src.srcSet,
                                                height: 700,
                                                width: 700,
                                                sizes: '(max-width: 480px) 10vw, (max-width: 1200px) 10vw, 360px'
                                            },
                                            largeImage: {
                                                src: src.large,
                                                width: 1800,
                                                height: 2200
                                            },
                                            lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' }
                                        }}
                                        {...rimProps}
                                    />
                                </div>
                            ))} 
                        </ReactSlick>
                      <div>

                    </div>
                </>
            );
        }
    
    

export default ProductImageZoom;