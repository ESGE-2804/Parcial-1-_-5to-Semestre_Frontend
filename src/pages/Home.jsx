import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error("API offline o sin videos aún:", err));
  }, []);

  return (
    <div className="p-6">
      {videos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No hay videos disponibles todavía.</p>
          <p className="text-sm mt-1">Inicia sesión y sube tu primer video desde la pestaña "Tú / Perfil".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map(video => (
            <Link to={`/video/${video.id}`} key={video.id} className="flex flex-col gap-2 group cursor-pointer">
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#222]">
                <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
              </div>
              <div className="flex gap-3 mt-1">
                <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
                  U
                </div>
                <div>
                  <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-blue-400">{video.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">Usuario #{video.user_id}</p>
                  <p className="text-xs text-gray-400">{video.views} vistas</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}