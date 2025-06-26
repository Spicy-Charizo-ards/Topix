import { useState } from 'react';
import type { AuthUser } from '../types';

interface AuthProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            username: formData.username,
            password: formData.password,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-clay-100 to-clay-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-clay-50 rounded-xl shadow-2xl p-8 border border-clay-200">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-clay-700 mb-2"
                >
                  Nick Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-clay-200 rounded-lg focus:ring-2 focus:ring-clay-400 focus:border-clay-400 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors"
                  placeholder="Enter your nick name"
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-clay-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-clay-200 rounded-lg focus:ring-2 focus:ring-clay-400 focus:border-clay-400 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-clay-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-clay-200 rounded-lg focus:ring-2 focus:ring-clay-400 focus:border-clay-400 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium text-clay-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-clay-200 rounded-lg focus:ring-2 focus:ring-clay-400 focus:border-clay-400 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-lg font-medium text-clay-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-clay-200 rounded-lg focus:ring-2 focus:ring-clay-400 focus:border-clay-400 bg-clay-100 text-clay-900 placeholder-clay-400 transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-clay-500 to-clay-700 text-clay-50 py-3 px-4 rounded-lg font-medium hover:from-clay-600 hover:to-clay-800 focus:outline-none focus:ring-2 focus:ring-clay-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-clay-500">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-clay-700 hover:text-clay-900 font-medium transition-colors"
              >
                {isLogin ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
