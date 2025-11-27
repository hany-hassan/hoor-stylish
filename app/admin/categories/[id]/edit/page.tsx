'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, ArrowRight } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (!res.ok) {
          throw new Error('Category not found');
        }
        const data = await res.json();
        setFormData({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
        });
        setLoading(false);
      } catch (err) {
        setError('فشل تحميل بيانات التصنيف');
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'فشل تحديث التصنيف');
        setSaving(false);
        return;
      }

      alert('تم تحديث التصنيف بنجاح!');
      router.push('/admin/categories');
    } catch (err) {
      setError('حدث خطأ أثناء تحديث التصنيف');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/categories" className="text-burgundy-600 hover:text-burgundy-700">
              <ArrowRight size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-sage-900">تعديل التصنيف: {formData.name}</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                اسم التصنيف <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                الرابط (Slug) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white py-3 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </button>

              <Link
                href="/admin/categories"
                className="flex-1 bg-sage-200 hover:bg-sage-300 text-sage-900 py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} />
                <span>إلغاء</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
