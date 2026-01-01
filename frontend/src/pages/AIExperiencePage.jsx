import { useEffect, useState } from 'react';
import { fetchArt, fetchCoffee, fetchWorkshops } from '../services/api';
import AIExperience from '../sections/AIExperience';
import Footer from '../sections/Footer';

const AIExperiencePage = () => {
  const [coffee, setCoffee] = useState([]);
  const [art, setArt] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, aRes, wRes] = await Promise.all([
          fetchCoffee(),
          fetchArt(),
          fetchWorkshops(),
        ]);
        setCoffee(cRes.data);
        setArt(aRes.data);
        setWorkshops(wRes.data);
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
      <AIExperience coffees={coffee} art={art} workshops={workshops} />
      <Footer />
    </div>
  );
};

export default AIExperiencePage;

