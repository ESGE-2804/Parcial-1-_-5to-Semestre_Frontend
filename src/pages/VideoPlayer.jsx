import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export default function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/videos/${id}`).then(res => setVideo(res.data)).catch(console.error);
    axios.get(`${API_URL}/videos/${id}/comments`).then(res => setComments(res.data)).catch(console.error);
    axios.get(`${API_URL}/videos`).then(res => {
      setRecommended(res.data.filter(v => v.id !== parseInt(id)));
    }).catch(console.error);
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Debes iniciar sesión para comentar');

    try {
      const res = await axios.post(`${API_URL}/videos/${id}/comments`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments([res.data, ...comments]);
      setContent('');
    } catch {
      alert('Error enviando el comentario');
    }
  };

  if (!video) return <div className="p-8 text-center text-gray-400">Cargando video...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-[#272727]">
          <video src={video.video_url} controls autoPlay className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl font-bold mt-4 text-white">{video.title}</h1>
        <div className="flex items-center justify-between py-2 border-b border-[#272727] text-sm text-gray-400">
          <span>Subido por Usuario #{video.user_id}</span>
          <span>{video.views} vistas</span>
        </div>
        <div className="bg-[#222222] p-4 rounded-xl mt-4 text-sm text-gray-200">
          {video.description || "Sin descripción disponible."}
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">{comments.length} Comentarios</h3>
          <form onSubmit={handleComment} className="flex gap-3 mb-6">
            <input 
              type="text" 
              placeholder="Añade un comentario..." 
              value={content} 
              onChange={e => setContent(e.target.value)}
              className="flex-1 bg-transparent border-b border-[#3f3f3f] pb-1 text-white outline-none focus:border-white"
              required 
            />
            <button type="submit" className="bg-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-700">Comentar</button>
          </form>

          <div className="flex flex-col gap-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center font-bold text-xs shrink-0">U</div>
                <div>
                  <span className="font-semibold text-gray-300">Usuario #{c.user_id}</span>
                  <p className="text-gray-200 mt-0.5">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-3">
        <h4 className="font-bold text-sm text-gray-400 mb-1">Videos Recomendados</h4>
        {recommended.map(rec => (
          <Link to={`/video/${rec.id}`} key={rec.id} className="flex gap-2 group">
            <div className="w-36 aspect-video bg-[#222] rounded-lg overflow-hidden shrink-0">
              <img src={rec.thumbnail_url} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>
            <div className="flex flex-col py-0.5">
              <span className="font-semibold text-xs line-clamp-2 text-white group-hover:text-blue-400">{rec.title}</span>
              <span className="text-[11px] text-gray-400 mt-1">Usuario #{rec.user_id}</span>
              <span className="text-[11px] text-gray-400">{rec.views} vistas</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}