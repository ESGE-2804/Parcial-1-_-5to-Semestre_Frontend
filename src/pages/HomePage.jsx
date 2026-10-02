import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function HomePage({ onSelectVideo }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar videos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="page-container" style={{ textAlign: 'center', padding: '60px' }}>Cargando catálogo dinámico...</div>;
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
        Videos Disponibles
      </h1>

      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94a3b8' }}>Aún no hay videos disponibles en la plataforma.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <article key={video.id} className="video-card" onClick={() => onSelectVideo(video)}>
              <div className="card-thumb-wrap">
                <img
                  src={video.thumbnail_url || 'https://via.placeholder.com/640x360?text=CloudTube'}
                  alt={video.title}
                  loading="lazy"
                />
              </div>
              <div className="card-content">
                <div className="user-avatar-sm">
                  {video.author_name ? video.author_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="card-details">
                  <h3 className="card-title">{video.title}</h3>
                  <p className="card-author">{video.author_name || video.user_email || 'Creador'}</p>
                  <div className="card-meta">
                    <span>{video.views ?? 0} vistas</span>
                    <span>•</span>
                    <span>{new Date(video.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}