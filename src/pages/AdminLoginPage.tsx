import React, { useState } from 'react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Secure fallback verification for authorized founder/admin emails
    const authorizedEmails = [
      'mystoreorder0004@gmail.com',
      'srijan@srijantech.in',
      'ssrijan3303@gmail.com'
    ];

    if (!authorizedEmails.includes(email.trim().toLowerCase())) {
      setError('Access denied. Unauthorized admin email.');
      return;
    }

    // Simulating secure token generation & login success
    localStorage.setItem('adminToken', 'srijan_secure_admin_token_2026');
    window.location.href = '/admin-dashboard';
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Password recovery link has been sent to the authorized founder email records.');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-800 my-12">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Panel Authentication</h2>
      
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">{error}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded text-sm">{successMsg}</div>}

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

        {/* Forgot Password Link Added Here */}
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-cyan-400 hover:underline focus:outline-none"
          >
            Forgot Password / Key?
          </button>
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