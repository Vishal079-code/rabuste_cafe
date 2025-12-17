import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import WhyRobustaPage from './pages/WhyRobustaPage';
import MenuPage from './pages/MenuPage';
import ArtPage from './pages/ArtPage';
import WorkshopsPage from './pages/WorkshopsPage';
import FranchisePage from './pages/FranchisePage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/navbar.css';

const App = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/why-robusta" element={<WhyRobustaPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/art" element={<ArtPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;

