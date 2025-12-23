import { Link } from 'react-router-dom';
import AnimatedCoffeeCup from '../components/AnimatedCoffeeCup';

const Hero = ({ primaryLogo }) => {
  return (
    <section id="hero">
      <div className="hero">
        {/* Coffee mood accent - floating beans */}
        <div className="coffee-beans-bg">
          <div className="coffee-bean bean-1"></div>
          <div className="coffee-bean bean-2"></div>
          <div className="coffee-bean bean-3"></div>
        </div>
        
        {primaryLogo && (
          <div className="hero-logo-container">
            <img 
              src={primaryLogo.url} 
              alt="Rabuste Logo" 
              className="hero-logo"
            />
          </div>
        )}
        
        <AnimatedCoffeeCup />
        
        <p className="section-kicker animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Robusta-only. Coffee × Art × Tech
        </p>
        <h1 className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Rabuste is a cozy, bold home for people who like their coffee loud.
        </h1>
        <p className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
          Scroll to taste the story: origin-forward robusta brews, limited-edition art, and AI-guided picks that stay
          fully explainable. No clutter, just immersive warmth.
        </p>
        <div className="flex animate-fade-up" style={{ animationDelay: '0.8s' }}>
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

