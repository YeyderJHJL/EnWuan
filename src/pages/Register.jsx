import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input, Card, CardBody, Tabs, Tab } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState(searchParams.get('type') || 'user');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
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
      await signup(formData.email, formData.password, formData.displayName, accountType);
      navigate(accountType === 'business' ? '/onboarding/company' : '/surveys');
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
            <h1 className="text-3xl font-bold mb-2 text-center">Crear Cuenta</h1>
            <p className="text-gray-600 text-center mb-6">Únete a EnWuan hoy</p>

            <Tabs
              selectedKey={accountType}
              onSelectionChange={setAccountType}
              className="mb-6"
            >
              <Tab key="user" title="Usuario">
                Usuario
              </Tab>
              <Tab key="business" title="Empresa">
                Empresa
              </Tab>
            </Tabs>

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
                name="displayName"
                type="text"
                label="Nombre"
                placeholder="Tu nombre"
                value={formData.displayName}
                onChange={handleChange}
                required
              />

              <Input
                name="password"
                type="password"
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold"
                isLoading={loading}
              >
                Registrarse
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-purple-600 font-bold hover:underline">
                Inicia sesión
              </a>
            </p>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
