import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  Button, 
  Tabs, 
  Tab,
  Divider
} from '@nextui-org/react';
import { LogOut, Briefcase, Plus, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CreateTask from '../admin/CreateTask';
import MySurveys from './MySurveys';

const BusinessDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('create');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50" data-testid="business-dashboard">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <Briefcase className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Empresa</h1>
                <p className="text-xs text-gray-500">{currentUser?.displayName || currentUser?.email}</p>
              </div>
            </div>
            <Button 
              color="danger" 
              variant="light"
              startContent={<LogOut size={18} />}
              onClick={handleLogout}
              data-testid="business-logout-button"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {currentUser?.displayName}</h2>
          <p className="text-gray-600">Crea y gestiona tus encuestas</p>
        </div>

        <Card className="shadow-lg">
          <CardBody>
            <Tabs 
              aria-label="Business sections"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              color="warning"
              variant="underlined"
              data-testid="business-tabs"
            >
              <Tab 
                key="create" 
                title={
                  <div className="flex items-center gap-2">
                    <Plus size={18} />
                    <span>Crear Encuesta</span>
                  </div>
                }
              >
                <div className="py-6">
                  <CreateTask />
                </div>
              </Tab>
              
              <Tab 
                key="surveys" 
                title={
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} />
                    <span>Mis Encuestas</span>
                  </div>
                }
              >
                <div className="py-6">
                  <MySurveys />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDashboard;
