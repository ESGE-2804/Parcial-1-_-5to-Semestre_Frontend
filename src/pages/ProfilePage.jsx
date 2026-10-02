import React, { useEffect, useState } from 'react';
import { API_URL } from '../api';

export default function ProfilePage({ currentUser, onSelectVideo }) {
  const [myVideos, setMyVideos] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMyVideos = () => {
    if (!currentUser) return;

    fetch(`${API_URL}/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Filtro estricto: solo videos cuyo ID de usuario o email correspondan a esta cuenta
          const strictlyMyVideos = data.filter((v) => {
            const matchesId = currentUser.id && (v.user_id === currentUser.id || v.usuario_id === currentUser.id);
            const matchesEmail = currentUser.email && (v.user_email === currentUser.email || v.email === currentUser.email);
            const matchesAuthor = currentUser.name && (v.author_name === currentUser.name || v.autor === currentUser.name);
            return matchesId || matchesEmail || matchesAuthor;
          });
          setMyVideos(strictlyMyVideos);
        } else {
          setMyVideos([]);
        }
      })
      .catch(() => setMyVideos([]));
  };

  useEffect(() => {
    fetchMyVideos();
  }, [currentUser]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbFile) {
      alert('Debes seleccionar un video y una miniatura.');
      return;
    }

    if (!currentUser?.token) {
      alert('Sesión inválida: No hay token disponible. Cierra sesión e ingresa nuevamente.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('titulo', title);
    formData.append('description', description);
    formData.append('descripcion', description);

    // Asociación de autoría
    formData.append('author_name', currentUser.name || currentUser.email);
    formData.append('user_email', currentUser.email);
    if (currentUser.id) {
      formData.append('user_id', currentUser.id);
      formData.append('usuario_id', currentUser.id);
    }

    formData.append('video_file', videoFile);
    formData.append('file', videoFile);
    formData.append('thumbnail_file', thumbFile);
    formData.append('thumbnail', thumbFile);

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
        const errData = await res.json();
        alert(`Error al subir video: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      alert('Error de red al intentar subir el video.');
    } finally {
      setUploading(false);
    }
  };

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
          titulo: editingVideo.title,
          description: editingVideo.description,
          descripcion: editingVideo.description,
        }),
      });

      if (res.ok) {
        setEditingVideo(null);
        fetchMyVideos();
      } else {
        alert('No tienes autorización para editar este video.');
      }
    } catch (err) {
      alert('Error al actualizar el video.');
    }
  };

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
        alert('No tienes autorización para eliminar este video.');
      }
    } catch (err) {
      alert('Error al eliminar el video.');
    }
  };

  return (
    <div className="page-container">
      <div className="profile-header-card">
        <div className="profile-user-info">
          <div className="profile-avatar-lg">
            {(currentUser?.name || currentUser?.email || 'U').charAt(0).toUpperCase()}
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

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Mis Videos Subidos</h2>

      {myVideos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#94a3b8' }}>No tienes videos publicados con esta cuenta.</p>
        </div>
      ) : (
        <div className="profile-table-wrapper">
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
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{vid.title || vid.titulo}</td>
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
        </div>
      )}

      {/* Modal Subida */}
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

      {/* Modal Edición */}
      {editingVideo && (
        <div className="modal-backdrop" onClick={() => setEditingVideo(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '18px' }}>Editar Video</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  className="form-input"
                  required
                  value={editingVideo.title || editingVideo.titulo || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={editingVideo.description || editingVideo.descripcion || ''}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingVideo(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}