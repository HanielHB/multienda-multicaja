import React from 'react';
import { Link } from 'react-router-dom';

export default function ListEditoriales() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* --- PageHeading --- */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">Editoriales</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
            Gestiona todas las editoriales registradas
          </p>
        </div>
        <Link
          to="/admin/editoriales/add" // Enlace al formulario
          className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span className="truncate">Añadir Editorial</span>
        </Link>
      </header>

      {/* --- SearchBar --- */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            search
          </span>
          <input
            className="form-input w-full min-w-0 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder-gray-500 pl-12 pr-4 text-base font-normal"
            placeholder="Buscar por nombre..."
            defaultValue=""
          />
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nombre de la Editorial
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white text-sm font-normal">
                  Penguin Random House
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-center gap-4">
                    <button aria-label="Edit Publisher" className="text-primary hover:text-primary/80 transition-colors">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button aria-label="Delete Publisher" className="text-red-600 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* ... (Otras filas) ... */}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-medium">1-6</span> de <span className="font-medium">50</span> resultados
        </p>
        <nav className="flex items-center gap-2">
          <Link className="flex size-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" to="#">
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </Link>
          <Link className="text-sm font-bold flex size-9 items-center justify-center text-white rounded-lg bg-primary" to="#">1</Link>
          <Link className="text-sm font-medium flex size-9 items-center justify-center text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" to="#">2</Link>
          <Link className="flex size-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" to="#">
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}