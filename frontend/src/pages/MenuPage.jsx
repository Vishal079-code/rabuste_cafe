import { useEffect, useState } from 'react';
import { fetchCoffee } from '../services/api';
import CoffeeMenu from '../sections/CoffeeMenu';
import Footer from '../sections/Footer';

const MenuPage = () => {
  const [coffee, setCoffee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCoffee();
        setCoffee(res.data);
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
      <CoffeeMenu coffees={coffee} loading={loading} />
      <Footer />
    </div>
  );
};

export default MenuPage;

