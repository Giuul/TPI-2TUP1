import React from 'react'
import "./pages.css";
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import Schedule from '../components/Schedule/Schedule';

const Agenda = () => {
    return (
        <div>
            <Schedule />
            <ClearisFooter />
        </div>
    )
}

export default Agenda;