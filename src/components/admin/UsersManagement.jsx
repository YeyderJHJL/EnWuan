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
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole
      });
      // Actualizar estado local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error al actualizar rol:', error);
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
    <div className="space-y-4" data-testid="users-management">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Usuarios Registrados ({users.length})</h2>
        <Button 
          size="sm" 
          variant="light" 
          color="primary"
          onClick={loadUsers}
          data-testid="refresh-users-button"
        >
          Actualizar
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay usuarios registrados aún</p>
        </div>
      ) : (
        <Table aria-label="Tabla de usuarios" data-testid="users-table">
          <TableHeader>
            <TableColumn>NOMBRE</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>ROL</TableColumn>
            <TableColumn>SALDO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
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
                  <span className="font-semibold text-green-600">
                    S/. {user.balance?.toFixed(2) || '0.00'}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    data-testid={`user-role-select-${user.id}`}
                    size="sm"
                    placeholder="Cambiar rol"
                    className="w-40"
                    selectedKeys={[user.role]}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    <SelectItem key="user" value="user">Usuario</SelectItem>
                    <SelectItem key="business" value="business">Empresa</SelectItem>
                    <SelectItem key="admin" value="admin">Admin</SelectItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default UsersManagement;
