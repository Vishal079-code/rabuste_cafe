import { useEffect, useState } from 'react';
import {
  fetchArt,
  fetchCoffee,
  fetchInsights,
  fetchWorkshops,
  fetchMenuImages,
} from '../services/api';
import Hero from '../sections/Hero';
import WhyRobusta from '../sections/WhyRobusta';
import CoffeeMenu from '../sections/CoffeeMenu';
import ArtGallery from '../sections/ArtGallery';
import Workshops from '../sections/Workshops';
import Franchise from '../sections/Franchise';
import AIExperience from '../sections/AIExperience';
import Footer from '../sections/Footer';

const HomePage = () => {
  const [coffee, setCoffee] = useState([]);
  const [art, setArt] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [insights, setInsights] = useState(null);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes, wRes, iRes, imagesRes] = await Promise.all([
          fetchCoffee(),
          fetchArt(),
          fetchWorkshops(),
          fetchInsights(),
          fetchMenuImages(),
        ]);
        setCoffee(cRes.data);
        setArt(aRes.data);
        setWorkshops(wRes.data);
        setInsights(iRes.data);
        
        // Filter and extract logo images
        const logoImages = imagesRes.data.filter((image) => {
          const isLogo = image.category?.toLowerCase() === 'logo' || 
                        image.public_id?.toLowerCase().includes('logo');
          return isLogo;
        });
        setLogos(logoImages);
      } catch (err) {
        setError('Cannot reach Rabuste API. Start backend at http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const primaryLogo = logos.length > 0 ? logos[0] : null;
  const secondaryLogo = logos.length > 1 ? logos[1] : null;

  // Set up scroll animations for sections (only on HomePage)
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Only observe sections with data-scroll-section attribute (HomePage specific)
    const sections = document.querySelectorAll('.page [data-scroll-section]');
    sections.forEach((section) => observer.observe(section));

    // Fallback: make sections visible after a short delay if observer hasn't triggered
    const fallbackTimeout = setTimeout(() => {
      sections.forEach((section) => {
        if (!section.classList.contains('scroll-visible')) {
          section.classList.add('scroll-visible');
        }
      });
    }, 500);

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <div className="page">
      {error && <div className="toast error">{error}</div>}
      <Hero primaryLogo={primaryLogo} />
      {secondaryLogo && (
        <div data-scroll-section>
          <section style={{ padding: '32px 18px', textAlign: 'center' }}>
            <img 
              src={secondaryLogo.url} 
              alt="Rabuste Logo" 
              className="secondary-logo"
            />
          </section>
        </div>
      )}
      {/*<div data-scroll-section>
        <WhyRobusta />
      </div>*/}
      <div data-scroll-section>
        <CoffeeMenu coffees={coffee} loading={loading} />
      </div>
      <div data-scroll-section>
        <ArtGallery art={art} loading={loading} insights={insights} />
      </div>
      <div data-scroll-section>
        <Workshops workshops={workshops} loading={loading} />
      </div>
      <div data-scroll-section>
        <Franchise />
      </div>
      <div data-scroll-section>
        <AIExperience coffees={coffee} art={art} workshops={workshops} />
      </div>
      <div data-scroll-section>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;


