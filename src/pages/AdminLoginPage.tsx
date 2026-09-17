import React, { useState } from 'react';

export const AdminLoginPage: React.FC = () => {
  const [view, setView] = useState<'login' | 'forgot_email' | 'forgot_otp' | 'forgot_new_password'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const authorizedAdmins: { [key: string]: { phone: string; pass: string } } = {
    'mystoreorder0004@gmail.com': { phone: '9876543210', pass: 'admin123' },
    'srijan@srijantech.in': { phone: '9876543211', pass: 'admin123' },
    'ssrijan3303@gmail.com': { phone: '7269068483', pass: 'admin123' }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const admin = authorizedAdmins[email.trim().toLowerCase()];
    if (!admin || admin.pass !== password) {
      setError('Access denied. Invalid admin credentials.');
      return;
    }

    localStorage.setItem('adminToken', 'srijan_secure_super_admin_token');
    window.location.href = '/admin-dashboard';
  };

  const handleVerifyEmailPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const admin = authorizedAdmins[email.trim().toLowerCase()];
    if (!admin || admin.phone !== phone.trim()) {
      setError('Email or Phone number does not match our authorized records.');
      return;
    }

    setSuccessMsg('OTP has been successfully sent to your registered mobile number!');
    setTimeout(() => {
      setSuccessMsg('');
      setView('forgot_otp');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otp !== '123456') {
      setError('Invalid OTP. Please enter the correct 6-digit code.');
      return;
    }

    setSuccessMsg('OTP verified successfully! Please set your new password.');
    setTimeout(() => {
      setSuccessMsg('');
      setView('forgot_new_password');
    }, 1200);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (authorizedAdmins[email.trim().toLowerCase()]) {
      authorizedAdmins[email.trim().toLowerCase()].pass = newPassword;
    }

    setSuccessMsg('Password updated successfully! Redirecting to login...');
    setTimeout(() => {
      setView('login');
      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-slate-900 rounded-xl shadow-xl border border-slate-800 my-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        {view === 'login' && 'Admin Panel Authentication'}
        {view === 'forgot_email' && 'Admin Recovery: Step 1'}
        {view === 'forgot_otp' && 'Admin Recovery: Step 2 (OTP)'}
        {view === 'forgot_new_password' && 'Admin Recovery: Step 3 (New Password)'}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">{error}</div>}
      {successMsg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded text-sm">{successMsg}</div>}

      {view === 'login' && (
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

          <div className="text-right">
            <button
              type="button"
              onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-cyan-400 hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded shadow hover:opacity-90 transition"
          >
            Enter Admin Panel
          </button>
        </form>
      )}

      {view === 'forgot_email' && (
        <form onSubmit={handleVerifyEmailPhone} className="space-y-4">
          <p className="text-sm text-slate-400 mb-2">Enter your authorized email and registered phone number to receive a verification OTP.</p>
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
            <label className="block text-sm text-slate-300 mb-1">Registered Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number (e.g. 7269068483)"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded shadow hover:opacity-90 transition"
          >
            Generate OTP
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}

      {view === 'forgot_otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-slate-400 mb-2">Enter the 6-digit OTP sent to your phone. <span className="text-cyan-400 font-semibold">(Hint: use 123456)</span></p>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 123456"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white text-center tracking-widest text-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded shadow hover:opacity-90 transition"
          >
            Verify OTP
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Resend OTP / Change Details
            </button>
          </div>
        </form>
      )}

      {view === 'forgot_new_password' && (
        <form onSubmit={handleSaveNewPassword} className="space-y-4">
          <p className="text-sm text-slate-400 mb-2">Create a secure new password for your admin account.</p>
          <div>
            <label className="block text-sm text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded shadow hover:opacity-90 transition"
          >
            Reset Password & Login
          </button>
        </form>
      )}
    </div>
  );
};