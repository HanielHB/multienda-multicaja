import React from 'react';

export default function ListLibros() {
  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6 md:p-8">
      {/* --- PageHeading --- */}
      <div className="flex flex-wrap justify-between gap-3">
        <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Explore Our Collection
        </p>
      </div>
      {/* --- Search and Filters --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* SearchBar */}
        <div className="flex-grow w-full">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-primary">
              <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Search by title, author, ISBN..."
                defaultValue=""
              />
            </div>
          </label>
        </div>
        {/* Chips */}
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 px-4">
            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal">Genre</p>
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-base">expand_more</span>
          </button>
          {/* ... otros botones de filtro ... */}
        </div>
      </div>
      {/* --- View Toggle --- */}
      <div className="flex justify-end">
        <div className="flex h-10 w-full max-w-xs sm:max-w-[160px] items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700">
          <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-900 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal transition-colors">
            <span className="material-symbols-outlined text-lg">grid_view</span>
            <span className="truncate hidden sm:inline">Grid</span>
            <input defaultChecked className="invisible w-0" name="view-toggle" type="radio" value="Grid" />
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center gap-2 overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-gray-900 has-[:checked]:shadow-sm has-[:checked]:text-gray-900 dark:has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal transition-colors">
            <span className="material-symbols-outlined text-lg">view_list</span>
            <span className="truncate hidden sm:inline">List</span>
            <input className="invisible w-0" name="view-toggle" type="radio" value="List" />
          </label>
        </div>
      </div>
      {/* --- Book Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* --- Book Card 1 --- */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
          <img className="h-56 w-full object-cover" alt="Cover of the book The Midnight Library" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtXG0CEaz_4QQqdUy8DLn8B_U3hJCtSAC_orLogjU4DgBmsX6kdJ-Bh1g3ioBu_pGPFeGWbxNWrYs6QZ9-uqoE2RcJYmTwvY8BNvPYO7z0Yj6Lvj0Vv2Ds1spMUi7iB-UyPLeEEA1mj3MtuLdZf0-KcfV61luvb0OawxL2MoBx4gnWjKrc9cjuKaOjuaDmDSswP5UqX2J0EFN6A5Z5xuUOgHWtGJTpp6H2OUh6reogZx8cIIVVPhh-S_Q7Q2uQBl_jwSXmOVFguzxl" />
          <div className="flex flex-col p-4 flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">The Midnight Library</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Matt Haig</p>
            <div className="inline-flex items-center gap-2 text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full px-3 py-1 self-start mb-4">
              <span className="size-2 bg-green-500 rounded-full"></span>
              Available
            </div>
            <button className="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 text-sm font-medium bg-primary text-white hover:bg-primary/90">Reserve</button>
          </div>
        </div>
        {/* --- Book Card 2 --- */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
          <img className="h-56 w-full object-cover" alt="Cover of the book The Four Winds" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC7n8pF-V7dYkYMVApp8puuTB7gYZnWKLcxsxlk-9PwtyUbx8EHqpPzq4jdXLmSTRadR52r_cfZG-SU05nuPQg4q4wY4BrY7r2bMVn2psr7MK6R_mjkLLKiG6YtFqJ7lcDAJHwXuHtP3SRSyChZwYw6DiSDPrRUCR71KOz4v_GyiCudQ9igX9iQB3celaApHgyVkwJQoZgvO3HZkgREH5Kbf2y7oiuFNHargpWWZ_aLZ6QqDWiBVz4XarMqrrlra3lESFuW_cyVo_k" />
          <div className="flex flex-col p-4 flex-grow">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">The Four Winds</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Kristin Hannah</p>
            <div className="inline-flex items-center gap-2 text-sm font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full px-3 py-1 self-start mb-4">
              <span className="size-2 bg-red-500 rounded-full"></span>
              Checked Out
            </div>
            <button className="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed">View Details</button>
          </div>
        </div>
        {/* ... (Puedes copiar y pegar más tarjetas de libro aquí) ... */}
      </div>
      {/* --- Pagination --- */}
      <div className="flex items-center justify-center p-4 mt-6">
        <nav className="flex items-center gap-2">
          <button className="flex items-center justify-center size-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button className="flex items-center justify-center size-10 rounded-lg bg-primary text-white font-medium text-sm">1</button>
          {/* ... otros botones de paginación ... */}
          <button className="flex items-center justify-center size-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </nav>
      </div>
    </main>
  );
}