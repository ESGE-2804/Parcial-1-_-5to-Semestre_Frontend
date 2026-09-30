import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export default function Profile() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchVideos = () => {
    axios.get(`${API_URL}/videos`).then(res => {
      setVideos(res.data.filter(v => v.user_id === user.id));
    }).catch(console.error);
  };

  useEffect(() => {
    if (user.id) fetchVideos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Debes iniciar sesión para subir un video');

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('description', e.target.description.value);
    formData.append('video_file', e.target.video.files[0]);
    formData.append('thumbnail_file', e.target.thumbnail.files[0]);

    setLoading(true);
    try {
      await axios.post(`${API_URL}/videos`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      alert('¡Video publicado exitosamente!');
      e.target.reset();
      fetchVideos();
    } catch {
      alert('Error al subir el video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Deseas eliminar este video?')) return;
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/videos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchVideos();
  };

  const handleUpdate = async (id) => {
    const title = prompt('Nuevo título para el video:');
    if (!title) return;
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/videos/${id}`, { title }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchVideos();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-8">
      <div className="bg-[#181818] p-6 rounded-2xl border border-[#272727]">
        <h2 className="text-xl font-bold mb-4 text-white">Publicar Nuevo Video</h2>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input type="text" name="title" placeholder="Título del video" required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
          <textarea name="description" placeholder="Descripción del video" className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500"></textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed border-[#303030] p-4 rounded-xl">
              <label className="block text-xs font-semibold text-gray-400 mb-2">Archivo de Video (MP4)</label>
              <input type="file" name="video" accept="video/mp4" required className="text-sm text-gray-400" />
            </div>
            <div className="border border-dashed border-[#303030] p-4 rounded-xl">
              <label className="block text-xs font-semibold text-gray-400 mb-2">Miniatura (JPG / PNG)</label>
              <input type="file" name="thumbnail" accept="image/jpeg,image/png" required className="text-sm text-gray-400" />
            </div>
          </div>

          <button disabled={loading} className="bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold text-white transition disabled:opacity-50">
            {loading ? 'Subiendo archivos...' : 'Publicar Video'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-white">Mis Videos ({videos.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map(v => (
            <div key={v.id} className="bg-[#181818] p-3 rounded-xl border border-[#272727] flex flex-col gap-2">
              <img src={v.thumbnail_url} alt={v.title} className="w-full aspect-video object-cover rounded-lg" />
              <h3 className="font-semibold text-sm line-clamp-1">{v.title}</h3>
              <p className="text-xs text-gray-400">{v.views} vistas</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleUpdate(v.id)} className="flex-1 bg-[#272727] hover:bg-[#333] text-xs py-1.5 rounded-lg font-medium">Editar</button>
                <button onClick={() => handleDelete(v.id)} className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs py-1.5 rounded-lg font-medium">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}