import React from 'react';
import { Link } from 'react-router-dom';

export default function AddTipoLiteratura() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* --- Page Heading --- */}
      <header className="flex flex-col items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-dark-charcoal dark:text-white text-3xl font-bold leading-tight tracking-tight">
            Formulario de Tipos de Literatura
          </h1>
          <p className="text-neutral-gray text-base font-normal leading-normal">
            Crea y gestiona los tipos de literatura disponibles en la biblioteca.
          </p>
        </div>
      </header>
      
      {/* --- Form Card --- */}
      <div className="mt-8 rounded-xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-slate-900/70 sm:p-6">
        <div className="mx-auto max-w-lg">
          <form className="flex flex-col items-center gap-6 py-8">
            <div className="w-full">
              <label 
                className="mb-2 block text-sm font-medium text-dark-charcoal dark:text-white" 
                htmlFor="nombre-tipo" // 'for' se convierte en 'htmlFor'
              >
                Nombre del Tipo de Literatura
              </label>
              <input
                className="form-input block w-full rounded-lg border border-border-light bg-background-light px-4 py-2 text-dark-charcoal placeholder:text-neutral-gray focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-white"
                id="nombre-tipo"
                placeholder="Ej: Novela, Poesía, Ensayo"
                type="text"
                defaultValue="" // En React, es mejor usar defaultValue o state
              />
            </div>
            <button
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold leading-normal shadow-sm transition-colors hover:bg-primary/90"
              type="submit"
            >
              <span className="material-symbols-outlined text-xl">save</span>
              <span className="truncate">Guardar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}