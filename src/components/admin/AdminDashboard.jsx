import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  Button, 
  Tabs, 
  Tab,
  Divider
} from '@nextui-org/react';
import { LogOut, LayoutDashboard, Users, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CreateTask from './CreateTask';
import TasksManagement from './TasksManagement';
import UsersManagement from './UsersManagement';

const AdminDashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" data-testid="admin-dashboard">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
                <LayoutDashboard className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <Button 
              color="danger" 
              variant="light"
              startContent={<LogOut size={18} />}
              onClick={handleLogout}
              data-testid="admin-logout-button"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg">
          <CardBody>
            <Tabs 
              aria-label="Admin sections"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              color="primary"
              variant="underlined"
              data-testid="admin-tabs"
            >
              <Tab 
                key="tasks" 
                title={
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} />
                    <span>Gestión de Tareas</span>
                  </div>
                }
              >
                <div className="py-6 space-y-6">
                  <CreateTask />
                  <Divider />
                  <TasksManagement />
                </div>
              </Tab>
              
              <Tab 
                key="users" 
                title={
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>Gestión de Usuarios</span>
                  </div>
                }
              >
                <div className="py-6">
                  <UsersManagement />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
