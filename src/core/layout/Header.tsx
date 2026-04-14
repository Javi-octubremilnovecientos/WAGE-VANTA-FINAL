"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, PopoverGroup, Switch } from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/features/auth/authSlice";
import AuthModal from "@/components/ui/modals/AuthModal";



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };


  return (
    <header className="relative z-50">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-6 "
      >
        <div className="flex lg:flex-1">
          <button
            type="button"
            onClick={handleAuthClick}
            className="flex items-center -m-0.5 p-0.5 gap-x-1.5 text-white hover:opacity-80 transition-opacity focus:outline-none text-sm"
          >
            <UserIcon className="size-6" aria-hidden="true" />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span>{user?.name || 'Usuario'}</span>
                <span className="h-2 w-2 bg-green-500 rounded-full inline-block"></span>
              </div>
            ) : (
              'Log in'
            )}
          </button>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-8 w-1/3 justify-around">
          <Link to="/about" className="text-xs lg:text-sm font-semibold text-white">
            About
          </Link>
          <Link to="/plans" className="text-xs lg:text-sm font-semibold text-white">
            Plans
          </Link>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className="group relative inline-flex items-center h-5 w-9 shrink-0 cursor-pointer rounded-full bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-[#45D2FD]"
          >
            <span className="sr-only">Toggle theme</span>
            <span
              aria-hidden="true"
              className="pointer-events-none  size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4 flex items-center justify-center"
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
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-2/3 overflow-y-auto bg-gray-900 p-4 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-end mb-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2 rounded-md p-2 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="mt-4 flow-root">
            <div className="-my-6 divide-y divide-white/10 ">
              <div className="space-y-1.5 py-4">
                <Link
                  to="/about"
                  className="-mx-3 block rounded-lg px-3 py-1.5 text-xs lg:text-sm font-semibold text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/plans"
                  className="-mx-3 block rounded-lg px-3 py-1.5 text-xs lg:text-sm font-semibold text-white hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plans
                </Link>
              </div>
              <div className="space-y-1.5 py-4 ">
                <div className="flex items-center justify-between ">
                  <span className="text-xs font-semibold text-white">Theme</span>
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative items-center inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-[#45D2FD]"
                  >
                    <span className="sr-only">Toggle theme</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none  size-4  transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4 flex items-center justify-center"
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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={(newMode) => setAuthMode(newMode)}
      />

    </header>
  );
}
