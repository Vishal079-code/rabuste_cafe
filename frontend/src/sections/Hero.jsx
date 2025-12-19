import { Link } from 'react-router-dom';

const Hero = ({ primaryLogo }) => {
  return (
    <section id="hero">
      <div className="hero">
        {primaryLogo && (
          <div className="hero-logo-container">
            <img 
              src={primaryLogo.url} 
              alt="Rabuste Logo" 
              className="hero-logo"
            />
          </div>
        )}
        <p className="section-kicker">Robusta-only. Coffee × Art × Tech</p>
        <h1>Rabuste is a cozy, bold home for people who like their coffee loud.</h1>
        <p>
          Scroll to taste the story: origin-forward robusta brews, limited-edition art, and AI-guided picks that stay
          fully explainable. No clutter, just immersive warmth.
        </p>
        <div className="flex">
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

