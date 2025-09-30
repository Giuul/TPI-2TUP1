import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./clearisNavbar.css";
import logo from "../../assets/img/logo-clearis.png";

const ClearisNavbar = ({ isLoggedIn, username, onLogout, userRole }) => {
    return (
        <Navbar expand="lg" className="navbar-clearis" fixed="top">
            <div className="logo-left">
                <Link to="/">
                    <img src={logo} alt="Clearis Logo" />
                </Link>
            </div>

            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto main-font acme-regular-navbar">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
                        <Nav.Link as={Link} to="/servicios">Servicios</Nav.Link>
                        <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>

                        {isLoggedIn ? (
                            <NavDropdown title={`${username}`} id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/miPerfil">Perfil</NavDropdown.Item>
                                <NavDropdown.Divider />
                                {(userRole === 'admin' || userRole === 'superadmin') ? (
                                    <>
                                        <NavDropdown.Item as={Link} to="/users">Usuarios</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/misturnos">Turnos</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/admin-services">Servicios</NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown.Item as={Link} to="/programar-turnos">Sacar Turno</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to="/misturnos">Mis Turnos</NavDropdown.Item>
                                    </>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={onLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default ClearisNavbar;

