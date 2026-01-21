import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Pricing from '../components/landing/Pricing';
import Footer from '../components/landing/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const { firebaseUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir al dashboard según rol
  useEffect(() => {
    if (!loading && firebaseUser && userProfile?.role) {
      switch (userProfile.role) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'business':
          navigate('/dashboard/business');
          break;
        case 'user':
        default:
          navigate('/dashboard/user');
          break;
      }
    }
  }, [loading, firebaseUser, userProfile, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
