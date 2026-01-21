import { Link } from 'react-router-dom';
import { Button } from '@nextui-org/react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#01002e] text-gray-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              En<span style={{color: '#0764bf'}}>Wuan</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Plataforma de encuestas inteligentes con gamificación y validación por IA.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-[#0764bf] transition">LinkedIn</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-400 hover:text-[#0764bf] transition">Empezar</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-[#0764bf] transition">Iniciar Sesión</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Cómo Funciona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Precios</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6">Empresa</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Sobre Nosotros</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Contacto</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Carreras</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Términos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Cookies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#0764bf] transition">Contacta</a></li>
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
        <div className="bg-gradient-to-r from-[#0764bf] to-[#1800ad] rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Listo para empezar?
          </h3>
          <p className="text-white/80 mb-6">
            Únete a miles de usuarios que ya están ganando dinero
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-[#0764bf] font-bold">
              Registrarse Ahora
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
