import React from 'react';
import { Link } from 'react-router-dom';

export default function ListAreas() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* --- PageHeading --- */}
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-dark-charcoal dark:text-white text-3xl font-bold leading-tight tracking-tight">Library Areas</h1>
          <p className="text-neutral-gray text-base font-normal leading-normal">Manage and organize all the areas within the library.</p>
        </div>
        <Link 
          to="/admin/areas/add" 
          className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal shadow-sm transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="truncate">Create New Area</span>
        </Link>
      </header>
      
      {/* --- Content Card --- */}
      <div className="mt-8 rounded-xl border border-border-light bg-white p-4 dark:border-border-dark dark:bg-slate-900/70 sm:p-6">
        {/* SearchBar */}
        <div className="mb-4">
          <label className="flex flex-col min-w-40 h-11 w-full max-w-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <div className="text-neutral-gray flex items-center justify-center pl-3">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                className="form-input w-full flex-1 resize-none overflow-hidden bg-transparent text-dark-charcoal dark:text-white focus:outline-none focus:ring-0 border-none h-full placeholder:text-neutral-gray px-2 text-base font-normal leading-normal"
                placeholder="Search by area name..."
                defaultValue=""
              />
            </div>
          </label>
        </div>
        
        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark">
              <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                <thead className="bg-background-light dark:bg-background-dark">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-neutral-gray">
                      Area Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-neutral-gray">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-dark-charcoal dark:text-white">Children's Section</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link className="flex items-center gap-1 text-neutral-gray hover:text-primary" to="#">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <Link className="flex items-center gap-1 text-neutral-gray hover:text-destructive-red" to="#">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {/* ... (Otras filas de la tabla) ... */}
                  <tr>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-dark-charcoal dark:text-white">Fiction & Literature</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link className="flex items-center gap-1 text-neutral-gray hover:text-primary" to="#">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <Link className="flex items-center gap-1 text-neutral-gray hover:text-destructive-red" to="#">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* --- Pagination --- */}
        <nav className="flex items-center justify-between border-t border-border-light px-4 py-3 dark:border-border-dark sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm text-neutral-gray">
              Showing
              <span className="font-medium text-dark-charcoal dark:text-white"> 1 </span>
              to
              <span className="font-medium text-dark-charcoal dark:text-white"> 5 </span>
              of
              <span className="font-medium text-dark-charcoal dark:text-white"> 20 </span>
              results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <Link className="relative inline-flex items-center rounded-md border border-border-light bg-white px-4 py-2 text-sm font-medium text-neutral-gray hover:bg-background-light dark:border-border-dark dark:bg-slate-900 dark:hover:bg-slate-800" to="#">
              Previous
            </Link>
            <Link className="relative ml-3 inline-flex items-center rounded-md border border-border-light bg-white px-4 py-2 text-sm font-medium text-neutral-gray hover:bg-background-light dark:border-border-dark dark:bg-slate-900 dark:hover:bg-slate-800" to="#">
              Next
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}