import React from 'react'
import { Link } from 'react-router-dom' 

const Header = ({ cantidad }) => {
  return (
    <header className="bg-white border-b border-gray-200/80 p-4 flex justify-between items-center sticky top-0 z-50 font-inter shadow-sm">
      <div className="header-logo">
        {/* Al hacer clic en el título, te lleva a la raíz '/' sin recargar la página */}
        <Link to="/" className="text-xl font-bold text-[#1e3a1e] tracking-tight hover:opacity-90">
          Raíz Oxapampina
        </Link>
      </div>

      <nav className="flex items-center gap-6">
        {/* Enlace dinámico que te manda a la nueva vista /login de la Semana 14 */}
        <Link to="/login" className="text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors">
          Crear Cuenta
        </Link>

        {/* Ícono del Carrito de compras */}
        <div className="relative cursor-pointer hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm font-inter">
            {cantidad}
          </span>
        </div>
      </nav>
    </header>
  )
}

export default Header