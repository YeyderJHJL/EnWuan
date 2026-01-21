import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { userProfile, logout } = useAuth();

  return (
    <Navbar isBordered className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <NavbarBrand as={Link} to="/" className="cursor-pointer">
        <div className="text-white font-bold text-xl">✨ EnWuan</div>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/surveys" className="text-white hover:text-purple-200 transition">
            Encuestas
          </Link>
        </NavbarItem>
        {userProfile?.role === 'business' && (
          <NavbarItem>
            <Link to="/dashboard/company" className="text-white hover:text-purple-200 transition">
              Mis Encuestas
            </Link>
          </NavbarItem>
        )}
        {userProfile?.role === 'admin' && (
          <NavbarItem>
            <Link to="/dashboard/admin" className="text-white hover:text-purple-200 transition">
              Panel Admin
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        {userProfile ? (
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={userProfile.displayName}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile" as={Link} to="/profile">
                Perfil
              </DropdownItem>
              <DropdownItem key="balance">Saldo: ${userProfile.balance}</DropdownItem>
              <DropdownItem key="level">Nivel: {userProfile.level}</DropdownItem>
              <DropdownItem key="logout" onClick={logout} className="text-danger">
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} to="/login" variant="light" className="text-white">
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} to="/register" className="bg-white text-purple-600 font-bold">
                Registrarse
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
