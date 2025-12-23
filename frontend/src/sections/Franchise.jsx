import { useState } from 'react';
import { submitFranchise } from '../services/api';

const Franchise = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setSubmitting(true);
    try {
      const res = await submitFranchise(form);
      setStatus(res.data.message);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="franchise">
      <p className="section-kicker">Franchise</p>
      <div className="section-header">
        <h2 className="section-title">Grow Rabuste with us.</h2>
        <span className="pill">No personal data stored beyond enquiry</span>
      </div>
      <div className="grid two">
        <div className="card">
          <h3>Robusta-first footprint</h3>
          <p className="muted" style={{ marginTop: 8 }}>
            We design bars that feel like studios. Bold coffee, rotating art, and experiential workshops travel with the
            brand.
          </p>
          <div className="mini-grid" style={{ marginTop: 12 }}>
            <div className="blur-panel">
              <strong>Playbook</strong>
              <p className="muted">Operations, roast specs, and launch kits managed with you.</p>
            </div>
            <div className="blur-panel">
              <strong>Design</strong>
              <p className="muted">Warm dark interiors, spotlit art walls, low-clutter navigation.</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h3>Enquiry</h3>
          <form onSubmit={onSubmit} className="grid">
            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <textarea
              className="input"
              style={{ minHeight: 96 }}
              placeholder="Tell us about your city"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button className="cta" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send enquiry'}
            </button>
            {status && <div className="toast">{status}</div>}
            {error && <div className="toast error">{error}</div>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Franchise;




