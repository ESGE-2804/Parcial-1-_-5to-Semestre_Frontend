import React from 'react';

export default function VideoCard({ video, onSelect }) {
  return (
    <article
      onClick={() => onSelect(video)}
      className="group cursor-pointer flex flex-col bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/[0.12] rounded-3xl p-3.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-3.5">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-xs font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
            Ver ahora
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-3 px-1">
        <div className="h-9 w-9 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center font-bold text-xs">
          {video.creator_name ? video.creator_name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-100 font-semibold text-sm line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
            {video.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1 truncate">
            {video.creator_name || 'Creador de CloudTube'}
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
            <span>{video.views ?? 0} vistas</span>
            <span>•</span>
            <span>{new Date(video.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}