#!/bin/bash
# Script de verificación de proyecto EnWuan

echo "🔍 Verificando estructura del proyecto EnWuan..."
echo ""

# Backend
echo "📂 Backend:"
echo -n "  ✓ /backend/src/auth/ ... "
[ -d "backend/src/auth" ] && echo "✅" || echo "❌"

echo -n "  ✓ /backend/src/surveys/ ... "
[ -d "backend/src/surveys" ] && echo "✅" || echo "❌"

echo -n "  ✓ /backend/src/submissions/ ... "
[ -d "backend/src/submissions" ] && echo "✅" || echo "❌"

echo -n "  ✓ /backend/src/analytics/ ... "
[ -d "backend/src/analytics" ] && echo "✅" || echo "❌"

echo -n "  ✓ /backend/src/admin/ ... "
[ -d "backend/src/admin" ] && echo "✅" || echo "❌"

echo -n "  ✓ /backend/.env ... "
[ -f "backend/.env" ] && echo "✅" || echo "❌"

# Frontend
echo ""
echo "🎨 Frontend:"
echo -n "  ✓ /src/pages/ ... "
[ -d "src/pages" ] && echo "✅" || echo "❌"

echo -n "  ✓ /src/layouts/ ... "
[ -d "src/layouts" ] && echo "✅" || echo "❌"

echo -n "  ✓ /src/components/ ... "
[ -d "src/components" ] && echo "✅" || echo "❌"

echo -n "  ✓ /src/services/api.js ... "
[ -f "src/services/api.js" ] && echo "✅" || echo "❌"

echo -n "  ✓ /src/contexts/AuthContext.jsx ... "
[ -f "src/contexts/AuthContext.jsx" ] && echo "✅" || echo "❌"

echo -n "  ✓ /.env ... "
[ -f ".env" ] && echo "✅" || echo "❌"

# Documentación
echo ""
echo "📚 Documentación:"
echo -n "  ✓ /IMPLEMENTATION_STATUS.md ... "
[ -f "IMPLEMENTATION_STATUS.md" ] && echo "✅" || echo "❌"

echo -n "  ✓ /QUICK_START.md ... "
[ -f "QUICK_START.md" ] && echo "✅" || echo "❌"

echo ""
echo "✨ Verificación completada!"
