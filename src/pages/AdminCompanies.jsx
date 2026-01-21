import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, Button, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import { Building2, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminCompanies() {
  const { userProfile } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, pendingRes] = await Promise.all([
          adminService.getAllCompanies(),
          adminService.getPendingCompanies(),
        ]);
        setCompanies(companiesRes.data || []);
        setPendingCompanies(pendingRes.data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile?.role === 'admin') fetchData();
  }, [userProfile]);

  const handleToggleStatus = async (companyId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminService.updateCompanyStatus(companyId, newStatus);
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const handleApprove = async (companyId) => {
    try {
      await adminService.updateCompanyStatus(companyId, 'active');
      setPendingCompanies(pendingCompanies.filter(c => c.id !== companyId));
      // Refrescar lista de empresas
      const response = await adminService.getAllCompanies();
      setCompanies(response.data || []);
    } catch (error) {
      console.error('Error approving company:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  const stats = {
    total: companies.length,
    active: companies.filter(c => c.status === 'active').length,
    pending: pendingCompanies.length,
    suspended: companies.filter(c => c.status === 'suspended').length,
  };

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Gestión de Empresas
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-l-4 border-blue-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-green-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Activas</p>
                  <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-orange-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border-l-4 border-red-500">
            <CardBody className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Suspendidas</p>
                  <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Pending Companies */}
        {pendingCompanies.length > 0 && (
          <Card className="shadow-lg mb-8 border-l-4 border-orange-500">
            <CardBody className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Empresas Pendientes de Aprobación
              </h2>
              <Table aria-label="Pending companies table">
                <TableHeader>
                  <TableColumn>EMPRESA</TableColumn>
                  <TableColumn>SECTOR</TableColumn>
                  <TableColumn>PLAN</TableColumn>
                  <TableColumn>REGISTRO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody>
                  {pendingCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{company.name}</p>
                          <p className="text-xs text-gray-500">{company.description?.substring(0, 50)}...</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{company.sector}</TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" className="capitalize">
                          {company.plan}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {company.createdAt ? new Date(company.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            onClick={() => handleApprove(company.id)}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                          >
                            Rechazar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}

        {/* All Companies */}
        <Card className="shadow-lg">
          <CardBody className="p-6">
            <h2 className="text-2xl font-bold mb-4">Todas las Empresas</h2>
            <Table aria-label="Companies table">
              <TableHeader>
                <TableColumn>EMPRESA</TableColumn>
                <TableColumn>SECTOR</TableColumn>
                <TableColumn>PLAN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>REGISTRO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{company.name}</p>
                        <p className="text-xs text-gray-500">{company.description?.substring(0, 50)}...</p>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{company.sector}</TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          company.plan === 'gold' ? 'warning' :
                          company.plan === 'silver' ? 'default' : 'default'
                        }
                        className="capitalize"
                      >
                        {company.plan}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={company.status === 'active' ? 'success' : 'danger'}
                        variant="flat"
                      >
                        {company.status === 'active' ? 'Activa' : 'Suspendida'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {company.createdAt ? new Date(company.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color={company.status === 'active' ? 'warning' : 'success'}
                        variant="flat"
                        onClick={() => handleToggleStatus(company.id, company.status)}
                      >
                        {company.status === 'active' ? 'Suspender' : 'Activar'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}