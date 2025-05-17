import React from 'react'
import "./pages.css";
import ClearisNavbar from '../components/ClearisNavbar/ClearisNavbar';
import ClearisFooter from '../components/ClearisFooter/ClearisFooter';
import Schedule from '../components/Schedule/Schedule';

const Agenda = () => {
    return (
        <div>
            <ClearisNavbar />
            <Schedule />
            <ClearisFooter />
        </div>
    )
}

export default Agenda