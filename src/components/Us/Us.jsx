import React from "react";
import Slider from "react-slick";
import "./Us.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import imagen1 from '../../assets/img/image1-carouselUs.png';
import imagen2 from '../../assets/img/image2-carouselUs.png';
import imagen3 from '../../assets/img/image3-carouselUs.png';
import imagen4 from '../../assets/img/image4-carouselUs.png';

const Us = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: true,
        fade: true,
        adaptiveHeight: false,
    };

    return (
        <div className="us-carousel">
            <Slider {...settings}>
                <div className="us-slide">
                    <div className="us-overlay">
                        <div className="us-content">
                            <h1>¿Quiénes somos?</h1>
                            <p>
                                Clearis es un centro especializado en depilación definitiva que combina tecnología de
                                vanguardia con atención personalizada, en un ambiente cálido y profesional.
                            </p>
                            <p>
                                En Clearis creemos que tu piel merece lo mejor. Por eso, cada detalle de nuestros
                                tratamientos está pensado para brindarte resultados seguros, visibles y duraderos.
                            </p>
                            <p>
                                Nuestro objetivo es ofrecer una experiencia transformadora, brindando tratamientos
                                seguros, eficaces y adaptados a cada tipo de piel.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="us-slide">
                    <div className="us-overlay">
                        <div className="us-content">
                            <h1>¿Por qué elegirnos?</h1>
                            <div className="why-grid">
                                <div>
                                    <img src={imagen1} alt="Tecnología" className="icon-img" />
                                    <p>Tecnología de última generación</p>
                                </div>
                                <div>
                                    <img src={imagen2} alt="Profesionales" className="icon-img" />
                                    <p>Profesionales especializados</p>
                                </div>
                                <div>
                                    <img src={imagen3} alt="Ambiente" className="icon-img" />
                                    <p>Ambiente confortable y seguro</p>
                                </div>
                                <div>
                                    <img src={imagen4} alt="Resultados" className="icon-img" />
                                    <p>Resultados comprobados</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default Us;
