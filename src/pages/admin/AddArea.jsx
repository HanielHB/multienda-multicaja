import React from 'react';
import { Link } from 'react-router-dom';

export default function AddArea() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* --- Breadcrumbs --- */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" to="#">
          Dashboard
        </Link>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
        <Link className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary" to="#">
          Library Areas
        </Link>
        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">/</span>
        <span className="text-gray-800 dark:text-white text-sm font-medium leading-normal">Add New</span>
      </div>
      
      {/* --- Page Heading --- */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Add New Library Area
        </h1>
      </div>

      {/* --- Form Container --- */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="max-w-md">
          {/* TextField */}
          <div className="mb-4">
            <label className="flex flex-col">
              <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal pb-2">Area Name</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-background-light dark:bg-background-dark h-14 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-[15px] text-base font-normal leading-normal"
                placeholder="e.g., Children's Section"
                defaultValue=""
              />
            </label>
          </div>
          {/* BodyText */}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mb-6">
            This will be visible to patrons in the library catalog.
          </p>
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="flex h-12 flex-1 items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50">
              Save Area
            </button>
            <button className="flex h-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 text-base font-medium text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400/50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}