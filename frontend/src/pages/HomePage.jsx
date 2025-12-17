import { useEffect, useState } from 'react';
import {
  fetchArt,
  fetchCoffee,
  fetchInsights,
  fetchWorkshops,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes, wRes, iRes] = await Promise.all([
          fetchCoffee(),
          fetchArt(),
          fetchWorkshops(),
          fetchInsights(),
        ]);
        setCoffee(cRes.data);
        setArt(aRes.data);
        setWorkshops(wRes.data);
        setInsights(iRes.data);
      } catch (err) {
        setError('Cannot reach Rabuste API. Start backend at http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="page">
      {error && <div className="toast error">{error}</div>}
      <Hero />
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

