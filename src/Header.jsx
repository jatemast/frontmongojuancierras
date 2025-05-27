import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';

export default function Header({ onNuevoClick }) {
  return (
    <div className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Matrícula
              </h1>
              <p className="text-gray-600">Selecciona tus asignaturas para el semestre</p>
            </div>
          </div>

          <button
            onClick={onNuevoClick}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Nueva Asignatura</span>
          </button>
        </div>
      </div>
    </div>
  );
}
