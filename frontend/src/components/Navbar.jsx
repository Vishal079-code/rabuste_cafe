import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ================= GSAP HOVER EFFECT ================= */
  useEffect(() => {
  const ctx = gsap.context(() => {
    const buttons = document.querySelectorAll(".nav-button");

    buttons.forEach((btn) => {
      const orb = btn.querySelector(".hover-orb");
      const text = btn.querySelector(".nav-text");
      if (!orb) return;

      // 🔥 FORCE INITIAL STATE EVERY TIME
      gsap.set(orb, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
      });

      gsap.set(btn, {
        scale: 1,
        boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
      });

      const xTo = gsap.quickTo(orb, "x", {
        duration: 0.3,
        ease: "power3.out",
      });

      const yTo = gsap.quickTo(orb, "y", {
        duration: 0.3,
        ease: "power3.out",
      });

      const move = (e) => {
        const rect = btn.getBoundingClientRect();
        xTo(e.clientX - rect.left - rect.width / 2);
        yTo(e.clientY - rect.top - rect.height / 2);

        gsap.to(orb, {
          scale: 1.6,
          opacity: 1,
          duration: 0.25,
          overwrite: "auto",
        });

        gsap.to(btn, {
          scale: 1.08,
          boxShadow: "0 0 35px rgba(216,107,50,0.6)",
          duration: 0.25,
          overwrite: "auto",
        });

        if (text) {
          gsap.to(text, {
            color: "#fff",
            duration: 0.25,
            overwrite: "auto",
          });
        }
      };

      const leave = () => {
        gsap.to(orb, {
          scale: 0,
          opacity: 0,
          duration: 0.35,
          overwrite: "auto",
        });

        gsap.to(btn, {
          scale: 1,
          boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
          duration: 0.35,
          overwrite: "auto",
        });

        if (text) {
          gsap.to(text, {
            color: "#f5efe8",
            duration: 0.25,
            overwrite: "auto",
          });
        }
      };

      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseleave", leave);

      btn._cleanup = () => {
        btn.removeEventListener("mousemove", move);
        btn.removeEventListener("mouseleave", leave);
      };
    });
  });

  return () => {
    document
      .querySelectorAll(".nav-button")
      .forEach((btn) => btn._cleanup?.());

    ctx.revert(); // 🔥 CRITICAL
  };
}, [location.pathname]);

  /* ================= NAV ITEM ================= */
  const NavItem = ({ to, children, end }) => (
    <div className="nav-wrap">
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `nav-button ${isActive ? "active" : ""}`
        }
      >
        <span className="nav-text">{children}</span>
        <span className="hover-orb" />
      </NavLink>
    </div>
  );

  return (
    <header className="top-bar">
      <NavLink to="/" className="logo">
        Rabuste
      </NavLink>

      <nav className="chip-nav">
        <NavItem to="/" end>Home</NavItem>
        <NavItem to="/why-robusta">Why Robusta</NavItem>
        <NavItem to="/menu">Menu</NavItem>
        <NavItem to="/art">Art</NavItem>
        <NavItem to="/workshops">Workshops</NavItem>
        <NavItem to="/franchise">Franchise</NavItem>

        {!user && (
          <>
            <NavItem to="/login">Login</NavItem>
            <NavItem to="/signup">Signup</NavItem>
          </>
        )}

        {user?.role === "admin" && (
          <NavItem to="/admin">Admin</NavItem>
        )}

        {user && (
          <button className="nav-button outline" onClick={handleLogout}>
            <span className="nav-text">Logout</span>
            <span className="hover-orb" />
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
