import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../context/AuthContext';
import {
  adminGetMenu,
  adminCreateMenu,
  adminUpdateMenu,
  adminDeleteMenu,
  adminGetWorkshops,
  adminCreateWorkshop,
  adminUpdateWorkshop,
  adminDeleteWorkshop,
  adminGetArt,
  adminCreateArt,
  adminUpdateArt,
  adminDeleteArt,
  adminGetBookings,
  adminAcceptBooking,
  adminRejectBooking,
  adminGetWorkshopRegistrations,
} from '../services/api';

import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('menu');
  const sidebarRef = useRef(null);
  const tl = useRef(null);

  /* ===== LISTS ===== */
  const [menuItems, setMenuItems] = useState([]);
  const [workshopItems, setWorkshopItems] = useState([]);
  const [artItems, setArtItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [workshopRegistrations, setWorkshopRegistrations] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState('');

  /* ===== EDIT MODE ===== */
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [editingWorkshopId, setEditingWorkshopId] = useState(null);
  const [editingArtId, setEditingArtId] = useState(null);

  /* ===== DELETE CONFIRMATION ===== */
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, type: '', id: '', name: '' });

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
    description: '',
    price: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user, navigate]);

  /* ===== FETCH ITEMS ===== */
  const fetchMenuItems = async () => {
    setLoadingItems(true);
    setError('');
    try {
      const res = await adminGetMenu();
      setMenuItems(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchWorkshopItems = async () => {
    setLoadingItems(true);
    setError('');
    try {
      const res = await adminGetWorkshops();
      setWorkshopItems(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load workshops');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchArtItems = async () => {
    setLoadingItems(true);
    setError('');
    try {
      const res = await adminGetArt();
      setArtItems(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load art items');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchBookings = async () => {
    setLoadingItems(true);
    setError('');
    try {
      const res = await adminGetBookings();
      setBookings(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchWorkshopRegistrations = async () => {
    setLoadingItems(true);
    setError('');
    try {
      const res = await adminGetWorkshopRegistrations();
      setWorkshopRegistrations(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load workshop registrations');
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'menu') fetchMenuItems();
    if (activeSection === 'workshop') fetchWorkshopItems();
    if (activeSection === 'art') fetchArtItems();
    if (activeSection === 'bookings') fetchBookings();
    if (activeSection === 'workshop-registrations') fetchWorkshopRegistrations();
  }, [activeSection]);

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

  /* ===== HANDLERS ===== */
  const handleMenuSubmit = async () => {
    setError('');
    try {
      if (editingMenuId) {
        await adminUpdateMenu(editingMenuId, menuForm);
        setEditingMenuId(null);
      } else {
        await adminCreateMenu(menuForm);
      }
      setMenuForm({ category: '', url: '', public_id: '' });
      fetchMenuItems();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleWorkshopSubmit = async () => {
    setError('');
    try {
      const payload = {
        ...workshopForm,
        totalSeats: parseInt(workshopForm.totalSeats) || 0,
        date: workshopForm.date ? new Date(workshopForm.date).toISOString() : new Date().toISOString(),
      };
      if (editingWorkshopId) {
        await adminUpdateWorkshop(editingWorkshopId, payload);
        setEditingWorkshopId(null);
      } else {
        await adminCreateWorkshop(payload);
      }
      setWorkshopForm({ title: '', description: '', date: '', totalSeats: '' });
      fetchWorkshopItems();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save workshop');
    }
  };

  const handleArtSubmit = async () => {
    setError('');
    try {
      const payload = {
        ...artForm,
        price: parseFloat(artForm.price) || 0,
      };
      if (editingArtId) {
        await adminUpdateArt(editingArtId, payload);
        setEditingArtId(null);
      } else {
        await adminCreateArt(payload);
      }
      setArtForm({ title: '', artistName: '', description: '', price: '', imageUrl: '' });
      fetchArtItems();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save art item');
    }
  };

  const handleEditMenu = (item) => {
    setEditingMenuId(item._id);
    setMenuForm({ category: item.category, url: item.url, public_id: item.public_id });
  };

  const handleEditWorkshop = (item) => {
    setEditingWorkshopId(item._id);
    const dateStr = item.date ? new Date(item.date).toISOString().split('T')[0] : '';
    setWorkshopForm({
      title: item.title || '',
      description: item.description || '',
      date: dateStr,
      totalSeats: item.totalSeats?.toString() || '',
    });
  };

  const handleEditArt = (item) => {
    setEditingArtId(item._id);
    setArtForm({
      title: item.title || '',
      artistName: item.artistName || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      imageUrl: item.imageUrl || '',
    });
  };

  const handleDelete = async () => {
    setError('');
    try {
      if (deleteConfirm.type === 'menu') {
        await adminDeleteMenu(deleteConfirm.id);
        fetchMenuItems();
      } else if (deleteConfirm.type === 'workshop') {
        await adminDeleteWorkshop(deleteConfirm.id);
        fetchWorkshopItems();
      } else if (deleteConfirm.type === 'art') {
        await adminDeleteArt(deleteConfirm.id);
        fetchArtItems();
      }
      setDeleteConfirm({ show: false, type: '', id: '', name: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete item');
    }
  };

  const cancelEdit = () => {
    setEditingMenuId(null);
    setEditingWorkshopId(null);
    setEditingArtId(null);
    setMenuForm({ category: '', url: '', public_id: '' });
    setWorkshopForm({ title: '', description: '', date: '', totalSeats: '' });
    setArtForm({ title: '', artistName: '', description: '', price: '', imageUrl: '' });
  };


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
        <h4 onClick={() => { setActiveSection('menu'); tl.current.reverse(); }}>🍽 Menu Images</h4>
        <h4 onClick={() => { navigate('/admin/menu'); tl.current.reverse(); }}>☕ Menu Items</h4>
        <h4 onClick={() => { setActiveSection('workshop'); tl.current.reverse(); }}>🎓 Workshops</h4>
        <h4 onClick={() => { setActiveSection('workshop-registrations'); tl.current.reverse(); }}>📝 Workshop Registrations</h4>
        <h4 onClick={() => { setActiveSection('art'); tl.current.reverse(); }}>🎨 Art</h4>
        <h4 onClick={() => { setActiveSection('bookings'); tl.current.reverse(); }}>📋 Art Bookings</h4>

        {/* CLOSE BUTTON AT BOTTOM */}
        <i
          className="ri-close-line close"
          onClick={() => tl.current.reverse()}
        />
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        {error && <div className="admin-error">{error}</div>}

        {activeSection === 'menu' && (
          <>
            <div className="admin-card">
              <h3>{editingMenuId ? 'Edit Menu' : 'Add Menu'}</h3>
              <input 
                placeholder="Category" 
                value={menuForm.category}
                onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} 
              />
              <input 
                placeholder="Image URL" 
                value={menuForm.url}
                onChange={e => setMenuForm({ ...menuForm, url: e.target.value })} 
              />
              <input 
                placeholder="Public ID" 
                value={menuForm.public_id}
                onChange={e => setMenuForm({ ...menuForm, public_id: e.target.value })} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleMenuSubmit}>
                  {editingMenuId ? 'Update Menu' : 'Save Menu'}
                </button>
                {editingMenuId && (
                  <button onClick={cancelEdit} style={{ background: '#666' }}>Cancel</button>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h3>Menu Items ({menuItems.length})</h3>
              {loadingItems ? (
                <p>Loading...</p>
              ) : menuItems.length === 0 ? (
                <p>No menu items yet</p>
              ) : (
                <div className="admin-list">
                  {menuItems.map((item) => (
                    <div key={item._id} className="admin-list-item">
                      <div>
                        <strong>{item.category}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#999' }}>
                          {item.url?.substring(0, 50)}...
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditMenu(item)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, type: 'menu', id: item._id, name: item.category })}
                          style={{ padding: '6px 12px', fontSize: '12px', background: '#d32f2f' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'workshop' && (
          <>
            <div className="admin-card">
              <h3>{editingWorkshopId ? 'Edit Workshop' : 'Add Workshop'}</h3>
              <input 
                placeholder="Title" 
                value={workshopForm.title}
                onChange={e => setWorkshopForm({ ...workshopForm, title: e.target.value })} 
              />
              <textarea 
                placeholder="Description" 
                value={workshopForm.description}
                onChange={e => setWorkshopForm({ ...workshopForm, description: e.target.value })} 
              />
              <input 
                type="date"
                placeholder="Date" 
                value={workshopForm.date}
                onChange={e => setWorkshopForm({ ...workshopForm, date: e.target.value })} 
              />
              <input 
                type="number"
                placeholder="Total Seats" 
                value={workshopForm.totalSeats}
                onChange={e => setWorkshopForm({ ...workshopForm, totalSeats: e.target.value })} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleWorkshopSubmit}>
                  {editingWorkshopId ? 'Update Workshop' : 'Save Workshop'}
                </button>
                {editingWorkshopId && (
                  <button onClick={cancelEdit} style={{ background: '#666' }}>Cancel</button>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h3>Workshops ({workshopItems.length})</h3>
              {loadingItems ? (
                <p>Loading...</p>
              ) : workshopItems.length === 0 ? (
                <p>No workshops yet</p>
              ) : (
                <div className="admin-list">
                  {workshopItems.map((item) => (
                    <div key={item._id} className="admin-list-item">
                      <div>
                        <strong>{item.title}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#999' }}>
                          {new Date(item.date).toLocaleDateString()} • {item.totalSeats} seats
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditWorkshop(item)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, type: 'workshop', id: item._id, name: item.title })}
                          style={{ padding: '6px 12px', fontSize: '12px', background: '#d32f2f' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'workshop-registrations' && (
          <>
            <div className="admin-card">
              <h3>Workshop Registrations ({workshopRegistrations.length})</h3>
              {loadingItems ? (
                <p>Loading...</p>
              ) : workshopRegistrations.length === 0 ? (
                <p>No registrations yet</p>
              ) : (
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #2a2a35' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Workshop Title</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Phone</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Date Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshopRegistrations.map((registration) => (
                        <tr 
                          key={registration._id} 
                          style={{ 
                            borderBottom: '1px solid #2a2a35',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 24, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px', color: '#fff', fontSize: '0.875rem' }}>
                            <strong>{registration.workshopTitle}</strong>
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {registration.name}
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {registration.phone}
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {registration.email || '-'}
                          </td>
                          <td style={{ padding: '12px', color: '#999', fontSize: '0.75rem' }}>
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'art' && (
          <>
            <div className="admin-card">
              <h3>{editingArtId ? 'Edit Art' : 'Add Art'}</h3>
              <input 
                placeholder="Title" 
                value={artForm.title}
                onChange={e => setArtForm({ ...artForm, title: e.target.value })} 
              />
              <input 
                placeholder="Artist" 
                value={artForm.artistName}
                onChange={e => setArtForm({ ...artForm, artistName: e.target.value })} 
              />
              <textarea 
                placeholder="Description" 
                value={artForm.description}
                onChange={e => setArtForm({ ...artForm, description: e.target.value })} 
              />
              <input 
                type="number"
                placeholder="Price" 
                value={artForm.price}
                onChange={e => setArtForm({ ...artForm, price: e.target.value })} 
              />
              <input 
                placeholder="Image URL" 
                value={artForm.imageUrl}
                onChange={e => setArtForm({ ...artForm, imageUrl: e.target.value })} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleArtSubmit}>
                  {editingArtId ? 'Update Art' : 'Save Art'}
                </button>
                {editingArtId && (
                  <button onClick={cancelEdit} style={{ background: '#666' }}>Cancel</button>
                )}
              </div>
            </div>

            <div className="admin-card">
              <h3>Art Items ({artItems.length})</h3>
              {loadingItems ? (
                <p>Loading...</p>
              ) : artItems.length === 0 ? (
                <p>No art items yet</p>
              ) : (
                <div className="admin-list">
                  {artItems.map((item) => (
                    <div key={item._id} className="admin-list-item">
                      <div>
                        <strong>{item.title}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#999' }}>
                          by {item.artistName} • ${item.price}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditArt(item)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ show: true, type: 'art', id: item._id, name: item.title })}
                          style={{ padding: '6px 12px', fontSize: '12px', background: '#d32f2f' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'bookings' && (
          <>
            <div className="admin-card">
              <h3>Art Bookings ({bookings.length})</h3>
              {loadingItems ? (
                <p>Loading...</p>
              ) : bookings.length === 0 ? (
                <p>No bookings yet</p>
              ) : (
                <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #2a2a35' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Art Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Customer</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Phone</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Message</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ccc', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr 
                          key={booking._id} 
                          style={{ 
                            borderBottom: '1px solid #2a2a35',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 122, 24, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px', color: '#fff', fontSize: '0.875rem' }}>
                            <strong>{booking.artName}</strong>
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {booking.userName}
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {booking.phone}
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem' }}>
                            {booking.email || '-'}
                          </td>
                          <td style={{ padding: '12px', color: '#ccc', fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {booking.message || '-'}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: 
                                  booking.status === 'ACCEPTED' 
                                    ? 'rgba(76, 175, 80, 0.2)' 
                                    : booking.status === 'REJECTED'
                                    ? 'rgba(211, 47, 47, 0.2)'
                                    : 'rgba(255, 193, 7, 0.2)',
                                color: 
                                  booking.status === 'ACCEPTED'
                                    ? '#81c784'
                                    : booking.status === 'REJECTED'
                                    ? '#ff6b6b'
                                    : '#ffc107',
                                border: `1px solid ${
                                  booking.status === 'ACCEPTED' 
                                    ? 'rgba(76, 175, 80, 0.4)' 
                                    : booking.status === 'REJECTED'
                                    ? 'rgba(211, 47, 47, 0.4)'
                                    : 'rgba(255, 193, 7, 0.4)'
                                }`,
                              }}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#999', fontSize: '0.75rem' }}>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {booking.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={async () => {
                                      setError('');
                                      try {
                                        await adminAcceptBooking(booking._id);
                                        fetchBookings();
                                        fetchArtItems(); // Refresh art items to show updated status
                                      } catch (err) {
                                        setError(err?.response?.data?.message || 'Failed to accept booking');
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      fontSize: '12px',
                                      background: '#4caf50',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: 'white',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={async () => {
                                      setError('');
                                      try {
                                        await adminRejectBooking(booking._id);
                                        fetchBookings();
                                        fetchArtItems(); // Refresh art items to show updated status
                                      } catch (err) {
                                        setError(err?.response?.data?.message || 'Failed to reject booking');
                                      }
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      fontSize: '12px',
                                      background: '#d32f2f',
                                      border: 'none',
                                      borderRadius: '6px',
                                      color: 'white',
                                      cursor: 'pointer',
                                      fontWeight: '600',
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {booking.status !== 'PENDING' && (
                                <span style={{ color: '#999', fontSize: '0.75rem' }}>
                                  {booking.status === 'ACCEPTED' ? '✓ Accepted' : '✗ Rejected'}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm.show && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"?</p>
            <p style={{ fontSize: '12px', color: '#999' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleDelete} style={{ background: '#d32f2f' }}>Delete</button>
              <button onClick={() => setDeleteConfirm({ show: false, type: '', id: '', name: '' })} style={{ background: '#666' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
