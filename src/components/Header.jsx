import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Header() {
  const { currentUser, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Menú según rol
  const getUserMenuItems = () => {
    if (!currentUser) {
      return [
        { label: 'Inicio', href: '/#inicio' },
        { label: 'Qué es EnWuan', href: '/#que-es' },
        { label: 'Cómo funciona', href: '/#como-funciona' },
        { label: 'Servicios', href: '/#servicios' },
        { label: 'Planes', href: '/#planes' },
        { label: 'Contacto', href: '/#contacto' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { label: 'Dashboard', href: '/dashboard/admin' },
        { label: 'Usuarios', href: '/admin/users' },
        { label: 'Empresas', href: '/admin/companies' },
        { label: 'Métricas', href: '/dashboard/admin#metrics' },
      ];
    }

    if (userRole === 'business') {
      return [
        { label: 'Dashboard', href: '/dashboard/business' },
        { label: 'Crear Encuesta', href: '/business/create-survey' },
        { label: 'Mis Encuestas', href: '/business/surveys' },
        { label: 'Análisis', href: '/dashboard/business#analytics' },
      ];
    }

    // Usuario normal
    return [
      { label: 'Dashboard', href: '/dashboard/user' },
      { label: 'Encuestas', href: '/surveys' },
      { label: 'Mis Ingresos', href: '/dashboard/user#ingresos' },
      { label: 'Historial', href: '/dashboard/user#historial' },
    ];
  };

  const menuItems = getUserMenuItems();

  return (
    <Navbar 
      isBordered 
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gradient-to-r from-[#01002e] via-[#1800ad] to-[#0764bf] shadow-lg"
      maxWidth="xl"
    >
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="text-white" />
      </NavbarContent>

      {/* Brand */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand as={Link} to="/" className="cursor-pointer">
          <div className="text-white font-bold text-2xl">✨ EnWuan</div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand as={Link} to="/" className="cursor-pointer">
          <div className="text-white font-bold text-2xl">✨ EnWuan</div>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {menuItems.slice(0, 4).map((item, index) => (
          <NavbarItem key={index}>
            <Link 
              to={item.href} 
              className="text-white hover:text-blue-200 transition-colors font-medium"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Right side */}
      <NavbarContent justify="end">
        {currentUser && userProfile ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="hidden sm:block text-right">
                  <p className="text-white font-semibold text-sm">{userProfile.displayName}</p>
                  <p className="text-blue-200 text-xs capitalize">{userRole}</p>
                </div>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:scale-110"
                  color="primary"
                  name={userProfile.displayName}
                  size="sm"
                  src={userProfile.photoURL}
                  style={{ borderColor: '#0764bf' }}
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Conectado como</p>
                <p className="font-semibold">{userProfile.email}</p>
              </DropdownItem>
              <DropdownItem key="profile-page" as={Link} to="/profile">
                Mi Perfil
              </DropdownItem>
              {userProfile.balance !== undefined && (
                <DropdownItem key="balance">
                  Saldo: S/ {userProfile.balance?.toFixed(2) || '0.00'}
                </DropdownItem>
              )}
              {userProfile.level && (
                <DropdownItem key="level">
                  Nivel: <span className="capitalize">{userProfile.level}</span>
                </DropdownItem>
              )}
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex gap-2">
            <NavbarItem className="hidden sm:flex">
              <Button 
                as={Link} 
                to="/login" 
                variant="light" 
                className="text-white hover:bg-white/10"
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                to="/register" 
                className="bg-white text-[#1800ad] font-bold hover:bg-blue-50"
              >
                Registrarse
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-[#01002e]/95 pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full text-white hover:text-blue-200 transition-colors text-lg py-2"
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {!currentUser && (
          <>
            <NavbarMenuItem>
              <Link
                className="w-full text-blue-200 hover:text-white transition-colors text-lg py-2"
                to="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="w-full text-blue-200 hover:text-white transition-colors text-lg py-2 font-bold"
                to="/register"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </Link>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
