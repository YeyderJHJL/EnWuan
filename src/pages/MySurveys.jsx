import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Spinner, Chip } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import { companiesService, surveysService } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import { Plus, Eye, ToggleLeft, ToggleRight, FileText } from 'lucide-react';

export default function MySurveys() {
  const { firebaseUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await companiesService.getCompanyByUserId(firebaseUser.uid);
        setCompany(companyResponse.data);

        if (companyResponse.data?.id) {
          const surveysResponse = await surveysService.getSurveysByCompany(companyResponse.data.id);
          setSurveys(surveysResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUser) fetchData();
  }, [firebaseUser]);

  const handleToggleActive = async (surveyId) => {
    try {
      await surveysService.toggleSurveyActive(surveyId);
      // Actualizar lista
      setSurveys(surveys.map(s => 
        s.id === surveyId ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (error) {
      console.error('Error toggling survey:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
              Mis Encuestas
            </h1>
            <p className="text-gray-600 mt-2">Gestiona todas tus encuestas</p>
          </div>
          <Button
            as={Link}
            to="/business/create-survey"
            className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
            size="lg"
            startContent={<Plus className="w-5 h-5" />}
          >
            Nueva Encuesta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <p className="text-gray-600 text-sm mb-1">Total Encuestas</p>
              <p className="text-4xl font-bold text-[#0764bf]">{surveys.length}</p>
            </CardBody>
          </Card>
          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <p className="text-gray-600 text-sm mb-1">Activas</p>
              <p className="text-4xl font-bold text-green-600">
                {surveys.filter(s => s.isActive).length}
              </p>
            </CardBody>
          </Card>
          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <p className="text-gray-600 text-sm mb-1">Inactivas</p>
              <p className="text-4xl font-bold text-gray-500">
                {surveys.filter(s => !s.isActive).length}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Surveys List */}
        {surveys.length === 0 ? (
          <Card className="shadow-lg">
            <CardBody className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No tienes encuestas aún</h3>
              <p className="text-gray-600 mb-6">Crea tu primera encuesta para comenzar a recibir feedback</p>
              <Button
                as={Link}
                to="/business/create-survey"
                className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
                size="lg"
              >
                Crear Primera Encuesta
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {surveys.map((survey) => (
              <Card key={survey.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{survey.title}</h3>
                        <Chip
                          color={survey.isActive ? 'success' : 'default'}
                          variant="flat"
                          size="sm"
                        >
                          {survey.isActive ? 'Activa' : 'Inactiva'}
                        </Chip>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{survey.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📝 {survey.questions?.length || 0} preguntas</span>
                        <span>💰 S/ {survey.reward} por respuesta</span>
                        <span>📅 Creada: {new Date(survey.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        className="text-[#0764bf]"
                        startContent={<Eye className="w-4 h-4" />}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color={survey.isActive ? 'warning' : 'success'}
                        onClick={() => handleToggleActive(survey.id)}
                        startContent={survey.isActive ? 
                          <ToggleRight className="w-4 h-4" /> : 
                          <ToggleLeft className="w-4 h-4" />
                        }
                      >
                        {survey.isActive ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}