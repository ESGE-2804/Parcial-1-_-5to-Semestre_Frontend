import React, { useState } from 'react';
import { API_URL } from '../api';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        // 1. REGISTRO
        const regRes = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            nombre: name,
            email,
            password,
            contraseña: password
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.detail || 'Error al registrar la cuenta.');
        }

        // Si el registro ya devuelve token, lo usamos; si no, hacemos login automático de inmediato
        if (regData.access_token || regData.token) {
          saveSession(regData, email, name);
          return;
        }
      }

      // 2. INICIO DE SESIÓN (LOGIN)
      const loginRes = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginData.detail || 'Credenciales incorrectas.');
      }

      saveSession(loginData, email, name || loginData.name || loginData.user?.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSession = (data, userEmail, userName) => {
    const token = data.access_token || data.token || (data.user && (data.user.token || data.user.access_token));
    const userId = data.user_id || data.id || (data.user && (data.user.id || data.user.user_id));

    if (!token) {
      setError('El servidor no retornó un token de autenticación válido.');
      return;
    }

    const sessionData = {
      id: userId,
      user_id: userId,
      name: userName || (data.user && data.user.name) || userEmail.split('@')[0],
      email: userEmail,
      token: token
    };

    onLoginSuccess(sessionData);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Registrarse
          </button>
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>
          {isLogin ? 'Bienvenido a CloudTube' : 'Crea tu cuenta de creador'}
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '22px' }}>
          {isLogin ? 'Ingresa tus credenciales para acceder.' : 'Ingresa tus datos para empezar a publicar.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '12px', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLogin ? 'Acceder' : 'Registrar Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}