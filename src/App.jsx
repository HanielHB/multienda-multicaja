import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    // Estilos globales de fondo y fuente para toda la app
    <div className="font-display bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
              
              {/* --- TopNavBar (HEADER GLOBAL) --- */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-6 md:px-10 py-3">
                <div className="flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined text-3xl">local_library</span>
                  <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Library
                  </h2>
                </div>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                  <div className="flex items-center gap-9">
                    <Link className="text-gray-900 dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" to="/libros">
                      Explore
                    </Link>
                    <Link className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" to="#">
                      My Account
                    </Link>
                    <Link className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" to="/login">
                      Login
                    </Link>
                  </div>
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    alt="User profile picture"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIVtWdSuWph94wAp84rfYhq7fcr7pPvq-X4V7PTWjH1vhGd3CgNDF3o0BGePWpBdj1sYOSMt2QDy98vVIQOis-k-HiuvDqKLWgYCFy1gXJQp0ukh8rROSq59DcW3MUKb9sQ9urjwvc8QzOb4Ppnyq2PY-lIVgHVEFAQzykyyOkZqsuH8rJYh6C0ODoGArzCr7Ph1XpU7rWntXBVVmw8KWo3csoOZd1cwbFjogAJ9l9p1EwRse0jOK85VXm_S0b3SkG37tcnYs3ci5c")' }}
                  ></div>
                </div>
                <button className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-gray-900 dark:text-white">menu</span>
                </button>
              </header>

              {/* --- AQUI SE RENDERIZA LA PÁGINA ACTUAL --- */}
              <Outlet />

              {/* --- Footer (FOOTER GLOBAL) --- */}
              <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                    <span className="material-symbols-outlined text-3xl text-primary">local_library</span>
                    <span className="text-sm">© 2024 Library Web App. All rights reserved.</span>
                  </div>
                  <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <Link className="hover:text-primary dark:hover:text-primary" to="#">About Us</Link>
                    <Link className="hover:text-primary dark:hover:text-primary" to="#">Contact</Link>
                    <Link className="hover:text-primary dark:hover:text-primary" to="#">Hours & Location</Link>
                  </div>
                </div>
              </footer>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}