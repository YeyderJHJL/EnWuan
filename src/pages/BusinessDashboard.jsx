import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Spinner } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import { analyticsService, companiesService, surveysService } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, FileText, Star } from 'lucide-react';

export default function BusinessDashboard() {
  const { userProfile, firebaseUser } = useAuth();
  const [company, setCompany] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de la empresa
        const companyResponse = await companiesService.getCompanyByUserId(firebaseUser.uid);
        setCompany(companyResponse.data);

        if (companyResponse.data?.id) {
          // Obtener dashboard de la empresa
          const dashResponse = await analyticsService.getCompanyDashboard(companyResponse.data.id);
          setDashboard(dashResponse.data);

          // Obtener encuestas de la empresa
          const surveysResponse = await surveysService.getSurveysByCompany(companyResponse.data.id);
          setSurveys(surveysResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching business dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (firebaseUser) fetchData();
  }, [firebaseUser]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!company) {
    return (
      <MainLayout>
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Completa tu Perfil de Empresa</h2>
          <p className="text-gray-600 mb-6">Para comenzar a crear encuestas, primero debes completar los datos de tu empresa.</p>
          <Button
            as={Link}
            to="/onboarding/company"
            className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
            size="lg"
          >
            Completar Perfil
          </Button>
        </div>
      </MainLayout>
    );
  }

  const planColors = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-500 to-yellow-600',
  };

  return (
    <MainLayout>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
            Dashboard Empresarial
          </h1>
          <p className="text-gray-600">Bienvenido, {company.name}</p>
        </div>

        {/* Plan Info */}
        <Card className={`mb-8 bg-gradient-to-r ${planColors[company.plan] || planColors.bronze} text-white shadow-lg`}>
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold capitalize">Plan {company.plan}</h3>
                <p className="text-white/90">Estado: {company.status === 'active' ? 'Activo' : 'Pendiente'}</p>
              </div>
              <Button
                className="bg-white text-[#1800ad] font-bold"
                size="sm"
              >
                Mejorar Plan
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-l-4 border-[#0764bf]">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-[#0764bf]" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Encuestas</p>
                  <p className="text-3xl font-bold">{surveys.length}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-[#1800ad]">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="w-6 h-6 text-[#1800ad]" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Respuestas</p>
                  <p className="text-3xl font-bold">{dashboard?.totalSubmissions || 0}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-green-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Calidad Promedio</p>
                  <p className="text-3xl font-bold">{dashboard?.averageQuality || 0}%</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-orange-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Encuestas Activas</p>
                  <p className="text-3xl font-bold">
                    {surveys.filter(s => s.isActive).length}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Button
            as={Link}
            to="/business/create-survey"
            className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold h-16 text-lg"
            size="lg"
          >
            ✨ Crear Nueva Encuesta
          </Button>
          <Button
            as={Link}
            to="/business/surveys"
            variant="bordered"
            className="border-2 border-[#0764bf] text-[#0764bf] font-bold h-16 text-lg hover:bg-[#0764bf]/10"
            size="lg"
          >
            📊 Ver Todas Mis Encuestas
          </Button>
        </div>

        {/* Recent Surveys */}
        <h2 className="text-2xl font-bold mb-6">Encuestas Recientes</h2>
        {surveys.length === 0 ? (
          <Card className="shadow-lg">
            <CardBody className="p-12 text-center">
              <p className="text-gray-600 mb-4">No tienes encuestas aún</p>
              <Button
                as={Link}
                to="/business/create-survey"
                className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
              >
                Crear Primera Encuesta
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {surveys.slice(0, 4).map((survey) => (
              <Card key={survey.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{survey.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        survey.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {survey.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {survey.questions?.length || 0} preguntas
                    </span>
                    <Button
                      size="sm"
                      variant="flat"
                      className="text-[#0764bf] font-semibold"
                    >
                      Ver Detalles
                    </Button>
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