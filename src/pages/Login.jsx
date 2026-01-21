import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardBody } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/surveys');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-12">
        <Card className="shadow-lg">
          <CardBody className="p-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Iniciar Sesión</h1>
            <p className="text-gray-600 text-center mb-6">Bienvenido a EnWuan</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="email"
                type="email"
                label="Correo"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                name="password"
                type="password"
                label="Contraseña"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
                isLoading={loading}
              >
                Iniciar Sesión
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-purple-600 font-bold hover:underline">
                Registrate aquí
              </a>
            </p>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
