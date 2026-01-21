import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/api';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

export default function AdminUsers() {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.getAllUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role === 'admin') fetchUsers();
  }, [userProfile]);

  const handleToggleStatus = async (uid, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminService.updateUserStatus(uid, newStatus);
      setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#0764bf' }}>
          <CardBody className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#0764bf15' }}>
                <Users className="w-6 h-6" style={{ color: '#0764bf' }} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Usuarios</p>
                <p className="text-3xl font-bold" style={{ color: '#0764bf' }}>{userStats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4" style={{ borderLeftColor: '#1800ad' }}>
          <CardBody className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full" style={{ backgroundColor: '#1800ad15' }}>
                <UserCheck className="w-6 h-6" style={{ color: '#1800ad' }} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Activos</p>
                <p className="text-3xl font-bold" style={{ color: '#1800ad' }}>{userStats.active}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-lg border-l-4 border-red-500">
          <CardBody className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Suspendidos</p>
                <p className="text-3xl font-bold text-red-600">{userStats.suspended}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-lg">
        <CardBody className="p-6">
          <Table aria-label="Users table">
            <TableHeader>
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ROL</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>REGISTRO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield className="w-4 h-4" style={{ color: '#1800ad' }} />}
                      <span className="font-semibold">{user.displayName || 'Sin nombre'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={user.role === 'admin' ? 'secondary' : user.role === 'business' ? 'primary' : 'default'}
                    >
                      {user.role === 'admin' ? 'Admin' : user.role === 'business' ? 'Empresa' : 'Usuario'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={user.status === 'active' ? 'success' : 'danger'}
                      variant="flat"
                    >
                      {user.status === 'active' ? 'Activo' : 'Suspendido'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        color={user.status === 'active' ? 'warning' : 'success'}
                        variant="flat"
                        onClick={() => handleToggleStatus(user.uid, user.status)}
                      >
                        {user.status === 'active' ? 'Suspender' : 'Activar'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
