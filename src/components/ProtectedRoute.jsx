import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  // Mostrar loader mientras se verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#01002e] to-[#0764bf]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirigir según el rol del usuario
    if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (userRole === 'business') {
      return <Navigate to="/dashboard/business" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
