import React from 'react';

export default function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }) {
  return (
    <header className="navbar">
      {/* Brand */}
      <div className="brand" onClick={() => setCurrentPage('home')}>
        <div className="brand-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span>Cloud<span style={{ color: '#818cf8' }}>Tube</span></span>
      </div>

      {/* Navegación según rúbrica */}
      <div className="nav-actions">
        <button
          className={`btn-secondary ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          Inicio
        </button>

        {currentUser ? (
          <>
            <button
              className={`btn-secondary ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentPage('profile')}
            >
              Mi Perfil
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <div className="user-avatar-sm" style={{ width: 34, height: 34, fontSize: '0.85rem' }}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <button className="btn-danger" onClick={onLogout}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <button className="btn-primary" onClick={() => setCurrentPage('auth')}>
            Iniciar Sesión / Registro
          </button>
        )}
      </div>
    </header>
  );
}