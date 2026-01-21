import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react';
import { UserCheck } from 'lucide-react';
import { adminService } from '../../services/api';

const SystemUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'business':
        return 'warning';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'business':
        return 'Empresa';
      case 'user':
        return 'Usuario';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Usuarios del Sistema ({users.length})</h2>
        <Button 
          size="sm" 
          variant="light"
          onClick={loadUsers}
          style={{color: '#0764bf'}}
        >
          Actualizar
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay usuarios registrados aún</p>
        </div>
      ) : (
        <Table aria-label="Tabla de usuarios">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROL</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCheck size={18} className="text-gray-400" />
                    <span className="font-medium">{user.displayName || 'Sin nombre'}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip color={getRoleColor(user.role)} variant="flat" size="sm">
                    {getRoleLabel(user.role)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={user.status === 'active' ? 'success' : 'danger'} 
                    variant="flat" 
                    size="sm"
                  >
                    {user.status === 'active' ? 'Activo' : 'Suspendido'}
                  </Chip>
                </TableCell>
                <TableCell>
                  {user.role !== 'admin' && (
                    <Button
                      size="sm"
                      color={user.status === 'active' ? 'warning' : 'success'}
                      variant="flat"
                      onClick={() => updateUserStatus(user.uid, user.status === 'active' ? 'suspended' : 'active')}
                    >
                      {user.status === 'active' ? 'Suspender' : 'Activar'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SystemUsersManagement;
