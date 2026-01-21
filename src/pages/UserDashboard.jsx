import { useEffect, useState } from 'react';
import { Card, CardBody, Progress, Button, Spinner } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import { analyticsService, surveysService } from '../services/api';
import MainLayout from '../layouts/MainLayout';

export default function UserDashboard() {
  const { userProfile } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashResponse = await analyticsService.getUserDashboard();
        setDashboard(dashResponse.data);
        
        const surveysResponse = await surveysService.getActiveSurveys();
        setSurveys(surveysResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) fetchData();
  }, [userProfile]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  const levelColors = {
    bronze: 'bg-amber-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
  };

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Mi Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-l-4 border-green-500">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Saldo</p>
              <p className="text-3xl font-bold text-green-600">S/ {dashboard?.stats?.balance || 0}</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-[#0764bf]">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Encuestas Completadas</p>
              <p className="text-3xl font-bold text-[#0764bf]">{dashboard?.stats?.totalSubmissions || 0}</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-[#1800ad]">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Calidad Promedio</p>
              <p className="text-3xl font-bold text-[#1800ad]">
                {dashboard?.stats?.averageQuality || 0}%
              </p>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-yellow-500">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Nivel</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${levelColors[dashboard?.stats?.level]}`}></div>
                <p className="text-xl font-bold capitalize">{dashboard?.stats?.level}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="shadow-lg mb-8">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-4">Progreso de Nivel</h3>
            <Progress
              value={dashboard?.stats?.averageQuality || 0}
              className="mb-4"
              color={
                dashboard?.stats?.averageQuality >= 85
                  ? 'success'
                  : dashboard?.stats?.averageQuality >= 70
                  ? 'warning'
                  : 'danger'
              }
            />
            <p className="text-sm text-gray-600">
              {dashboard?.stats?.averageQuality >= 85 && 'Excelente - Sigue así!'}
              {dashboard?.stats?.averageQuality >= 70 && dashboard?.stats?.averageQuality < 85 && 'Bueno - Puedes mejorar'}
              {dashboard?.stats?.averageQuality < 70 && 'Regular - Intenta responder con más cuidado'}
            </p>
          </CardBody>
        </Card>

        {/* Available Surveys */}
        <h2 className="text-3xl font-bold mb-6">Encuestas Disponibles</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {surveys.length === 0 ? (
            <p className="text-gray-600">No hay encuestas disponibles en este momento</p>
          ) : (
            surveys.map((survey) => (
              <Card key={survey.id} className="shadow-lg">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold mb-2">{survey.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{survey.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">+${survey.reward}</span>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white font-bold"
                      as="a"
                      href={`/survey/${survey.id}`}
                    >
                      Responder
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Recent Activity */}
        {dashboard?.recentActivity && dashboard.recentActivity.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Actividad Reciente</h2>
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="space-y-4">
                  {dashboard.recentActivity.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-bold">Encuesta completada</p>
                        <p className="text-sm text-gray-600">Calidad: {activity.quality}%</p>
                      </div>
                      <span className="text-green-600 font-bold">+${activity.reward}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
