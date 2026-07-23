import React, { useState, useEffect } from 'react'
import Card from '../Components/Card'
import toast from 'react-hot-toast'

const Home = ({ cantidadCarrito, incrementarCarrito, carrito = [] }) => {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorNet, setErrorNet] = useState(null)
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  useEffect(() => {
    const obtenerDatosDeFirebase = async () => {
      try {
        setCargando(true)
        setErrorNet(null)

        const urlFirebase = "https://firestore.googleapis.com/v1/projects/ecommerce-iestpo/databases/(default)/documents/productos"
        const respuesta = await fetch(urlFirebase)
        
        if (!respuesta.ok) {
          throw new Error("No se pudo conectar al servidor")
        }

        const datosRaw = await respuesta.json();

        if (datosRaw.documents) {
          const productosLimpios = datosRaw.documents.map((doc) => {
            const urlImagenFirebase = doc.fields.imagen?.stringValue || "https://images.unsplash.com/photo-1587049352847-4d4b1f6305a4?w=500";
            
            return {
              id: Number(doc.fields.id?.integerValue || doc.fields.id?.doubleValue || 0),
              nombre: doc.fields.nombre?.stringValue || "Sin nombre",
              precio: Number(doc.fields.precio?.doubleValue || doc.fields.precio?.integerValue || 0),
              precioAntiguo: Number(doc.fields.precioAntiguo?.doubleValue || doc.fields.precioAntiguo?.integerValue || 0),
              descuento: doc.fields.descuento ? doc.fields.descuento.stringValue : "",
              imagen: urlImagenFirebase
            }
          })

          setProductos(productosLimpios)
        } else {
          setProductos([])
        }

      } catch (error) {
        console.error("Error al conectar con Firebase", error.message)
        setErrorNet("Error de conexión con el servidor de Google")
      } finally {
        setCargando(false)
      }
    }

    obtenerDatosDeFirebase()
  }, [])

  const totalCarrito = carrito.reduce((acumulado, prod) => {
    const precioSeguro = Number(prod.precio) || 0;
    const cantidadSegura = Number(prod.cantidad) || 1;
    return acumulado + (precioSeguro * cantidadSegura);
  }, 0);

  const productosFiltrados = productos.filter((producto) =>
    producto && producto.nombre
      ? producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      : false
  )
  
  const [correoRegistro, setCorreoRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [registrando, setRegistrando] = useState(false)

  const manejarRegistroRapido = async (e) => {
    e.preventDefault()

    if (!correoRegistro.trim() || !claveRegistro.trim()) {
      toast.error("Por favor, completa ambos campos.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correoRegistro)) {
      toast.error("Ingresa un correo válido.")
      return
    }

    if (claveRegistro.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setRegistrando(true)

    const urlApi = "https://firestore.googleapis.com/v1/projects/ecommerce-iestpo/databases/(default)/documents/usuarios"
    const payload = {
      fields: {
        correo: { stringValue: correoRegistro },
        clave: { stringValue: claveRegistro },
        fecha: { stringValue: new Date().toISOString() }
      }
    }

    try {
      const respuesta = await fetch(urlApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!respuesta.ok) throw new Error()

      toast.success("¡Cuenta creada con éxito!")
      setCorreoRegistro('')
      setClaveRegistro('')
    } catch (error) {
      toast.error("No se pudo registrar la cuenta.")
    } finally {
      setRegistrando(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos (ej. miel, café)..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-xl font-inter text-sm outline-none focus:border-emerald-700 shadow-sm"
        />
      </div>

      {/* Grilla Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mb-12">

        {/* SECCIÓN CATÁLOGO (Izquierda) */}
        <section className="text-left lg:col-span-3">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-900">Catálogo de Productos</h3>
            <span className="text-xs text-gray-500 font-inter">{productosFiltrados.length} resultados</span>
          </div>

          {cargando && (
            <p className="text-center text-amber-600 font-inter text-sm py-8 animate-pulse">
              Sincronizando catálogo con la nube de Google...
            </p>
          )}

          {!cargando && errorNet && (
            <p className="text-center text-red-500 font-inter text-sm py-8">
              ⚠️ Error: {errorNet}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
            {!cargando && productosFiltrados.length === 0 ? (
              <p className="col-span-full text-gray-500 font-inter text-sm py-8">
                No hay coincidencia en la base de datos para "{terminoBusqueda}".
              </p>
            ) : (
              productosFiltrados.map((item) => (
                <Card
                  key={item.id}
                  producto={item}
                  alAgregar={incrementarCarrito}
                />
              ))
            )}
          </div>
        </section>

        {/* COLUMNA LATERAL DERECHA */}
        <section className="flex flex-col gap-6 lg:col-span-1 max-w-xs w-full lg:justify-self-end">
          
          {/* ESTADO DEL SERVIDOR */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm text-left">
            <h3 className="font-bold text-gray-900 text-base mb-2">Estado del Servidor</h3>
            <div className="flex items-center gap-2 mb-4 font-inter text-xs">
              <span className={`w-3 h-3 rounded-full ${errorNet ? 'bg-red-500' : cargando ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              <span className="text-gray-600">
                {errorNet ? 'Desconectado' : cargando ? 'Sincronizando...' : 'Online (Firebase/Cloud)'}
              </span>
            </div>
            
            {/* Resumen de Compras integrado */}
            <div className="flex flex-col gap-2 font-inter text-xs text-gray-600 border-t pt-3">
              <div className="flex justify-between">
                <span>Productos ({cantidadCarrito}):</span>
                <span className="font-semibold text-gray-900">S/. {totalCarrito.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 mt-1">
                <span>Total:</span>
                <span>S/. {totalCarrito.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* FORMULARIO CREAR CUENTA */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 text-left">
            <h3 className="font-bold text-sm text-gray-800">Crear Cuenta</h3>
            <p className="text-xs text-gray-400 mb-3">Únete para comprar rápido y seguro.</p>
            
            <form onSubmit={manejarRegistroRapido} className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-500 block mb-1">Usuario / Correo</label>
                <input 
                  type="text" 
                  placeholder="Ingresa tu correo"
                  value={correoRegistro}
                  onChange={(e) => setCorreoRegistro(e.target.value)}
                  disabled={registrando}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-emerald-600"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-semibold text-gray-500 block mb-1">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={claveRegistro}
                  onChange={(e) => setClaveRegistro(e.target.value)}
                  disabled={registrando}
                  className="w-full p-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-emerald-600"
                />
              </div>

              <button 
                type="submit"
                disabled={registrando}
                className="w-full bg-emerald-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {registrando ? 'Registrando...' : 'Registrarme'}
              </button>
            </form>
          </div>

          {/* RESUMEN DE COMPRAS SEPARADO CON LISTADO DE PRODUCTOS AGREGADOS */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm text-left">
            <h3 className="font-bold text-gray-900 text-base mb-1">Resumen de Compras</h3>
            <p className="text-gray-500 font-inter text-xs mb-4">Productos en tu canasta.</p>

            {/* Mostramos los productos que se van agregando al carrito */}
            <div className="max-h-40 overflow-y-auto mb-4 flex flex-col gap-2">
              {carrito.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic">Tu canasta está vacía.</p>
              ) : (
                carrito.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs border-b pb-2">
                    <div className="truncate max-w-[150px]">
                      <span className="font-semibold text-emerald-700">{item.cantidad || 1}x</span> {item.nombre}
                    </div>
                    <span className="font-medium text-gray-700">S/. {((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4 font-inter text-xs">
              <div className="flex justify-between items-center text-gray-700 border-b pb-3">
                <span className="font-medium">Total de items:</span>
                <span className="font-bold text-emerald-600 text-sm">{cantidadCarrito}</span>
              </div>
              
              <button 
                onClick={() => {
                  if(carrito.length === 0) {
                    toast.error("¡Agrega al menos un producto para pagar!")
                  } else {
                    alert('Procediendo al pago...');
                  }
                }}
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-center"
              >
                Ir a Pagar
              </button>
            </div>
          </div>

        </section> 
      </div> 
    </main>
  )
}

export default Home