import React from 'react';
import { BookOpen, DollarSign } from 'lucide-react';

export default function MateriaCard({ materia, carrito, agregarAlCarrito }) {
  const enCarrito = carrito.find(m => m._id === materia._id);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
            Sem. {materia.semestre}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
          {materia.nombre}
        </h3>
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="text-2xl font-bold text-green-600">
            ${materia.valor.toLocaleString()}
          </span>
        </div>
        <button
          data-materia={materia._id}
          onClick={() => agregarAlCarrito(materia)}
          disabled={enCarrito}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
            enCarrito
              ? 'bg-green-100 text-green-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {enCarrito ? 'Agregada ✓' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
