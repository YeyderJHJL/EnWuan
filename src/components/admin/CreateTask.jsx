import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Textarea, Button, Select, SelectItem, Spinner } from '@nextui-org/react';
import { Plus, DollarSign } from 'lucide-react';
import { surveysService, adminService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminSurveyCreation = () => {
  const { userProfile } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    companyId: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await adminService.getAllCompanies();
        setCompanies(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error loading companies:', err);
        setError('No se pudieron cargar las empresas');
      } finally {
        setCompaniesLoading(false);
      }
    };

    if (userProfile?.role === 'admin') {
      loadCompanies();
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await surveysService.createSurvey({
        title: formData.title,
        description: formData.description,
        reward: parseFloat(formData.reward),
        companyId: formData.companyId,
        isActive: true,
      });

      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        reward: '',
        companyId: userProfile?.companyId || '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error al crear la encuesta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#0764bf15'}}>
          <Plus className="w-5 h-5" style={{color: '#0764bf'}} />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold">Crear Nueva Encuesta</p>
          <p className="text-sm text-gray-500">Gestión de encuestas del sistema</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              ¡Encuesta creada exitosamente!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {companiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : (
            <>
              <Select
                label="Seleccionar Empresa"
                name="companyId"
                selectedKeys={formData.companyId ? [formData.companyId] : []}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                required
                variant="bordered"
              >
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="Título de la Encuesta"
                name="title"
                placeholder="Ej: Encuesta de satisfacción del cliente"
                value={formData.title}
                onChange={handleChange}
                required
                variant="bordered"
              />

              <Textarea
                label="Descripción"
                name="description"
                placeholder="Describe el propósito de la encuesta..."
                value={formData.description}
                onChange={handleChange}
                required
                variant="bordered"
                minRows={3}
              />

              <Input
                label="Recompensa (S/.)"
                name="reward"
                type="number"
                step="0.01"
                placeholder="Ej: 5.00"
                value={formData.reward}
                onChange={handleChange}
                required
                variant="bordered"
                startContent={<DollarSign size={18} className="text-gray-400" />}
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={loading}
                disabled={!formData.companyId}
                style={{backgroundColor: '#0764bf', color: 'white'}}
              >
                Crear Encuesta
              </Button>
            </>
          )}
        </form>
      </CardBody>
    </Card>
  );
};

export default AdminSurveyCreation;
