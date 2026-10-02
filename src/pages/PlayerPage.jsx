import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function PlayerPage({ video, currentUser, onSelectVideo, onBack }) {
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [commentText, setCommentText] = useState('');

  // 1. Cargar comentarios y sumar vista
  useEffect(() => {
    if (!video?.id) return;

    // Registrar incremento de vista
    fetch(`${API_URL}/videos/${video.id}/view`, { method: 'POST' }).catch(() => {});

    // Cargar comentarios
    fetch(`${API_URL}/videos/${video.id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));

    // Cargar recomendados dinámicos
    fetch(`${API_URL}/videos/recommended?exclude=${video.id}`)
      .then((res) => res.json())
      .then((data) => setRecommended(Array.isArray(data) ? data : []))
      .catch(() => setRecommended([]));
  }, [video?.id]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const payload = {
      content: commentText,
      author_name: currentUser ? currentUser.name || currentUser.email : 'Anónimo',
      user_email: currentUser ? currentUser.email : 'anonimo@cloudtube.io'
    };

    try {
      const res = await fetch(`${API_URL}/videos/${video.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedComment = await res.json();
        setComments((prev) => [savedComment, ...prev]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error al agregar comentario:', err);
    }
  };

  return (
    <div className="page-container">
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '16px' }}>
        ← Volver al inicio
      </button>

      <div className="player-layout">
        {/* Columna Izquierda: Video, Info y Comentarios */}
        <div>
          <div className="video-player-frame">
            <video src={video.video_url} controls autoPlay />
          </div>

          <div className="video-meta-box">
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>{video.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-avatar-sm" style={{ width: 32, height: 32 }}>
                  {video.author_name ? video.author_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{video.author_name || video.user_email || 'Creador'}</span>
              </div>
              <div>
                <span>{video.views ?? 0} vistas</span> • <span>{new Date(video.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
            <p style={{ marginTop: '16px', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px' }}>
              {video.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Sección de Comentarios */}
          <div className="comments-container">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Comentarios ({comments.length})
            </h3>

            <form onSubmit={handleSendComment} style={{ marginBottom: '24px' }}>
              <textarea
                className="form-input"
                rows="3"
                placeholder={currentUser ? "Escribe un comentario público..." : "Inicia sesión para comentar"}
                value={commentText}
                disabled={!currentUser}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={!commentText.trim() || !currentUser}>
                  Comentar
                </button>
              </div>
            </form>

            <div>
              {comments.map((c, i) => (
                <div key={c.id || i} className="comment-row">
                  <div className="user-avatar-sm" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                    {c.author_name ? c.author_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{c.author_name || c.user_email}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{new Date(c.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>{c.content || c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Videos Recomendados dinámicos */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#cbd5e1' }}>
            Videos recomendados
          </h3>
          <div className="recommended-sidebar">
            {recommended.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No hay recomendaciones adicionales.</p>
            ) : (
              recommended.map((item) => (
                <div key={item.id} className="recommended-item" onClick={() => onSelectVideo(item)}>
                  <div className="rec-thumb">
                    <img src={item.thumbnail_url || 'https://via.placeholder.com/160x90'} alt={item.title} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3, marginBottom: '4px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.author_name || 'Creador'}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.views ?? 0} vistas</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}