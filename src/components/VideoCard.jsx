import React from 'react';

export default function VideoCard({ video, onSelect }) {
  return (
    <article className="video-card" onClick={() => onSelect(video)}>
      <div className="thumbnail-container">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="thumbnail-img"
          loading="lazy"
        />
      </div>
      <div className="video-info">
        <div className="avatar">
          {video.creator_name ? video.creator_name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-meta">{video.creator_name || 'Creador CloudTube'}</p>
        </div>
      </div>
    </article>
  );
}