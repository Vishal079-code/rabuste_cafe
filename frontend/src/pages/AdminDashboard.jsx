import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
  adminCreateArt,
  adminCreateMenu,
  adminCreateWorkshop,
} from '../services/api';

import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('menu');
  const sidebarRef = useRef(null);
  const tl = useRef(null);

  /* ===== FORMS ===== */
  const [menuForm, setMenuForm] = useState({ category: '', url: '', public_id: '' });
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: '',
    totalSeats: '',
  });
  const [artForm, setArtForm] = useState({
    title: '',
    artistName: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  /* ===== GSAP SIDEBAR ===== */
  
  useEffect(() => {
    if (!sidebarRef.current) return;

    tl.current = gsap.timeline({ paused: true });

    // Slide in from left with a "shatter" effect
    tl.current.fromTo(
      sidebarRef.current,
      { x: -260, rotationY: -15, opacity: 0 },
      {
        x: 0,
        rotationY: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power4.out',
        stagger: 0.05,
      }
    );
  }, []);


  if (loading || !user || user.role !== 'admin') return null;

  return (
    <section className="admin-section">
      {/* HEADER */}
      <header className="admin-header">
        <i
          className="ri-menu-3-line admin-menu"
          onClick={() => tl.current.play()}
        />
        <div className="admin-user">
          <span>{user.email}</span>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="admin-sidebar" ref={sidebarRef}>
        <h4 onClick={() => { setActiveSection('menu'); tl.current.reverse(); }}>🍽 Menu</h4>
        <h4 onClick={() => { setActiveSection('workshop'); tl.current.reverse(); }}>🎓 Workshops</h4>
        <h4 onClick={() => { setActiveSection('art'); tl.current.reverse(); }}>🎨 Art</h4>

        {/* CLOSE BUTTON AT BOTTOM */}
        <i
          className="ri-close-line close"
          onClick={() => tl.current.reverse()}
        />
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        {activeSection === 'menu' && (
          <div className="admin-card">
            <h3>Add Menu</h3>
            <input placeholder="Category" onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} />
            <input placeholder="Image URL" onChange={e => setMenuForm({ ...menuForm, url: e.target.value })} />
            <input placeholder="Public ID" onChange={e => setMenuForm({ ...menuForm, public_id: e.target.value })} />
            <button onClick={() => adminCreateMenu(menuForm)}>Save Menu</button>
          </div>
        )}

        {activeSection === 'workshop' && (
          <div className="admin-card">
            <h3>Add Workshop</h3>
            <input placeholder="Title" onChange={e => setWorkshopForm({ ...workshopForm, title: e.target.value })} />
            <textarea placeholder="Description" onChange={e => setWorkshopForm({ ...workshopForm, description: e.target.value })} />
            <button onClick={() => adminCreateWorkshop(workshopForm)}>Save Workshop</button>
          </div>
        )}

        {activeSection === 'art' && (
          <div className="admin-card">
            <h3>Add Art</h3>
            <input placeholder="Title" onChange={e => setArtForm({ ...artForm, title: e.target.value })} />
            <input placeholder="Artist" onChange={e => setArtForm({ ...artForm, artistName: e.target.value })} />
            <input placeholder="Price" onChange={e => setArtForm({ ...artForm, price: e.target.value })} />
            <button onClick={() => adminCreateArt(artForm)}>Save Art</button>
          </div>
        )}
      </main>
    </section>
  );
};

export default AdminDashboard;
