import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast' 

const Login = () => {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('') 
  const [errorValidacion, setErrorValidacion] = useState('') 
  const [procesando, setProcesando] = useState(false) 
  const navigate = useNavigate()

  const registrarUsuario = async (e) => {
    e.preventDefault()
    setErrorValidacion('')

    if (!correo.trim()) {
      setErrorValidacion("El correo no puede estar vacío.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      setErrorValidacion("Por favor, ingresa un correo electrónico válido.")
      return
    }

    if (!clave.trim()) {
      setErrorValidacion("La contraseña no puede estar vacía.")
      return
    }

    if (clave.length < 6) {
      setErrorValidacion("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setProcesando(true)

    const urlApi = "https://firestore.googleapis.com/v1/projects/ecommerce-iestpo/databases/(default)/documents/usuarios"
    
  
    const payload = {
      fields: {
        correo: { stringValue: correo },
        clave: { stringValue: clave },
        fecha: { stringValue: new Date().toISOString() }
      }
    }

    try {
      const respuesta = await fetch(urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!respuesta.ok) {
        throw new Error("Fallo en el servidor de base de datos")
      }

      toast.success("¡Bienvenido a Raíz Oxapampina!")
      navigate('/')

    } catch (error) {
      toast.error(error.message || "Error al conectar con el servidor")
    } finally {
      setProcesando(false)
      setCorreo('')
      setClave('')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-10 text-left">
      <h2 className="text-xl font-bold text-emerald-800 mb-2 text-center">Registro de Clientes</h2>
      <p className="text-xs text-gray-500 mb-6 text-center">Regístrate para comprar rápido y de manera segura.</p>

      <form onSubmit={registrarUsuario} className="flex flex-col gap-4">
        {/* CAMPO CORREO */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Correo Electrónico</label>
          <input
            type="text"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value)
              setErrorValidacion('') 
            }}
            disabled={procesando} 
            className={`w-full p-2.5 text-xs border rounded-lg outline-none transition-colors ${
              errorValidacion && !correo.trim()
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-emerald-600'
            }`}
          />
        </div>

        {/* CAMPO CONTRASEÑA */}
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={clave}
            onChange={(e) => {
              setClave(e.target.value)
              setErrorValidacion('')
            }}
            disabled={procesando}
            className={`w-full p-2.5 text-xs border rounded-lg outline-none transition-colors ${
              errorValidacion && (!clave.trim() || clave.length < 6)
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-200 focus:border-emerald-600'
            }`}
          />
          {/* RENDERIZADO CONDICIONAL DEL ERROR DE VALIDACIÓN */}
          {errorValidacion && (
            <p className="text-red-500 text-xs mt-1 font-medium">{errorValidacion}</p>
          )}
        </div>

        {/* BOTÓN CON SPINNER DINÁMICO */}
        <button
          type="submit"
          disabled={procesando} 
          className={`w-full text-white text-xs font-semibold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 ${
            procesando 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {procesando ? (
            <>
              {/* SPINNER SVG ANIMADO */}
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Conectando...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>
    </div>
  )
}

export default Login