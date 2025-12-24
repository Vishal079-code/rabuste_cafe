import { Link } from 'react-router-dom';
import CoffeeSteam from '../components/CoffeeSteam';

const Hero = () => {
  return (
    <section id="hero">
      <div className="hero">
        <CoffeeSteam />

        <p
          className="section-kicker animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Robusta-only. Coffee × Art × Tech
        </p>

        <h1
          className="animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          Rabuste is a cozy, bold home for people who like their coffee loud.
        </h1>

        <p
          className="animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          Origin-forward robusta brews, limited-edition art, and AI-guided picks —
          fully explainable, no clutter, just warmth.
        </p>

        <div
          className="flex animate-fade-up"
          style={{ animationDelay: '0.8s' }}
        >
          <Link to="/menu" className="cta">
            Taste the menu
          </Link>
          <Link to="/workshops" className="cta secondary">
            Join a workshop
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
