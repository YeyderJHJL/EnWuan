import { useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { companiesService } from '../services/api';
import MainLayout from '../layouts/MainLayout';

export default function CompanyOnboarding() {
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sector: 'restaurant',
    plan: 'bronze',
    website: '',
    phone: '',
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
      await companiesService.createCompany(formData);
      navigate('/dashboard/business');
    } catch (error) {
      console.error('Error creating company:', error);
      setError('Error al crear la empresa. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Card className="shadow-2xl border-t-4 border-[#0764bf]">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
                Completa tu Perfil de Empresa
              </h1>
              <p className="text-gray-600">Cuéntanos más sobre tu negocio</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                name="name"
                label="Nombre de la Empresa"
                placeholder="Mi Restaurante SAC"
                value={formData.name}
                onChange={handleChange}
                required
                size="lg"
              />

              <Textarea
                name="description"
                label="Descripción"
                placeholder="Cuéntanos sobre tu empresa..."
                value={formData.description}
                onChange={handleChange}
                required
                minRows={4}
              />

              <Select
                name="sector"
                label="Sector"
                placeholder="Selecciona un sector"
                selectedKeys={[formData.sector]}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                required
              >
                <SelectItem key="restaurant" value="restaurant">
                  Restaurante
                </SelectItem>
                <SelectItem key="retail" value="retail">
                  Retail
                </SelectItem>
                <SelectItem key="services" value="services">
                  Servicios
                </SelectItem>
                <SelectItem key="healthcare" value="healthcare">
                  Salud
                </SelectItem>
                <SelectItem key="education" value="education">
                  Educación
                </SelectItem>
                <SelectItem key="technology" value="technology">
                  Tecnología
                </SelectItem>
                <SelectItem key="other" value="other">
                  Otro
                </SelectItem>
              </Select>

              <Select
                name="plan"
                label="Plan"
                placeholder="Selecciona un plan"
                selectedKeys={[formData.plan]}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                required
                description="Puedes cambiar tu plan más tarde"
              >
                <SelectItem key="bronze" value="bronze">
                  Bronce - Básico
                </SelectItem>
                <SelectItem key="silver" value="silver">
                  Plata - Estándar
                </SelectItem>
                <SelectItem key="gold" value="gold">
                  Oro - Premium
                </SelectItem>
              </Select>

              <Input
                name="website"
                type="url"
                label="Sitio Web (Opcional)"
                placeholder="https://tuempresa.com"
                value={formData.website}
                onChange={handleChange}
              />

              <Input
                name="phone"
                type="tel"
                label="Teléfono (Opcional)"
                placeholder="+51 999 999 999"
                value={formData.phone}
                onChange={handleChange}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold py-6"
                isLoading={loading}
                size="lg"
              >
                {loading ? 'Creando perfil...' : 'Completar Registro'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}