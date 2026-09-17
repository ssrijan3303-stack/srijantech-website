import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CustomerAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/validate-customer' : '/api/auth/register-customer';
    const payload = isLogin ? { email } : { full_name: fullName, email, phone };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success || data.authorized) {
        localStorage.setItem('token', data.token || 'customer_secure_session');
        navigate('/customer-dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please check your details.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-800 my-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        {isLogin ? 'Customer Login' : 'Customer Signup'}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded shadow hover:opacity-90 transition"
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="text-sm text-cyan-400 hover:underline focus:outline-none"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};