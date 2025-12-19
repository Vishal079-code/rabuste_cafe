import { useEffect, useState } from 'react';
import { fetchCoffee, fetchMenuImages } from '../services/api';
import CoffeeMenu from '../sections/CoffeeMenu';
import Footer from '../sections/Footer';
import MenuImageSlider from '../components/MenuImageSlider';

const MenuPage = () => {
  const [coffee, setCoffee] = useState([]);
  const [menuImages, setMenuImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [coffeeRes, menuImagesRes] = await Promise.all([
          fetchCoffee(),
          fetchMenuImages(),
        ]);
        setCoffee(coffeeRes.data);
        
        // Filter out logo images (exclude category === "logo" or public_id includes "logo")
        const flatArray = menuImagesRes.data;
        const filteredArray = flatArray.filter((image) => {
          const isLogo = image.category?.toLowerCase() === 'logo' || 
                        image.public_id?.toLowerCase().includes('logo');
          return !isLogo;
        });
        
        // Group filtered array by category on frontend
        const grouped = {};
        filteredArray.forEach((image) => {
          if (!grouped[image.category]) {
            grouped[image.category] = [];
          }
          grouped[image.category].push({ url: image.url });
        });
        setMenuImages(grouped);
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
      <section style={{ paddingTop: '40px' }}>
        {Object.keys(menuImages).length > 0 && (
          <div>
            {Object.entries(menuImages).map(([category, images]) => (
              <MenuImageSlider key={category} images={images} categoryName={category} />
            ))}
          </div>
        )}
      </section>
      <CoffeeMenu coffees={coffee} loading={loading} />
      <Footer />
    </div>
  );
};

export default MenuPage;


