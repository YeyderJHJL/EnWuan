import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              En<span className="text-purple-400">Wuan</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Plataforma de encuestas inteligentes con gamificación y validación por IA.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-400 hover:text-white">Empezar</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white">Iniciar Sesión</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cómo Funciona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Precios</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Carreras</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">Términos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contacta</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} EnWuan. Todos los derechos reservados. | 
            Hecho con ❤️ en Perú 🇵🇪
          </p>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h3>
          <p className="text-white/80 mb-6">
            Únete a miles de usuarios que ya están ganando dinero
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-indigo-600 font-bold">
              Registrarse Ahora
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
