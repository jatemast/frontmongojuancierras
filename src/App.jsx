import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Trash2, X, Plus, BookOpen, Users, GraduationCap
} from 'lucide-react';

function App() {
  const [materias, setMaterias] = useState([]);
  const [semestre, setSemestre] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaMateria, setNuevaMateria] = useState({ nombre: '', semestre: '', valor: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://apimongodbjuancierras.onrender.com/materias');
      const data = await response.json();
      setMaterias(data);
    } catch (error) {
      console.error('Error cargando materias:', error);
      alert('Error cargando materias del servidor');
    } finally {
      setLoading(false);
    }
  };

  const materiasFiltradas = semestre
    ? materias.filter(m => m.semestre === Number(semestre))
    : materias;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNuevaMateria(prev => ({ ...prev, [name]: value }));
  };

  const agregarMateria = async () => {
    if (!nuevaMateria.nombre.trim() || !nuevaMateria.semestre || !nuevaMateria.valor) {
      alert('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://apimongodbjuancierras.onrender.com/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevaMateria.nombre.trim(),
          semestre: Number(nuevaMateria.semestre),
          valor: Number(nuevaMateria.valor)
        }),
      });
      const result = await response.json();
      alert(result.message || 'Materia agregada exitosamente');
      setNuevaMateria({ nombre: '', semestre: '', valor: '' });
      setMostrarFormulario(false);
      cargarMaterias();
    } catch (error) {
      console.error('Error agregando materia:', error);
      alert('Error agregando materia');
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (materia) => {
    if (!carrito.find(m => m._id === materia._id)) {
      setCarrito(prev => [...prev, materia]);
    }
  };

  const removerDelCarrito = (id) => {
    setCarrito(prev => prev.filter(m => m._id !== id));
  };

  const eliminarMateria = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta materia?')) return;
    setLoading(true);
    try {
      await fetch(`https://apimongodbjuancierras.onrender.com/materias/${id}`, { method: 'DELETE' });
      alert('Materia eliminada');
      cargarMaterias();
      setCarrito(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error('Error eliminando materia:', error);
      alert('Error eliminando materia');
    } finally {
      setLoading(false);
    }
  };

  const confirmarMatricula = async () => {
    if (carrito.length === 0) {
      alert('Selecciona al menos una materia');
      return;
    }
    setLoading(true);
    try {
      const total = carrito.reduce((acc, m) => acc + (m.valor || 0), 0);
      const response = await fetch('https://apimongodbjuancierras.onrender.com/matricular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materias: carrito, total })
      });
      await response.json();
      setMostrarCarrito(false);
      alert(`✅ Matrícula realizada con éxito\n\nMaterias:\n${carrito.map(m => `• ${m.nombre} (Semestre ${m.semestre})`).join('\n')}\n\nTotal: $${total.toLocaleString()}`);
      setCarrito([]);
    } catch (error) {
      console.error('Error realizando matrícula:', error);
      alert('Error realizando matrícula');
    } finally {
      setLoading(false);
    }
  };

  const totalCarrito = carrito.reduce((acc, m) => acc + (m.valor || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Sistema de Matrículas</h1>
                <p className="text-gray-600">Universidad Virtual</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMostrarFormulario(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Asignatura</span>
              </button>
              <button
                onClick={() => setMostrarCarrito(true)}
                className="relative bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                {carrito.length > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {carrito.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-end mb-6">
          <select
            onChange={e => setSemestre(e.target.value)}
            value={semestre}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm"
          >
            <option value="">Todos los semestres</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{`Semestre ${num}`}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && materiasFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No hay asignaturas para este semestre.</p>
            </div>
          ) : (
            materiasFiltradas.map(materia => (
              <div
                key={materia._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <h3 className="font-bold text-lg text-gray-800 mb-1">{materia.nombre}</h3>
                <p className="text-gray-600 mb-2">Semestre: <span className="font-medium">{materia.semestre}</span></p>
                <p className="text-purple-600 font-bold text-xl mb-4">${materia.valor?.toLocaleString()}</p>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => agregarAlCarrito(materia)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all font-semibold"
                  >
                    Matricular
                  </button>
                  <button
                    onClick={() => eliminarMateria(materia._id)}
                    className="flex items-center justify-center text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {mostrarCarrito && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-lg p-6 relative">
            <button onClick={() => setMostrarCarrito(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Materias Matriculadas</h2>
            {carrito.length === 0 ? (
              <p className="text-gray-600">No has matriculado ninguna materia.</p>
            ) : (
              <>
                <ul className="space-y-2 max-h-52 overflow-y-auto">
                  {carrito.map(m => (
                    <li key={m._id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                      <span className="font-semibold text-gray-800">{m.nombre}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-purple-600 font-bold">${m.valor?.toLocaleString()}</span>
                        <button onClick={() => removerDelCarrito(m._id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Resumen de Matrícula</h3>
                  <ul className="text-sm text-gray-700 mb-4 space-y-1 max-h-32 overflow-y-auto">
                    {carrito.map((m, i) => (
                      <li key={i}>• {m.nombre} (Semestre {m.semestre}) - ${m.valor?.toLocaleString()}</li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-purple-700">Total: ${totalCarrito.toLocaleString()}</span>
                    <button
                      onClick={confirmarMatricula}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      Confirmar Matrícula
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg p-6 relative">
            <button onClick={() => setMostrarFormulario(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Nueva Asignatura</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="nombre"
                value={nuevaMateria.nombre}
                onChange={handleInputChange}
                placeholder="Nombre de la asignatura"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <input
                type="number"
                name="semestre"
                value={nuevaMateria.semestre}
                onChange={handleInputChange}
                placeholder="Semestre"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <input
                type="number"
                name="valor"
                value={nuevaMateria.valor}
                onChange={handleInputChange}
                placeholder="Valor"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              />
              <button
                onClick={agregarMateria}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold w-full"
              >
                Agregar Asignatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
