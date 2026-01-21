import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Select, SelectItem, Spinner } from '@nextui-org/react';
import { useAuth } from '../../contexts/AuthContext';
import { companiesService } from '../../services/api';
import { Building2, Mail, MapPin, Globe } from 'lucide-react';

const PLAN_TIERS = [
  {
    id: 'bronce',
    name: 'Plan Bronce',
    price: 'S/ 99',
    limit: '10 encuestas/mes',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'plata',
    name: 'Plan Plata',
    price: 'S/ 249',
    limit: '50 encuestas/mes',
    color: 'from-slate-400 to-slate-600',
  },
  {
    id: 'oro',
    name: 'Plan Oro',
    price: 'S/ 499',
    limit: 'Encuestas ilimitadas',
    color: 'from-yellow-400 to-yellow-600',
  },
];

export default function CompanyProfile() {
  const { firebaseUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sector: '',
    website: '',
    contactEmail: '',
    location: '',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!firebaseUser?.uid) return;
        
        const response = await companiesService.getCompanyByUserId(firebaseUser.uid);
        if (response.data) {
          setCompany(response.data);
          setFormData({
            name: response.data.name || '',
            description: response.data.description || '',
            sector: response.data.sector || '',
            website: response.data.website || '',
            contactEmail: response.data.contactEmail || firebaseUser.email || '',
            location: response.data.location || '',
          });
        }
      } catch (err) {
        console.error('Error fetching company:', err);
        setError('Error al cargar el perfil de la empresa');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [firebaseUser]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!company?.id) {
        setError('No se encontró la empresa');
        return;
      }

      await companiesService.updateCompany(company.id, formData);
      setCompany({ ...company, ...formData });
      setSuccess('Perfil actualizado correctamente');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Perfil de Empresa
        </h1>
        <p className="text-gray-600">Administra la información de tu empresa</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Company Info */}
      <Card className="shadow-lg mb-8">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-6">Información General</h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nombre de Empresa"
                placeholder="Ej: Mi Empresa SRL"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                startContent={<Building2 className="w-4 h-4 text-[#0764bf]" />}
              />

              <Select
                label="Sector"
                selectedKeys={formData.sector ? [formData.sector] : []}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              >
                <SelectItem key="retail">Retail</SelectItem>
                <SelectItem key="tech">Tecnología</SelectItem>
                <SelectItem key="finance">Finanzas</SelectItem>
                <SelectItem key="healthcare">Salud</SelectItem>
                <SelectItem key="education">Educación</SelectItem>
                <SelectItem key="other">Otro</SelectItem>
              </Select>
            </div>

            <Textarea
              label="Descripción"
              placeholder="Cuéntanos sobre tu empresa..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              minRows={4}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Email de Contacto"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                startContent={<Mail className="w-4 h-4 text-[#0764bf]" />}
              />

              <Input
                label="Sitio Web"
                placeholder="https://ejemplo.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                startContent={<Globe className="w-4 h-4 text-[#0764bf]" />}
              />
            </div>

            <Input
              label="Ubicación"
              placeholder="Ciudad, País"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              startContent={<MapPin className="w-4 h-4 text-[#0764bf]" />}
            />

            <Button
              className="w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
              size="lg"
              isLoading={saving}
              onClick={handleSave}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Current Plan */}
      <Card className="shadow-lg mb-8">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-6">Plan Actual</h2>
          
          <div className="p-4 bg-gradient-to-br from-[#0764bf]/10 to-[#1800ad]/10 rounded-lg border border-[#0764bf]/20 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Plan Activo:</p>
            <p className="text-2xl font-bold text-[#0764bf]">
              {company?.planTier?.charAt(0).toUpperCase() + company?.planTier?.slice(1) || 'Bronce'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Encuestas creadas: {company?.surveysCount || 0} / {company?.surveysLimit || 10}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            ¿Necesitas más capacidad? Consulta nuestros planes:
          </p>
        </CardBody>
      </Card>

      {/* Available Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_TIERS.map((plan) => (
          <Card key={plan.id} className={`shadow-lg border-2 ${company?.planTier === plan.id ? 'border-[#0764bf]' : 'border-transparent'}`}>
            <CardBody className="p-6 text-center">
              <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-sm font-bold mb-4`}>
                {plan.name}
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</p>
              <p className="text-sm text-gray-600 mb-4">/mes</p>

              <div className="border-t border-gray-200 my-4 py-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Límite:</p>
                <p className="text-lg font-bold text-[#0764bf]">{plan.limit}</p>
              </div>

              <Button
                className={`w-full ${company?.planTier === plan.id 
                  ? 'bg-[#0764bf] text-white' 
                  : 'border-[#0764bf] text-[#0764bf] border-1'
                }`}
                disabled={company?.planTier === plan.id}
              >
                {company?.planTier === plan.id ? 'Plan Actual' : 'Actualizar'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Contact Support */}
      <Card className="shadow-lg mt-8">
        <CardBody className="p-6 text-center">
          <h3 className="text-lg font-bold mb-2">¿Preguntas sobre nuestros planes?</h3>
          <p className="text-gray-600 mb-4">Contacta con nuestro equipo de soporte</p>
          <Button
            className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
            size="lg"
            as="a"
            href="mailto:soporte@enwuan.com"
          >
            Enviar Email
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
