import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./clearisNavbar.css";
import { Link, NavLink } from 'react-router-dom'; 

const ClearisNavbar = ({ isLoggedIn, username, onLogout }) => {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary navbar-clearis">
        <Container>
         
          <Navbar.Brand as={Link} to="/">
            <img src="src/assets/img/logo-clearis.png" alt="Clearis Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto main-font">
              <Nav.Link as={Link} to="/">INICIO</Nav.Link>
              <Nav.Link as={Link} to="/nosotros">NOSOTROS</Nav.Link>
              <Nav.Link as={Link} to="/servicios">SERVICIOS</Nav.Link>
              <Nav.Link as={Link} to="/contacto">CONTACTO</Nav.Link>

              {isLoggedIn ? (
                <NavDropdown title={`${username}`} id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/miPerfil">Perfil</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/programar-turnos">Sacar Turno</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/misturnos">Mis Turnos</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">LOGIN</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default ClearisNavbar;