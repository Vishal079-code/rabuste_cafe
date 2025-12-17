import { useState } from 'react';
import { aiArt, aiCoffee, aiWorkshop } from '../services/api';
import { explainableArt, explainableCoffee, explainableWorkshop } from '../utils/aiLogic';

const AIExperience = ({ coffees, art, workshops }) => {
  const [mood, setMood] = useState('cozy');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [prefersMilk, setPrefersMilk] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [artResult, setArtResult] = useState(null);
  const [workshopResult, setWorkshopResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCoffeeAI = async (e) => {
    e.preventDefault();
    setLoading(true);
    const local = explainableCoffee({ mood, timeOfDay, prefersMilk });
    const fallbackMatches = coffees
      ?.filter((c) => c.strength === local.strength || c.tags?.includes('bold'))
      .slice(0, 3);
    setAiResult({ local, matches: fallbackMatches });
    try {
      const res = await aiCoffee({ mood, timeOfDay, prefersMilk });
      setAiResult({ local, matches: res.data.matches });
    } catch (err) {
      // keep local result only
    } finally {
      setLoading(false);
    }
  };

  const runArtAI = async () => {
    const local = explainableArt({ mood });
    setArtResult({ local, matches: [] });
    try {
      const res = await aiArt({ mood });
      setArtResult({ local, matches: res.data.matches });
    } catch (err) {
      // ignore
    }
  };

  const runWorkshopAI = async () => {
    const local = explainableWorkshop({ mood, timeOfDay });
    setWorkshopResult({ local });
    try {
      const res = await aiWorkshop({ mood, timeOfDay });
      setWorkshopResult({ local: res.data.aiPick || local });
    } catch (err) {
      // ignore
    }
  };

  const moodOptions = ['cozy', 'calm', 'creative', 'bold', 'focused', 'energetic'];
  const timeOptions = ['morning', 'afternoon', 'evening', 'night'];

  return (
    <section id="ai">
      <p className="section-kicker">AI Experience Layer</p>
      <h2 className="section-title">Explainable, rule-based pairing.</h2>
      <div className="grid three">
        <div className="card">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h3>Coffee discovery</h3>
            <span className="pill">Mood + time → brew</span>
          </div>
          <form className="grid" onSubmit={runCoffeeAI}>
            <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
              {moodOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select className="input" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="flex" style={{ alignItems: 'center' }}>
              <input type="checkbox" checked={prefersMilk} onChange={(e) => setPrefersMilk(e.target.checked)} />
              <span className="muted">Add creamy notes</span>
            </label>
            <button className="cta" type="submit" disabled={loading}>
              {loading ? 'Thinking…' : 'Suggest a coffee'}
            </button>
          </form>
          {aiResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{aiResult.local.title}</strong>
              <p className="muted">{aiResult.local.reasoning}</p>
              {aiResult.matches?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <small className="muted">Matches from backend:</small>
                  <div className="flex">
                    {aiResult.matches.map((m) => (
                      <span key={m._id || m.name} className="tag">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h3>Art discovery</h3>
            <span className="pill">Mood → palette</span>
          </div>
          <div className="grid">
            <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
              {moodOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button className="cta" type="button" onClick={runArtAI}>
              Recommend art
            </button>
          </div>
          {artResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{artResult.local.title}</strong>
              <p className="muted">{artResult.local.reasoning}</p>
              {artResult.matches?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <small className="muted">Pieces that match:</small>
                  <div className="flex">
                    {artResult.matches.map((p) => (
                      <span key={p._id || p.title} className="tag">
                        {p.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="card">
          <div className="section-header" style={{ marginBottom: 12 }}>
            <h3>Workshop fit</h3>
            <span className="pill">Vibe → session</span>
          </div>
          <div className="grid">
            <button className="cta" type="button" onClick={runWorkshopAI}>
              Suggest a workshop
            </button>
          </div>
          {workshopResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{workshopResult.local.title}</strong>
              <p className="muted">{workshopResult.local.reasoning}</p>
            </div>
          )}
          {workshops?.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <small className="muted">Upcoming:</small>
              <div className="flex">
                {workshops.slice(0, 3).map((w) => (
                  <span key={w._id || w.title} className="tag">
                    {w.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIExperience;

