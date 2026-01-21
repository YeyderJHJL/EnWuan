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
  const [error, setError] = useState('');
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await signup(formData.email, formData.password, formData.displayName, accountType);
      
      // Redirigir según el tipo de cuenta
      if (accountType === 'business') {
        navigate('/onboarding/company');
      } else {
        navigate('/surveys');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#01002e]/5 to-[#0764bf]/5">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-t-4 border-[#1800ad]">
            <CardBody className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
                  Crear Cuenta
                </h1>
                <p className="text-gray-600">Únete a EnWuan hoy</p>
              </div>

              <Tabs
                selectedKey={accountType}
                onSelectionChange={setAccountType}
                className="mb-6"
                classNames={{
                  tabList: "bg-gray-100",
                  cursor: "bg-gradient-to-r from-[#0764bf] to-[#1800ad]",
                  tab: "data-[selected=true]:text-white",
                }}
              >
                <Tab key="user" title="👤 Usuario">
                  <p className="text-sm text-gray-600 mt-2">Gana dinero respondiendo encuestas</p>
                </Tab>
                <Tab key="business" title="🏢 Empresa">
                  <p className="text-sm text-gray-600 mt-2">Crea encuestas para tu negocio</p>
                </Tab>
              </Tabs>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  name="displayName"
                  type="text"
                  label={accountType === 'business' ? 'Nombre de la Empresa' : 'Nombre Completo'}
                  placeholder={accountType === 'business' ? 'Mi Empresa SAC' : 'Tu nombre completo'}
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  classNames={{
                    input: "text-base",
                    label: "text-sm font-medium"
                  }}
                />

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
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
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
                  {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <a href="/login" className="text-[#0764bf] font-bold hover:text-[#1800ad] transition-colors">
                    Inicia sesión
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
