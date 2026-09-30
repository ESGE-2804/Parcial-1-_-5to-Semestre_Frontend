import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { label: 'Inicio', path: '/' },
    { label: 'Tú / Perfil', path: '/profile' }
  ];

  return (
    <aside className="w-56 bg-[#0f0f0f] border-r border-[#272727] p-3 flex flex-col gap-1 hidden md:block">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            location.pathname === link.path ? 'bg-[#272727] text-white' : 'text-gray-400 hover:bg-[#222222] hover:text-white'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}