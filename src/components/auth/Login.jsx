import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Input, Button, Divider } from '@nextui-org/react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, userRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Redirigir según el rol - esperamos a que se cargue el perfil
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
      if (email === ADMIN_EMAIL) {
        navigate('/dashboard/admin');
      } else {
        // ProtectedRoute manejará la redirección inteligente según rol
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#01002e]/5 to-[#0764bf]/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-[#0764bf]" data-testid="login-card">
        <CardHeader className="flex flex-col gap-3 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0764bf] to-[#1800ad] rounded-full flex items-center justify-center">
              <LogIn className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">EnWuan</h1>
              <p className="text-sm text-gray-500">Iniciar Sesión</p>
            </div>
          </div>
        </CardHeader>
        
        <Divider className="my-4" />
        
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" data-testid="login-error">
                {error}
              </div>
            )}

            <Input
              data-testid="login-email-input"
              type="email"
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Input
              data-testid="login-password-input"
              type="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock size={18} className="text-gray-400" />}
              required
              variant="bordered"
            />

            <Button
              data-testid="login-submit-button"
              type="submit"
              className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
              isLoading={loading}
            >
              Iniciar Sesión
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-[#0764bf] hover:text-[#1800ad] font-medium transition-colors">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
