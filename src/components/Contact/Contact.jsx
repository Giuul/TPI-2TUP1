import React from "react";
import "./contact.css";

const Contact = () => {
    return (

        <div className='contactDiv'>
            <div className='map'>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3347.948912909051!2d-60.65095782393197!3d-32.95235817217789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab13a391fb3d%3A0xe872a1c906f37291!2sEspa%C3%B1a%201400%2C%20S2000%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1759074436873!5m2!1ses-419!2sar"
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '15px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <div className='infoBox'>
                <p className='pDateContact'>ESPAÑA 1400, ROSARIO, SANTA FE</p>
                <p className='pDateContact'>CLEARIS@GMAIL.COM</p>
                <p className='pDateContact'>+3413768965</p>
                <p className='pDateContact'>LUNES A SABADO 08:00 A 20:00HS</p>
            </div>
        </div>


    )
};

export default Contact;