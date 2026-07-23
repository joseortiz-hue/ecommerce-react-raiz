import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './views/Home'
import Login from './views/Login'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id)
      
      if (existe) {
        return prevCarrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
        )
      } else {
        return [...prevCarrito, { ...producto, cantidad: 1 }]
      }
    })
  }

  const cantidadCarrito = carrito.reduce((acumulado, item) => acumulado + (item.cantidad || 1), 0)

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      
      <div>
        <Header cantidad={cantidadCarrito} />

        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                cantidadCarrito={cantidadCarrito} 
                incrementarCarrito={agregarAlCarrito} 
                carrito={carrito} 
              />
            } 
          />
          <Route 
            path="/login" 
            element={<Login />} 
          />
        </Routes>
      </div>
      
      <div className="bg-gray-50">
        {/* Toast  */}
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>

      <Footer />
    </div>
  )
}

export default App