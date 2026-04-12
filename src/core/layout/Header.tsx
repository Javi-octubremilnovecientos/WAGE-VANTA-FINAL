"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogPanel, PopoverGroup, Switch } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  return (
    <header className="relative z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="flex items-center -m-1.5 p-1.5 gap-x-3 text-white"
          >
            <img
              alt=""
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              className="inline-block size-11 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
            />
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Link to="/about" className="text-base lg:text-lg font-semibold text-white">
            About
          </Link>
          <Link to="/plans" className="text-base lg:text-lg font-semibold text-white">
            Plans
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-[#45D2FD]"
          >
            <span className="sr-only">Toggle theme</span>
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5 flex items-center justify-center"
            >
              {enabled ? (
                <SunIcon className="h-3 w-3 text-indigo-600" />
              ) : (
                <MoonIcon className="h-3 w-3 text-gray-700" />
              )}
            </span>
          </Switch>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-2/3 overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-end mb-6">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base lg:text-lg font-semibold text-white hover:bg-white/5"
                >
                  About
                </Link>
                <Link
                  to="/plans"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base lg:text-lg font-semibold text-white hover:bg-white/5"
                >
                  Plans
                </Link>
              </div>
              <div className="space-y-2 py-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Theme</span>
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-[#45D2FD]"
                  >
                    <span className="sr-only">Toggle theme</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5 flex items-center justify-center"
                    >
                      {enabled ? (
                        <SunIcon className="h-3 w-3 text-[#45D2FD]" />
                      ) : (
                        <MoonIcon className="h-3 w-3 text-gray-700" />
                      )}
                    </span>
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
