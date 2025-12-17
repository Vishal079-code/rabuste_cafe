import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  return (
    <header className="top-bar">
      <NavLink to="/" className="logo">
        Rabuste
      </NavLink>
      <nav className="chip-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/why-robusta"
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Why Robusta
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Menu
        </NavLink>
        <NavLink
          to="/art"
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Art
        </NavLink>
        <NavLink
          to="/workshops"
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Workshops
        </NavLink>
        <NavLink
          to="/franchise"
          className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
        >
          Franchise
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;

