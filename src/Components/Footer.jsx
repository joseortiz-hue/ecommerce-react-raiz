import React from 'react'

const Footer = () => {
  const anio = 2026

  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex gap-4">
          <a href="#ayuda" className="hover:text-emerald-600 transition-colors">Centro de Ayuda</a>
          <a href="#terminos" className="hover:text-emerald-600 transition-colors">Términos y Condiciones</a>
        </div>
        <p>&copy; {anio} Oxapampa Raíz Selva. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer