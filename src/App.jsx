import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  // Estado para controlar qué página se muestra: 'home' | 'player' | 'profile' | 'auth'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Estado para mantener la sesión del usuario
  const [currentUser, setCurrentUser] = useState(null);

  // Cargar sesión guardada al refrescar la página
  useEffect(() => {
    const saved = localStorage.getItem('cloudtube_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('cloudtube_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('cloudtube_user', JSON.stringify(user));
    setCurrentPage('home'); // Redirige a inicio tras loguearse
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cloudtube_user');
    setCurrentPage('home'); // Redirige a inicio tras salir
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setCurrentPage('player'); // Abre la vista del reproductor
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* La barra de navegación siempre es visible */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setSelectedVideo(null); // Limpia el video seleccionado si cambia de pestaña
          setCurrentPage(page);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Contenedor dinámico de las 4 páginas */}
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage onSelectVideo={handleSelectVideo} />
        )}

        {currentPage === 'player' && selectedVideo && (
          <PlayerPage
            video={selectedVideo}
            currentUser={currentUser}
            onSelectVideo={handleSelectVideo}
            onBack={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'profile' && currentUser && (
          <ProfilePage
            currentUser={currentUser}
            onSelectVideo={handleSelectVideo}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}