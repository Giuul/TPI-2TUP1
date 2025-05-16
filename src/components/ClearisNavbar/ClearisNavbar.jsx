import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./clearisNavbar.css";
const ClearisNavbar = () => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar-clearis">
      <Container>
        <Navbar.Brand href="/"><img src="src/assets/img/logo-clearis.png" alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto main-font">
            <Nav.Link href="/">INICIO</Nav.Link>
            <Nav.Link href="/nosotros">NOSOTROS</Nav.Link>
            <Nav.Link href="/servicios">SERVICIOS</Nav.Link>
            <Nav.Link href="/contacto">CONTACTO</Nav.Link>
            <Nav.Link href="/login">LOGIN</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default ClearisNavbar