import React from 'react';
import { Link } from 'react-router-dom';

export default function ListRoles() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* --- Page Heading --- */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-dark-charcoal dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Lista de Roles
          </h1>
          <p className="text-neutral-gray text-base font-normal leading-normal">
            Gestiona los roles de usuario para la aplicación.
          </p>
        </div>
        {/* Convertí el botón en un Link que va al formulario que ya creamos */}
        <Link
          to="/admin/roles/add"
          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold leading-normal shadow-sm transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="truncate">Nuevo Rol</span>
        </Link>
      </header>

      {/* --- Content Card --- */}
      <div className="mt-8 rounded-xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-slate-900/70 sm:p-6">
        {/* SearchBar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray">
              search
            </span>
            <input
              className="form-input block w-full rounded-lg border border-border-light bg-background-light py-2 pl-10 pr-4 text-dark-charcoal placeholder:text-neutral-gray focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-white"
              id="search-role"
              placeholder="Buscar por nombre de rol..."
              type="text"
            />
          </div>
        </div>
        
        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-light text-xs uppercase text-neutral-gray dark:border-border-dark dark:text-neutral-400">
              <tr>
                <th scope="col" className="px-6 py-3">Nombre Rol</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border-light dark:border-border-dark">
                <td className="px-6 py-4 font-medium text-dark-charcoal dark:text-white">Administrador</td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined text-lg text-neutral-gray">edit</span>
                    </button>
                    <button className="flex items-center justify-center rounded-md p-2 hover:bg-red-50 dark:hover:bg-red-900/50">
                      <span className="material-symbols-outlined text-lg text-destructive-red">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* ... (Otras filas) ... */}
            </tbody>
          </table>
        </div>
        
        {/* --- Pagination --- */}
        <nav aria-label="Table navigation" className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm font-normal text-neutral-gray">
            Mostrando <span className="font-semibold text-dark-charcoal dark:text-white">1-4</span> de <span className="font-semibold text-dark-charcoal dark:text-white">10</span>
          </span>
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <Link className="flex h-8 items-center justify-center rounded-l-lg border border-border-light bg-white px-3 leading-tight text-neutral-gray hover:bg-gray-100 hover:text-dark-charcoal dark:border-border-dark dark:bg-background-dark dark:text-neutral-400 dark:hover:bg-gray-700 dark:hover:text-white" to="#">
                Anterior
              </Link>
            </li>
            <li>
              <Link className="flex h-8 items-center justify-center border border-border-light bg-primary px-3 leading-tight text-white dark:border-border-dark" to="#">1</Link>
            </li>
            <li>
              <Link className="flex h-8 items-center justify-center border border-border-light bg-white px-3 leading-tight text-neutral-gray hover:bg-gray-100 hover:text-dark-charcoal dark:border-border-dark dark:bg-background-dark dark:text-neutral-400 dark:hover:bg-gray-700 dark:hover:text-white" to="#">2</Link>
            </li>
            <li>
              <Link className="flex h-8 items-center justify-center rounded-r-lg border border-border-light bg-white px-3 leading-tight text-neutral-gray hover:bg-gray-100 hover:text-dark-charcoal dark:border-border-dark dark:bg-background-dark dark:text-neutral-400 dark:hover:bg-gray-700 dark:hover:text-white" to="#">
                Siguiente
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}