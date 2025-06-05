import "bootstrap-icons/font/bootstrap-icons.css";
import "./ClearisFooter.css";

const Footer = () => {
  return (
    <footer className="footer-clearis py-5 mt-5">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Logo + Contacto */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold mb-3">
              <i className="bi bi-stars me-2"></i>Clearis
            </h4>
            <p>Centro de depilación definitiva</p>
            <p><strong>Contáctanos</strong><br />CLEARIS@GMAIL.COM</p>
            <div className="footer-social-icons mt-3">
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* Menú */}
          <div className="col-md-4 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Menú</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="/">Inicio</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/contacto">Contacto</a></li>
              <li><a href="/login">Ingreso</a></li>
            </ul>
          </div>

          {/* Sucursales */}
          <div className="col-md-4 mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Sucursal</h6>
            <p className="footer-branches">
              Rosario, Santa Fe | España 1400
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="mb-0 small">
            &copy; {new Date().getFullYear()} Clearis. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;