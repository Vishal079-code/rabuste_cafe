import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import WhyRobustaPage from './pages/WhyRobustaPage';
import MenuPage from './pages/MenuPage';
import ArtPage from './pages/ArtPage';
import WorkshopsPage from './pages/WorkshopsPage';
import FranchisePage from './pages/FranchisePage';
import AIExperiencePage from './pages/AIExperiencePage';
import NotFoundPage from './pages/NotFoundPage';

import CoffeeBot from './components/CoffeeBot/CoffeeBot'; // ✅ ADDED
import './styles/navbar.css';

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Navbar />

        {/* ✅ GLOBAL AI CHATBOT */}
        <CoffeeBot />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why-robusta" element={<WhyRobustaPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/art" element={<ArtPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/ai-experience" element={<AIExperiencePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
