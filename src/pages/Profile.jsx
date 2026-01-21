import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Avatar } from '@nextui-org/react';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../layouts/MainLayout';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { userProfile, firebaseUser, userRole } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!userProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando perfil...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#0764bf] to-[#1800ad] bg-clip-text text-transparent">
          Mi Perfil
        </h1>

        {/* Profile Card */}
        <Card className="shadow-2xl mb-6">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar
                src={userProfile.photoURL}
                name={userProfile.displayName}
                className="w-32 h-32 text-large"
                isBordered
                color="primary"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">{userProfile.displayName}</h2>
                <p className="text-gray-600 mb-1">{userProfile.email}</p>
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-[#0764bf] to-[#1800ad] text-white rounded-full text-sm font-semibold capitalize">
                  {userRole}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardBody className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-[#0764bf]" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">Usuario desde</p>
              <p className="text-lg font-bold">
                {new Date(userProfile.createdAt).toLocaleDateString('es-ES')}
              </p>
            </CardBody>
          </Card>

          {userProfile.balance !== undefined && (
            <Card className="shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Saldo Actual</p>
                <p className="text-2xl font-bold text-green-600">
                  S/ {userProfile.balance?.toFixed(2) || '0.00'}
                </p>
              </CardBody>
            </Card>
          )}

          {userProfile.level && (
            <Card className="shadow-lg">
              <CardBody className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Nivel</p>
                <p className="text-xl font-bold capitalize">{userProfile.level}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Account Info */}
        <Card className="shadow-lg">
          <CardBody className="p-8">
            <h3 className="text-2xl font-bold mb-6">Información de la Cuenta</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-[#0764bf]" />
                <div>
                  <p className="text-sm text-gray-600">Correo Electrónico</p>
                  <p className="font-semibold">{userProfile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-[#0764bf]" />
                <div>
                  <p className="text-sm text-gray-600">Rol</p>
                  <p className="font-semibold capitalize">{userRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-[#0764bf]" />
                <div>
                  <p className="text-sm text-gray-600">ID de Usuario</p>
                  <p className="font-mono text-sm">{firebaseUser?.uid}</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}