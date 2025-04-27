import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const ClearisNavbar = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar-clearis">
      <Container>
        <Navbar.Brand href="#home"><img src="src/assets/img/logo-clearis.png" alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse class="d-flex" id="basic-navbar-nav">
          <Nav className="main-font">
            <Nav.Link href="#home">INICIO</Nav.Link>
            <Nav.Link href="#link">NOSOTROS</Nav.Link>
            <Nav.Link href="#link">SERVICIOS</Nav.Link>
            <Nav.Link href="#link">CONTACTO</Nav.Link>
            <Nav.Link href="#link">LOGIN</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default ClearisNavbar