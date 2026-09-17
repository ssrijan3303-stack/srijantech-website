import React, { useState } from 'react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/validate-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'super_admin' }),
      });

      const data = await response.json();
      if (data.authorized && data.token) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin-dashboard';
      } else {
        setError(data.error || 'Access denied. Invalid credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-800 my-12">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Panel Authentication</h2>
      
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Admin Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Password / Secret Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded shadow hover:opacity-90 transition"
        >
          Enter Admin Panel
        </button>
      </form>
    </div>
  );
};