import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  adminCreateArt,
  adminCreateMenu,
  adminCreateWorkshop,
} from '../services/api';

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [menuForm, setMenuForm] = useState({ category: '', url: '', public_id: '' });
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    date: '',
    totalSeats: '',
    tags: '',
  });
  const [artForm, setArtForm] = useState({
    title: '',
    artistName: '',
    description: '',
    price: '',
    imageUrl: '',
    moodTags: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return null;
  }

  if (user.role !== 'admin') {
    return <p style={{ padding: '2rem' }}>You are not authorized to view this page.</p>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const wrap = (fn) => async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await fn();
      setMessage('Saved successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="admin-subtitle">Manage menu, workshops, and art listings.</p>
        </div>
        <div className="admin-user-info">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="auth-button small">
            Logout
          </button>
        </div>
      </div>
      {message && <div className="auth-success">{message}</div>}
      {error && <div className="auth-error">{error}</div>}

      <div className="admin-grid">
        <section className="admin-card">
          <h3>Manage Menu Images</h3>
          <form
            className="admin-form"
            onSubmit={wrap(() => adminCreateMenu(menuForm))}
          >
            <label>
              Category
              <input
                type="text"
                value={menuForm.category}
                onChange={(e) =>
                  setMenuForm((f) => ({ ...f, category: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Image URL
              <input
                type="url"
                value={menuForm.url}
                onChange={(e) => setMenuForm((f) => ({ ...f, url: e.target.value }))}
                required
              />
            </label>
            <label>
              Public ID
              <input
                type="text"
                value={menuForm.public_id}
                onChange={(e) =>
                  setMenuForm((f) => ({ ...f, public_id: e.target.value }))
                }
                required
              />
            </label>
            <button type="submit" className="auth-button">
              Add Menu Image
            </button>
          </form>
        </section>

        <section className="admin-card">
          <h3>Add Workshop</h3>
          <form
            className="admin-form"
            onSubmit={wrap(() =>
              adminCreateWorkshop({
                ...workshopForm,
                totalSeats: Number(workshopForm.totalSeats),
                tags: workshopForm.tags
                  ? workshopForm.tags.split(',').map((t) => t.trim())
                  : [],
              })
            )}
          >
            <label>
              Title
              <input
                type="text"
                value={workshopForm.title}
                onChange={(e) =>
                  setWorkshopForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={workshopForm.description}
                onChange={(e) =>
                  setWorkshopForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Date
              <input
                type="datetime-local"
                value={workshopForm.date}
                onChange={(e) =>
                  setWorkshopForm((f) => ({ ...f, date: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Total Seats
              <input
                type="number"
                min="1"
                value={workshopForm.totalSeats}
                onChange={(e) =>
                  setWorkshopForm((f) => ({ ...f, totalSeats: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Tags (comma separated)
              <input
                type="text"
                value={workshopForm.tags}
                onChange={(e) =>
                  setWorkshopForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </label>
            <button type="submit" className="auth-button">
              Add Workshop
            </button>
          </form>
        </section>

        <section className="admin-card">
          <h3>Manage Art Listings</h3>
          <form
            className="admin-form"
            onSubmit={wrap(() =>
              adminCreateArt({
                ...artForm,
                price: Number(artForm.price),
                moodTags: artForm.moodTags
                  ? artForm.moodTags.split(',').map((t) => t.trim())
                  : [],
              })
            )}
          >
            <label>
              Title
              <input
                type="text"
                value={artForm.title}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Artist Name
              <input
                type="text"
                value={artForm.artistName}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, artistName: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={artForm.description}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={artForm.price}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, price: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Image URL
              <input
                type="url"
                value={artForm.imageUrl}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Mood Tags (comma separated)
              <input
                type="text"
                value={artForm.moodTags}
                onChange={(e) =>
                  setArtForm((f) => ({ ...f, moodTags: e.target.value }))
                }
              />
            </label>
            <button type="submit" className="auth-button">
              Add Art Piece
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;


