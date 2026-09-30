import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-[#272727] sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CloudTube</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="flex items-center border border-[#303030] rounded-full overflow-hidden bg-[#121212]">
          <input 
            type="text" 
            placeholder="Buscar videos..." 
            className="w-full px-4 py-2 bg-transparent text-white outline-none"
          />
          <button className="px-5 py-2.5 bg-[#222222] border-l border-[#303030] hover:bg-[#272727]">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-1.5 rounded-full text-sm font-semibold transition">
              <span>+ Crear</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{user.name || 'Mi Perfil'}</span>
              <button onClick={logout} className="text-sm text-red-400 hover:underline">Salir</button>
            </div>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 border border-blue-500 text-blue-400 hover:bg-blue-500/10 px-4 py-1.5 rounded-full text-sm font-semibold transition">
            Acceder
          </Link>
        )}
      </div>
    </header>
  );
}