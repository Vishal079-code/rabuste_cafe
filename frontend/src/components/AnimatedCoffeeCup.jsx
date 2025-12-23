import { useState } from 'react';
import '../styles/coffeeCup.css';

const AnimatedCoffeeCup = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`coffee-cup-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="coffee-cup">
        <svg viewBox="0 0 120 140" className="cup-svg">
          {/* Cup body */}
          <path
            d="M 30 20 L 30 100 Q 30 110 40 110 L 80 110 Q 90 110 90 100 L 90 20 Z"
            fill="rgba(139, 90, 43, 0.9)"
            stroke="rgba(216, 107, 50, 0.3)"
            strokeWidth="1"
          />
          {/* Cup rim */}
          <ellipse
            cx="60"
            cy="20"
            rx="30"
            ry="5"
            fill="rgba(139, 90, 43, 0.95)"
            stroke="rgba(216, 107, 50, 0.4)"
            strokeWidth="1"
          />
          {/* Coffee liquid */}
          <ellipse
            cx="60"
            cy="35"
            rx="28"
            ry="4"
            fill="rgba(101, 67, 33, 0.95)"
          />
          {/* Handle */}
          <path
            d="M 90 40 Q 110 40 110 60 Q 110 80 90 80"
            fill="none"
            stroke="rgba(216, 107, 50, 0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Steam particles */}
      <div className="steam-container">
        <div className="steam steam-1"></div>
        <div className="steam steam-2"></div>
        <div className="steam steam-3"></div>
        <div className="steam steam-4"></div>
      </div>
    </div>
  );
};

export default AnimatedCoffeeCup;


