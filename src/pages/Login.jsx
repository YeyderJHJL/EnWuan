import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      // La redirección se manejará automáticamente por el AuthContext
      navigate('/surveys');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#01002e]/5 to-[#0764bf]/5">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-t-4 border-[#0764bf]">
            <CardBody className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
                  Iniciar Sesión
                </h1>
                <p className="text-gray-600">Bienvenido de vuelta a EnWuan</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  name="email"
                  type="email"
                  label="Correo Electrónico"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-medium"
                  }}
                />

                <Input
                  name="password"
                  type="password"
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-medium"
                  }}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold text-base py-6"
                  isLoading={loading}
                  size="lg"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <a href="/register" className="text-[#0764bf] font-bold hover:text-[#1800ad] transition-colors">
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
