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

  return (
    <div className="page">
      {error && <div className="toast error">{error}</div>}
      <Hero primaryLogo={primaryLogo} />
      {secondaryLogo && (
        <section style={{ padding: '32px 18px', textAlign: 'center' }}>
          <img 
            src={secondaryLogo.url} 
            alt="Rabuste Logo" 
            className="secondary-logo"
          />
        </section>
      )}
      <WhyRobusta />
      <CoffeeMenu coffees={coffee} loading={loading} />
      <ArtGallery art={art} loading={loading} insights={insights} />
      <Workshops workshops={workshops} loading={loading} />
      <Franchise />
      <AIExperience coffees={coffee} art={art} workshops={workshops} />
      <Footer />
    </div>
  );
};

export default HomePage;


