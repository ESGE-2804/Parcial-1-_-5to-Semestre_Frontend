import React, { useState } from 'react';

export default function VideoPlayerView({ video, comments = [], onAddComment, onBack }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(text);
    setText('');
  };

  return (
    <div className="player-container">
      <button className="back-btn" onClick={onBack}>
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la galería
      </button>

      <div className="video-box">
        <video src={video.video_url} controls autoPlay />
      </div>

      <div className="video-desc-box">
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{video.title}</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
          {video.description || 'Sin descripción disponible.'}
        </p>
      </div>

      <div className="comments-section">
        <div className="comments-header">
          <span>Comentarios</span>
          <span style={{ fontSize: '0.8rem', background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '12px' }}>
            {comments.length}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <textarea
            className="comment-input-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Agrega un comentario público..."
          />
          <button type="submit" className="comment-submit-btn" disabled={!text.trim()}>
            Comentar
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              No hay comentarios aún. ¡Escribe el primero!
            </p>
          ) : (
            comments.map((c, i) => (
              <div key={c.id || i} className="comment-item">
                <div className="avatar">
                  {c.user_email ? c.user_email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="comment-body">
                  <div className="comment-author">{c.user_email || 'Usuario'}</div>
                  <div className="comment-text">{c.content || c.text}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}