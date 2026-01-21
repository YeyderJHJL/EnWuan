import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Button } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/api';
import MainLayout from '../layouts/MainLayout';

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await adminService.getGlobalMetrics();
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role === 'admin') fetchMetrics();
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

  if (userProfile?.role !== 'admin') {
    return (
      <MainLayout>
        <p className="text-red-600 text-center py-8">Acceso denegado</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8">Panel de Administrador</h1>

        {/* Global Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Usuarios Activos</p>
              <p className="text-4xl font-bold text-blue-600">{metrics?.totalUsers || 0}</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Total Respuestas</p>
              <p className="text-4xl font-bold text-green-600">{metrics?.totalSubmissions || 0}</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Calidad Promedio</p>
              <p className="text-4xl font-bold text-purple-600">{metrics?.averageQuality || 0}%</p>
            </CardBody>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <CardBody className="p-6">
              <p className="text-gray-600 text-sm">Ingresos Totales</p>
              <p className="text-4xl font-bold text-amber-600">${metrics?.totalRevenue || 0}</p>
            </CardBody>
          </Card>
        </div>

        {/* Companies by Level */}
        <Card className="shadow-lg mb-8">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold mb-6">Empresas por Nivel</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-gray-600 text-sm">Bronce</p>
                <p className="text-3xl font-bold text-amber-600">{metrics?.companiesByLevel?.bronze || 0}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">Plata</p>
                <p className="text-3xl font-bold text-gray-600">{metrics?.companiesByLevel?.silver || 0}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-gray-600 text-sm">Oro</p>
                <p className="text-3xl font-bold text-yellow-600">{metrics?.companiesByLevel?.gold || 0}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Management Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            className="bg-purple-600 text-white font-bold"
            size="lg"
            as="a"
            href="/admin/users"
          >
            Gestionar Usuarios
          </Button>
          <Button
            className="bg-purple-600 text-white font-bold"
            size="lg"
            as="a"
            href="/admin/companies"
          >
            Gestionar Empresas
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
