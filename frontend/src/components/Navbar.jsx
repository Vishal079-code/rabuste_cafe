import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Attach GSAP hover effect per button
  useEffect(() => {
    const btns = navRef.current.filter(Boolean);
    const cleanups = [];

    btns.forEach((btn) => {
      const orb = btn.querySelector(".hover-orb");
      if (!orb) return;

      const xTo = gsap.quickTo(orb, "x", { duration: 0.25, ease: "power3.out" });
      const yTo = gsap.quickTo(orb, "y", { duration: 0.25, ease: "power3.out" });

      const move = (e) => {
        const rect = btn.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);

        gsap.to(orb, {
          scale: 2.2,
          opacity: 1,
          background:
            "radial-gradient(circle, rgba(255,180,80,0.9) 0%, rgba(255,140,50,0.65) 40%, transparent 80%)",
          duration: 0.25,
          ease: "power3.out",
        });

        const text = btn.querySelector(".nav-text");
        if (text) gsap.to(text, { color: "#fff", duration: 0.25 });

        gsap.to(btn, {
          scale: 1.08,
          boxShadow: "0 0 35px rgba(216,107,50,0.6)",
          duration: 0.25,
        });
      };

      const leave = () => {
        gsap.to(orb, {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.out",
        });

        gsap.to(btn, {
          scale: 1,
          boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
          duration: 0.4,
        });

        const text = btn.querySelector(".nav-text");
        if (text) gsap.to(text, { color: "#f5efe8", duration: 0.25 });
      };

      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);

      cleanups.push(() => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [user]); // re-run if buttons change (login/logout)

  const NavItem = ({ to, children, end, index }) => (
    <NavLink
      to={to}
      end={end}
      ref={(el) => (navRef.current[index] = el)}
      className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}
    >
      <span className="nav-text">{children}</span>
      <span className="hover-orb" />
    </NavLink>
  );

  let i = 0;

  return (
    <header className="top-bar">
      <NavLink to="/" className="logo">
        Rabuste
      </NavLink>

      <nav className="chip-nav">
        <NavItem to="/" end index={i++}>Home</NavItem>
        <NavItem to="/why-robusta" index={i++}>Why Robusta</NavItem>
        <NavItem to="/menu" index={i++}>Menu</NavItem>
        <NavItem to="/art" index={i++}>Art</NavItem>
        <NavItem to="/workshops" index={i++}>Workshops</NavItem>
        <NavItem to="/franchise" index={i++}>Franchise</NavItem>

        {!user && (
          <>
            <NavItem to="/login" index={i++}>Login</NavItem>
            <NavItem to="/signup" index={i++}>Signup</NavItem>
          </>
        )}

        {user?.role === "admin" && (
          <NavItem to="/admin" index={i++}>Admin</NavItem>
        )}

        {user && (
          <button
            ref={(el) => (navRef.current[i++] = el)}
            className="nav-button outline"
            onClick={handleLogout}
          >
            <span className="nav-text">Logout</span>
            <span className="hover-orb" />
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
