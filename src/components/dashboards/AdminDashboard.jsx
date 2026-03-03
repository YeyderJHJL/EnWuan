import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Tabs, Tab, Button } from '@nextui-org/react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/api';
import MainLayout from '../../layouts/MainLayout';
import { BarChart3, Users, Building2, TrendingUp, Heart, RefreshCw } from 'lucide-react';
import AdminUsers from '../admin/AdminUsers';
import AdminCompanies from '../admin/AdminCompanies';
import AdminSurveyCreation from '../admin/CreateTask';
import SurveysManagement from '../admin/TasksManagement';
import SystemUsersManagement from '../admin/UsersManagement';

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      const response = await adminService.getGlobalMetrics();
      setMetrics(response.data || {});
      console.log('AdminDashboard: Metrics updated', response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await fetchMetrics();
  };

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      console.log('AdminDashboard: Initial load');
      fetchMetrics();
    }
  }, [userProfile]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (userProfile?.role === 'admin' && !loading && !refreshing) {
        console.log('AdminDashboard: Auto-refreshing metrics...');
        fetchMetrics();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [userProfile, loading, refreshing]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const {
    totalUsers = 0,
    totalCompanies = 0,
    totalResponses = 0,
    averageQuality = 0,
    systemHealth = 100,
    totalRevenue = 0,
  } = metrics || {};

  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
            Panel Administrativo
          </h1>
          <Button
            size="sm"
            variant="flat"
            className="text-[#0764bf]"
            startContent={<RefreshCw className="w-4 h-4" />}
            onClick={handleRefresh}
            isLoading={refreshing}
          >
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Total de Usuarios */}
          <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#0764bf' }}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total de Usuarios</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#0764bf' }}>
                    {totalUsers}
                  </p>
                </div>
                <div className="p-4 rounded-full" style={{ backgroundColor: '#0764bf15' }}>
                  <Users className="w-8 h-8" style={{ color: '#0764bf' }} />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Total de Empresas */}
          <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#1800ad' }}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total de Empresas</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#1800ad' }}>
                    {totalCompanies}
                  </p>
                </div>
                <div className="p-4 rounded-full" style={{ backgroundColor: '#1800ad15' }}>
                  <Building2 className="w-8 h-8" style={{ color: '#1800ad' }} />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Total de Respuestas */}
          <Card className="shadow-lg border-l-4 border-blue-400">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Respuestas Recolectadas</p>
                  <p className="text-4xl font-bold mt-2 text-blue-400">
                    {totalResponses}
                  </p>
                </div>
                <div className="p-4 rounded-full bg-blue-100">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Calidad Promedio */}
          <Card className="shadow-lg border-l-4 border-green-500">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Calidad Promedio</p>
                  <p className="text-4xl font-bold mt-2 text-green-600">
                    {averageQuality.toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 rounded-full bg-green-100">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Salud del Sistema */}
          <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#01002e' }}>
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Salud del Sistema</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#01002e' }}>
                    {systemHealth}%
                  </p>
                </div>
                <div className="p-4 rounded-full" style={{ backgroundColor: '#01002e15' }}>
                  <Heart className="w-8 h-8" style={{ color: '#01002e' }} />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Ingresos Totales */}
          <Card className="shadow-lg border-l-4 border-yellow-500">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Ingresos Totales</p>
                  <p className="text-4xl font-bold mt-2 text-yellow-600">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-full bg-yellow-100">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Tabs para Gestión */}
        <Card className="shadow-lg">
          <CardBody className="p-0">
            <Tabs
              aria-label="Admin sections"
              color="primary"
              variant="light"
              classNames={{
                tabList: 'w-full p-4 border-b',
                cursor: 'w-full bg-gradient-to-r from-[#0764bf] to-[#1800ad]',
              }}
            >
              <Tab key="overview" title="Resumen" className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">Panel de control general del sistema</p>
                </div>
              </Tab>
              <Tab key="users" title="Usuarios" className="p-6">
                <AdminUsers />
              </Tab>
              <Tab key="companies" title="Empresas" className="p-6">
                <AdminCompanies />
              </Tab>
              <Tab key="create-survey" title="Crear Encuesta" className="p-6">
                <AdminSurveyCreation />
              </Tab>
              <Tab key="surveys" title="Gestionar Encuestas" className="p-6">
                <SurveysManagement />
              </Tab>
              <Tab key="system-users" title="Sistema de Usuarios" className="p-6">
                <SystemUsersManagement />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
