import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  Button, 
  Tabs, 
  Tab
} from '@nextui-org/react';
import { LogOut, Wallet, ClipboardList, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import WalletCard from './WalletCard';
import AvailableTasks from './AvailableTasks';
import TaskHistory from './TaskHistory';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('tasks');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" data-testid="user-dashboard">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Wallet className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mi Dashboard</h1>
                <p className="text-xs text-gray-500">{currentUser?.displayName || currentUser?.email}</p>
              </div>
            </div>
            <Button 
              color="danger" 
              variant="light"
              startContent={<LogOut size={18} />}
              onClick={handleLogout}
              data-testid="user-logout-button"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">¡Hola, {currentUser?.displayName}!</h2>
          <p className="text-gray-600">Completa encuestas y gana dinero</p>
        </div>

        {/* Wallet Card */}
        <div className="mb-6">
          <WalletCard />
        </div>

        {/* Tabs para tareas */}
        <Card className="shadow-lg">
          <CardBody>
            <Tabs 
              aria-label="User sections"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              color="secondary"
              variant="underlined"
              data-testid="user-tabs"
            >
              <Tab 
                key="tasks" 
                title={
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} />
                    <span>Tareas Disponibles</span>
                  </div>
                }
              >
                <div className="py-6">
                  <AvailableTasks />
                </div>
              </Tab>
              
              <Tab 
                key="history" 
                title={
                  <div className="flex items-center gap-2">
                    <History size={18} />
                    <span>Historial</span>
                  </div>
                }
              >
                <div className="py-6">
                  <TaskHistory />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
