import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://127.0.0.1:8000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-[#181818] border border-[#272727] p-8 rounded-2xl w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Iniciar Sesión</h2>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold text-white transition mt-2">Acceder</button>
        <p className="text-center text-xs text-gray-400 mt-2">¿No tienes cuenta? <Link to="/register" className="text-blue-400 underline">Regístrate</Link></p>
      </form>
    </div>
  );
}