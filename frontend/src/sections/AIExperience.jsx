import { useState } from 'react';
import { explainableArt, explainableCoffee, explainableWorkshop } from '../utils/aiLogic';

const AIExperience = ({ art, workshops }) => {
  const [mood, setMood] = useState('cozy');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [prefersMilk, setPrefersMilk] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [artResult, setArtResult] = useState(null);
  const [workshopResult, setWorkshopResult] = useState(null);

  const moodOptions = ['cozy', 'calm', 'creative', 'bold', 'focused', 'energetic'];
  const timeOptions = ['morning', 'afternoon', 'evening', 'night'];

  const runCoffeeAI = (e) => {
    e.preventDefault();
    const local = explainableCoffee({ mood, timeOfDay, prefersMilk });
    setAiResult(local);
  };

  const runArtAI = () => {
    const local = explainableArt({ mood });
    setArtResult({ local });
  };

  const runWorkshopAI = () => {
    const local = explainableWorkshop({ mood, timeOfDay });
    setWorkshopResult({ local });
  };

  return (
    <section id="ai">
      <p className="section-kicker">AI Experience Layer</p>
      <h2 className="section-title">Menu-based intelligent pairing</h2>

      <div className="grid three">
        {/* COFFEE */}
        <div className="card">
          <div className="section-header">
            <h3>Coffee discovery</h3>
            <span className="pill">Mood + time → drink</span>
          </div>

          <form className="grid" onSubmit={runCoffeeAI}>
            <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
              {moodOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select className="input" value={timeOfDay} onChange={(e) => setTimeOfDay(e.target.value)}>
              {timeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="flex" style={{ alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={prefersMilk}
                onChange={(e) => setPrefersMilk(e.target.checked)}
              />
              <span className="muted">Milk-based</span>
            </label>

            <button className="cta" type="submit">Suggest coffee</button>
          </form>

          {aiResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{aiResult.title}</strong>
              <p className="muted">{aiResult.reasoning}</p>

              <div className="flex">
                {aiResult.matches.map((c) => (
                  <span key={c.name} className="tag">{c.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ART (UNCHANGED) */}
        <div className="card">
          <div className="section-header">
            <h3>Art discovery</h3>
            <span className="pill">Mood → palette</span>
          </div>

          <select className="input" value={mood} onChange={(e) => setMood(e.target.value)}>
            {moodOptions.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <button className="cta" onClick={runArtAI}>Recommend art</button>

          {artResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{artResult.local.title}</strong>
              <p className="muted">{artResult.local.reasoning}</p>
            </div>
          )}
        </div>

        {/* WORKSHOP (UNCHANGED) */}
        <div className="card">
          <div className="section-header">
            <h3>Workshop fit</h3>
            <span className="pill">Vibe → session</span>
          </div>

          <button className="cta" onClick={runWorkshopAI}>Suggest workshop</button>

          {workshopResult && (
            <div className="blur-panel" style={{ marginTop: 12 }}>
              <strong>{workshopResult.local.title}</strong>
              <p className="muted">{workshopResult.local.reasoning}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIExperience;
