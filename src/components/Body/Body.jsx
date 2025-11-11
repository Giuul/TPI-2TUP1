import React from 'react';
import Slider from "react-slick";
import slideshowImg1 from '../../assets/img/imagen1-slideshow.jpg';
import slideshowImg2 from '../../assets/img/imagen2-slideshow.jpg';
import slideshowImg3 from '../../assets/img/imagen3-slideshow.jpg';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./body.css";

const Body = () => {
  const images = [slideshowImg1, slideshowImg2, slideshowImg3];

  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
    pauseOnHover: true,
  };

  return (
    <div className='bodyClearis'>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Homepage ${index}`} className="carousel-img" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Body;
