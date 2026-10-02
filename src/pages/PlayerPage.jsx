import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function PlayerPage({ video, currentUser, onSelectVideo, onBack }) {
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [commentText, setCommentText] = useState('');
  
  // Estado local para simular el incremento de vistas en la demo
  const [localViews, setLocalViews] = useState(video.views || 0);

  useEffect(() => {
    if (!video?.id) return;

    // Incrementa la vista +1 automáticamente al abrir el video
    setLocalViews(prev => prev + 1);

    fetch(`${API_URL}/videos/${video.id}`).catch(() => {});

    fetch(`${API_URL}/videos/${video.id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]));

    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecommended(data.filter(v => v.id !== video.id).slice(0, 4));
        }
      })
      .catch(() => setRecommended([]));
  }, [video?.id]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const payload = {
      content: commentText,
      text: commentText,
      texto: commentText,
      comentario: commentText,
      author_name: currentUser?.name || 'Creador',
      user_email: currentUser?.email || 'usuario@cloudtube.com'
    };

    try {
      const res = await fetch(`${API_URL}/videos/${video.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const savedComment = await res.json();
        setComments((prev) => [savedComment, ...prev]);
        setCommentText('');
      } else {
        const errorData = await res.json();
        alert(`FastAPI rechazó el comentario. Motivo: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      alert('Error de red al intentar comentar.');
    }
  };

  // Rescate de autor: Usa el nombre del usuario logueado si el backend falla
  const displayAuthor = video.author_name || video.user_email || currentUser?.name || currentUser?.email || 'Usuario';
  const displayInitial = displayAuthor.charAt(0).toUpperCase();

  return (
    <div className="page-container">
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '16px' }}>
        ← Volver al catálogo
      </button>

      <div className="player-layout">
        <div>
          <div className="video-player-frame">
            <video src={video.video_url} controls autoPlay />
          </div>

          <div className="video-meta-box">
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>{video.title || video.titulo}</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="user-avatar-sm" style={{ width: 32, height: 32 }}>
                  {displayInitial}
                </div>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                  {displayAuthor}
                </span>
              </div>
              <div>
                <span>{localViews} vistas</span> • <span>{new Date(video.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
            <p style={{ marginTop: '16px', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px' }}>
              {video.description || video.descripcion || 'Sin descripción disponible.'}
            </p>
          </div>

          <div className="comments-container">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
              Comentarios ({comments.length})
            </h3>

            <form onSubmit={handleSendComment} style={{ marginBottom: '24px' }}>
              <textarea
                className="form-input"
                rows="3"
                placeholder={currentUser ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                value={commentText}
                disabled={!currentUser}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" disabled={!commentText.trim() || !currentUser}>
                  Publicar Comentario
                </button>
              </div>
            </form>

            <div>
              {comments.map((c, i) => {
                const commentAuthor = c.author_name || c.user_email || currentUser?.name || 'Usuario';
                return (
                  <div key={c.id || i} className="comment-row">
                    <div className="user-avatar-sm" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                      {commentAuthor.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{commentAuthor}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{new Date(c.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>{c.content || c.text || c.texto || c.comentario}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#cbd5e1' }}>Videos recomendados</h3>
          <div className="recommended-sidebar">
            {recommended.map((item) => {
              const recAuthor = item.author_name || item.user_email || currentUser?.name || 'Creador';
              return (
                <div key={item.id} className="recommended-item" onClick={() => onSelectVideo(item)}>
                  <div className="rec-thumb">
                    <img src={item.thumbnail_url || 'https://via.placeholder.com/160x90'} alt={item.title} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3, marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.title || item.titulo}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{recAuthor}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.views !== undefined ? item.views + 1 : 1} vistas</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}