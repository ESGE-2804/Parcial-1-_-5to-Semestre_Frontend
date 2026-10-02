import React from 'react';

export default function Navbar({ user, onOpenUpload, onLogout, searchTerm, setSearchTerm }) {
  return (
    <header className="navbar">
      {/* Logo */}
      <div className="brand" onClick={() => window.location.reload()}>
        <div className="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span>Cloud<span style={{ color: '#818cf8' }}>Tube</span></span>
      </div>

      {/* Buscador */}
      <div className="search-box">
        <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar videos..."
        />
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn-upload" onClick={onOpenUpload}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Subir</span>
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="avatar">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            {onLogout && (
              <button 
                onClick={onLogout} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                title="Cerrar sesión"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}