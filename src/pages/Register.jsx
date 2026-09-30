import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = "http://127.0.0.1:8000";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, form);
      alert('Registro completado con éxito. Ahora inicia sesión.');
      navigate('/login');
    } catch {
      alert('Error registrando usuario');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-[#181818] border border-[#272727] p-8 rounded-2xl w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Crear Cuenta</h2>
        <input type="text" placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
        <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required className="bg-[#121212] border border-[#303030] p-3 rounded-xl text-white outline-none focus:border-blue-500" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold text-white transition mt-2">Crear Cuenta</button>
        <p className="text-center text-xs text-gray-400 mt-2">¿Ya tienes cuenta? <Link to="/login" className="text-blue-400 underline">Inicia Sesión</Link></p>
      </form>
    </div>
  );
}