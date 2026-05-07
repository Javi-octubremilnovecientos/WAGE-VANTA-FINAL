"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/hooks/useRedux";
import { selectUser } from "@/features/auth/authSlice";
import AuthModal from "@/components/ui/modals/AuthModal";
import UserAvatar from "@/components/ui/UserAvatar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recovery'>('login');

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
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-6"
      >
        <div className="flex lg:flex-1">
          <button
            type="button"
            onClick={handleAuthClick}
            className="flex items-center -m-0.5 p-0.5 gap-x-2 text-white hover:opacity-80 transition-opacity focus:outline-none text-sm"
          >
            {isAuthenticated ? (
              <>
                <UserAvatar
                  key={user?.avatarUrl}
                  avatarUrl={user?.avatarUrl}
                  userName={user?.name}
                  size="sm"
                  className="ring-2 ring-[#96969F]/40 hover:ring-[#D84124] transition-all"
                />
                <div className="flex items-center gap-2">
                  <span>{user?.name || 'Usuario'}</span>
                  <span className="h-2 w-2 bg-green-500 rounded-full inline-block mt-1"></span>
                </div>
              </>
            ) : (
              <>
                <UserIcon className="size-6" aria-hidden="true" />
                <span>Log in</span>
              </>
            )}
          </button>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-[#96969F] hover:text-white transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-8 w-1/3 justify-around">
          <Link
            to="/about"
            className="text-xs lg:text-sm font-semibold text-[#96969F] hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            to="/plans"
            className="text-xs lg:text-sm font-semibold text-[#96969F] hover:text-white transition-colors"
          >
            Plans
          </Link>
        </PopoverGroup>

        {/* Spacer to balance the layout */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end" />
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-2/3 overflow-y-auto bg-[#121213] p-4 sm:max-w-sm sm:ring-1 sm:ring-white/5">
          <div className="flex items-center justify-end mb-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2 rounded-md p-2 text-[#96969F] hover:text-white transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="mt-4 flow-root">
            <div className="-my-6 divide-y divide-white/5">
              <div className="space-y-1.5 py-4">
                <Link
                  to="/about"
                  className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold text-[#96969F] hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/plans"
                  className="-mx-3 block rounded-lg px-3 py-3 text-base font-semibold text-[#96969F] hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plans
                </Link>
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
