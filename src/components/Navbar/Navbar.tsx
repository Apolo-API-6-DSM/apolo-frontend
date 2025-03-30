'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { path: "/", label: "HOME" },
  { path: "/importacao", label: "IMPORTAÇÃO" },
  { path: "/chamados", label: "CHAMADOS" },
  { path: "/usuarios", label: "USUÁRIOS" },
];

const profileLink = { path: "/perfil", label: "PERFIL" };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Barra superior (mantido igual) */}
      <nav className="bg-[#00163B] border-gray-200 fixed w-full z-10">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 w-10 h-10 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="flex items-center space-x-3 order-last">
            <img src="/assets/logo.png" className="h-8" alt="Logo Apolo" />
          </Link>
        </div>
      </nav>

      {/* Overlay (mantido igual) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu lateral com modificações no hover */}
      <div className={`fixed top-0 left-0 w-64 h-full bg-[#00163B] shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform z-30 flex flex-col`}>
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 w-10 h-10 text-white hover:font-bold rounded-lg focus:outline-none transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links principais com hover apenas em bold */}
        <ul className="mt-6 space-y-4 text-right pr-6 flex-1">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={`block py-2 px-4 ${
                  pathname === link.path ? 'font-bold' : ''
                } text-white hover:font-bold transition-all`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Link do perfil com o mesmo estilo */}
        <div className="p-4 border-t border-gray-600">
          <Link
            href={profileLink.path}
            className={`block py-2 px-4 ${
              pathname === profileLink.path ? 'font-bold' : ''
            } text-white hover:font-bold text-right transition-all`}
            onClick={() => setIsOpen(false)}
          >
            {profileLink.label}
          </Link>
        </div>
      </div>
    </>
  );
}