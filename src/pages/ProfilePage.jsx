import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function ProfilePage({ currentUser, onSelectVideo }) {
  const [myVideos, setMyVideos] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  // Formulario de subida
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cargar videos propios
  const fetchMyVideos = () => {
    if (!currentUser?.email) return;
    fetch(`${API_URL}/users/${encodeURIComponent(currentUser.email)}/videos`)
      .then((res) => res.json())
      .then((data) => setMyVideos(Array.isArray(data) ? data : []))
      .catch(() => setMyVideos([]));
  };

  useEffect(() => {
    fetchMyVideos();
  }, [currentUser]);

  // Publicar video
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbFile) {
      alert('Debes seleccionar un video y una miniatura.');
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('author_name', currentUser.name || currentUser.email);
    formData.append('user_email', currentUser.email);
    formData.append('video_file', videoFile);
    formData.append('thumbnail_file', thumbFile);

    try {
      const res = await fetch(`${API_URL}/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: formData,
      });
      if (res.ok) {
        setIsUploadOpen(false);
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setThumbFile(null);
        fetchMyVideos();
      } else {
        alert('Error al subir el video. Verifica tus permisos o el tamaño del archivo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al subir.');
    } finally {
      setUploading(false);
    }
  };

  // Actualizar video
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          title: editingVideo.title,
          description: editingVideo.description,
        }),
      });
      if (res.ok) {
        setEditingVideo(null);
        fetchMyVideos();
      } else {
        alert('No tienes permisos para editar este video.');
      }
    } catch (err) {
      alert('Error al actualizar el video.');
    }
  };

  // Eliminar video
  const handleDelete = async (videoId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este video?')) return;
    try {
      const res = await fetch(`${API_URL}/videos/${videoId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      if (res.ok) {
        setMyVideos((prev) => prev.filter((v) => v.id !== videoId));
      } else {
        alert('No tienes permisos para eliminar este video.');
      }
    } catch (err) {
      alert('Error al eliminar el video.');
    }
  };

  return (
    <div className="page-container">
      {/* Header del Perfil */}
      <div className="profile-header-card">
        <div className="profile-user-info">
          <div className="profile-avatar-lg">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentUser?.name || 'Creador'}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{currentUser?.email}</p>
            <div style={{ marginTop: '8px', display: 'inline-block', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
              {myVideos.length} {myVideos.length === 1 ? 'video publicado' : 'videos publicados'}
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
          + Publicar Nuevo Video
        </button>
      </div>

      {/* Lista / Gestión de Videos Subidos */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Mis Videos Subidos</h2>

      {myVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94a3b8' }}>No has subido ningún video todavía.</p>
        </div>
      ) : (
        <table className="profile-table">
          <thead>
            <tr>
              <th>Miniatura</th>
              <th>Título</th>
              <th>Vistas</th>
              <th>Fecha</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {myVideos.map((vid) => (
              <tr key={vid.id}>
                <td style={{ width: '100px' }}>
                  <img
                    src={vid.thumbnail_url || 'https://via.placeholder.com/80x45'}
                    alt={vid.title}
                    style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => onSelectVideo(vid)}
                  />
                </td>
                <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{vid.title}</td>
                <td style={{ color: '#94a3b8' }}>{vid.views ?? 0}</td>
                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(vid.created_at || Date.now()).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn-secondary" style={{ marginRight: '8px', padding: '6px 12px' }} onClick={() => setEditingVideo(vid)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(vid.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal: Publicar Video */}
      {isUploadOpen && (
        <div className="modal-backdrop" onClick={() => setIsUploadOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '18px' }}>Publicar Video</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Archivo de Video (.mp4)</label>
                <input className="form-input" type="file" accept="video/*" required onChange={(e) => setVideoFile(e.target.files[0])} />
              </div>
              <div className="form-group">
                <label className="form-label">Miniatura (.jpg, .png)</label>
                <input className="form-input" type="file" accept="image/*" required onChange={(e) => setThumbFile(e.target.files[0])} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsUploadOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'Subiendo a S3...' : 'Subir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Video */}
      {editingVideo && (
        <div className="modal-backdrop" onClick={() => setEditingVideo(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '18px' }}>Editar Información del Video</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  className="form-input"
                  required
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingVideo(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}