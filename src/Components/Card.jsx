import React from 'react'

const Card = ({ producto, alAgregar }) => {
  const { nombre, precio, precioAntiguo, descuento, imagen } = producto;

  return (
    <div className="bg-white border border-border-default rounded-radius-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:scale-[1.02] transition-all duration-300 font-inter p-3 max-w-[163px] md:max-w-xs w-full">
      
      <div className="w-full bg-bg-secondary rounded-radius-md overflow-hidden aspect-square flex items-center justify-center relative">
        <img src={imagen} alt={nombre} className="w-full h-full object-cover" />

        {descuento && (
          <span className="absolute top-2 left-2 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-radius-sm">
            {descuento}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-col flex-grow text-left">
        <h4 className="text-sm font-lora font-medium text-text-primary line-clamp-2 min-h-[40px]">
          {nombre}
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-2">
          <span className="text-base font-bold text-brand-primary">S/ {precio.toFixed(2)}</span>
          <span className="text-xs text-text-tertiary line-through">S/ {precioAntiguo.toFixed(2)}</span>
        </div>

        <button 
          onClick={() => alAgregar(producto)}
          className="w-full mt-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold py-2 px-4 rounded-radius-md transition-colors shadow-sm"
        >
          Añadir
        </button>
      </div>
    </div>
  )
}

export default Card