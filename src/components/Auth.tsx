import { useState } from 'react';
import type { AuthUser } from '../types';

interface AuthProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [infoData, setInfoData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfoData({
      ...infoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && infoData.password !== infoData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { username: infoData.email, password: infoData.password }
        : {
            name: infoData.name,
            email: infoData.email,
            username: infoData.username,
            password: infoData.password,
          };

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-clay-200 py-12 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-md w-full">
        {/* Window Frame */}
        <div className="relative rounded-lg border-2 border-clay-700 shadow-[0_8px_32px_0_rgba(110,62,37,0.25)] bg-clay-50 overflow-hidden">
          {/* Title Bar */}
          <div
            className="flex items-center justify-between px-3 py-1 bg-clay-400 border-clay-700"
            style={{
              fontFamily:
                'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-300 border border-blue-900"></span>
              <span className="w-3 h-3 rounded-full bg-red-300 border border-red-900"></span>
              <span className="w-3 h-3 rounded-full bg-green-300 border border-green-900"></span>
            </div>
          </div>

          {/* Login window */}
          <div className="p-8 bg-clay-50">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Toggle */}
            <div className="flex flex-col items-center mb-8">
              <h2
                className="text-2xl font-extrabold text-clay-800 mb-1 tracking-wider uppercase"
                style={{
                  fontFamily:
                    'monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                }}
              >
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-clay-500 text-xs mb-4 tracking-widest"></p>
              <div className="flex items-center bg-clay-200 rounded p-1 border border-clay-400">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-1 rounded text-xs font-bold transition-all tracking-widest uppercase border ${
                    isLogin
                      ? 'bg-clay-100 text-clay-800 border-clay-700'
                      : 'text-clay-400 border-transparent hover:text-clay-600'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-1 rounded text-xs font-bold transition-all duration-200 tracking-widest uppercase border ${
                    !isLogin
                      ? 'bg-clay-200 text-clay-800 border-clay-400'
                      : 'text-clay-400 border-transparent hover:text-clay-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-base font-bold text-clay-700 mb-2 tracking-wider"
                  >
                    Nick Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={infoData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-clay-400 rounded-md focus:ring-2 focus:ring-clay-400 focus:border-clay-500 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors text-sm shadow-[inset_2px_2px_6px_0_rgba(160,109,75,0.10)] outline-none"
                    placeholder="Enter your nick name"
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-bold text-clay-700 mb-2 tracking-wider"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={infoData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-clay-400 rounded-md focus:ring-2 focus:ring-clay-400 focus:border-clay-500 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors text-sm shadow-[inset_2px_2px_6px_0_rgba(160,109,75,0.10)] outline-none"
                    placeholder="Enter your username"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-base font-bold text-clay-700 mb-2 tracking-wider"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={infoData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-clay-400 rounded-md focus:ring-2 focus:ring-clay-400 focus:border-clay-500 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors text-sm shadow-[inset_2px_2px_6px_0_rgba(160,109,75,0.10)] outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-base font-bold text-clay-700 mb-2 tracking-wider"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={infoData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-clay-400 rounded-md focus:ring-2 focus:ring-clay-400 focus:border-clay-500 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors text-sm shadow-[inset_2px_2px_6px_0_rgba(160,109,75,0.10)] outline-none"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-base font-bold text-clay-700 mb-2 tracking-wider"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={infoData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-clay-400 rounded-md focus:ring-2 focus:ring-clay-400 focus:border-clay-500 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors text-sm shadow-[inset_2px_2px_6px_0_rgba(160,109,75,0.10)] outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-clay-500 to-clay-700 text-clay-50 py-2 px-4 rounded-md font-bold tracking-widest uppercase shadow-lg hover:from-clay-600 hover:to-clay-800 focus:outline-none focus:ring-2 focus:ring-clay-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-clay-700"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
