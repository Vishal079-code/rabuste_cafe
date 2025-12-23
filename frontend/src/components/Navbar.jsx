import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        {!user && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
            >
              Signup
            </NavLink>
          </>
        )}
        {user && user.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
          >
            Admin
          </NavLink>
        )}
        {user && (
          <button type="button" className="nav-button outline" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

