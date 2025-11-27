'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'حدث خطأ');
        setLoading(false);
        return;
      }

      // تسجيل الدخول نجح - الانتقال للوحة التحكم
      router.push('/admin');
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-600 via-burgundy-500 to-gold-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-burgundy-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-burgundy-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-900 mb-2">لوحة التحكم</h1>
          <p className="text-sage-600">حور ستايلش - تسجيل الدخول</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sage-900 font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="admin@hoorstylish.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sage-900 font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-3 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        {/* Default Credentials Info */}
        <div className="mt-6 p-4 bg-sand-50 rounded-lg">
          <p className="text-sm text-sage-600 text-center">
            <strong>للتجربة:</strong> admin@hoorstylish.com / Admin@123
          </p>
        </div>
      </div>
    </div>
  );
}
