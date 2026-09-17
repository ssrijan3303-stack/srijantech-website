import React, { useState, useEffect } from 'react';

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
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Load saved admin database from localStorage or use defaults
  const getStoredAdmins = () => {
    const saved = localStorage.getItem('srijan_admin_database');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      'mystoreorder0004@gmail.com': { phone: '9876543210', pass: 'admin123' },
      'srijan@srijantech.in': { phone: '9876543211', pass: 'admin123' },
      'ssrijan3303@gmail.com': { phone: '7269068483', pass: 'admin123' }
    };
  };

  const [authorizedAdmins, setAuthorizedAdmins] = useState(getStoredAdmins);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === 'forgot_otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [view, countdown]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const admin = authorizedAdmins[cleanEmail];

    if (!admin || admin.pass !== password) {
      setError('Access denied. Invalid admin email or password.');
      return;
    }

    localStorage.setItem('adminToken', 'srijan_secure_super_admin_token');
    window.location.hash = '#admin-dashboard';
    window.location.reload();
  };

  const handleVerifyEmailPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const admin = authorizedAdmins[cleanEmail];

    if (!admin) {
      setError('This email address is not registered as an administrator.');
      return;
    }

    if (admin.phone !== cleanPhone) {
      setError('The phone number does not match our records for this admin email.');
      return;
    }

    // Instant foolproof OTP generation for testing & live preview
    setSuccessMsg(`OTP sent successfully to mobile ending in ****${cleanPhone.slice(-4)} (Testing OTP: 123456)`);
    setCountdown(60);
    setCanResend(false);

    setTimeout(() => {
      setSuccessMsg('');
      setView('forgot_otp');
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otp.trim() !== '123456') {
      setError('Invalid OTP code. Please enter the correct 6-digit code (Hint: 123456).');
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

    const cleanEmail = email.trim().toLowerCase();
    const updatedAdmins = {
      ...authorizedAdmins,
      [cleanEmail]: { ...authorizedAdmins[cleanEmail], pass: newPassword }
    };

    setAuthorizedAdmins(updatedAdmins);
    localStorage.setItem('srijan_admin_database', JSON.stringify(updatedAdmins));

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {view === 'login' && 'Admin Panel Authentication'}
          {view === 'forgot_email' && 'Admin Recovery: Step 1'}
          {view === 'forgot_otp' && 'Admin Recovery: Step 2 (SMS OTP)'}
          {view === 'forgot_new_password' && 'Admin Recovery: Step 3 (Reset Password)'}
        </h2>
        
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">{error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded text-sm">{successMsg}</div>}

        {/* VIEW 1: LOGIN */}
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
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
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Enter Admin Panel
            </button>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD - STEP 1 */}
        {view === 'forgot_email' && (
          <form onSubmit={handleVerifyEmailPhone} className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">Enter your authorized admin email and registered mobile number to receive an SMS OTP.</p>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Registered Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter registered mobile number"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Send SMS OTP
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

        {/* VIEW 3: FORGOT PASSWORD - STEP 2 */}
        {view === 'forgot_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">
              Enter the 6-digit OTP sent to your registered mobile number. <br />
              <span className="text-cyan-400 font-semibold">(Testing OTP: 123456)</span>
            </p>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-center tracking-widest text-lg focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Resend OTP in {countdown}s</span>
              {canResend && (
                <button
                  type="button"
                  onClick={() => { setCountdown(60); setCanResend(false); alert('New OTP sent to your registered mobile!'); }}
                  className="text-cyan-400 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Verify OTP
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => { setView('forgot_email'); setError(''); setSuccessMsg(''); }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Change Email/Phone
              </button>
            </div>
          </form>
        )}

        {/* VIEW 4: FORGOT PASSWORD - STEP 3 */}
        {view === 'forgot_new_password' && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">Create a secure new password for your administrator account.</p>
            <div>
              <label className="block text-sm text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Reset Password & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};