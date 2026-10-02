import React, { useState } from 'react';

export default function VideoPlayerView({ video, comments, onAddComment, onBack }) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Botón Volver */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 group transition-colors"
      >
        <span className="p-1.5 rounded-xl bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </span>
        Volver al catálogo
      </button>

      {/* Reproductor de Video */}
      <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/[0.08] mb-6">
        <video
          src={video.video_url}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>

      {/* Metadatos del Video */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 mb-8 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{video.title}</h1>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">{video.description}</p>
      </div>

      {/* ----------------- ZONA DE COMENTARIOS ----------------- */}
      <section className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Comentarios
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
              {comments.length}
            </span>
          </h2>
        </div>

        {/* Formulario de entrada */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="¿Qué opinas sobre este contenido? Comparte tu comentario..."
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                Publicar comentario
              </button>
            </div>
          </div>
        </form>

        {/* Lista de comentarios */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">
              Sé el primero en dejar un comentario sobre este video.
            </p>
          ) : (
            comments.map((c, idx) => (
              <div
                key={c.id || idx}
                className="flex gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-9 w-9 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center font-bold text-xs select-none">
                  {c.user_email ? c.user_email.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {c.user_email || 'Usuario'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(c.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed break-words">
                    {c.content || c.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}