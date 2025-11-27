'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, ArrowRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    featured: false,
    categoryId: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`),
        ]);

        if (!productRes.ok) {
          throw new Error('Product not found');
        }

        const categoriesData = await categoriesRes.json();
        const productData = await productRes.json();

        setCategories(categoriesData);
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          price: productData.price.toString(),
          image: productData.image,
          stock: productData.stock.toString(),
          featured: productData.featured,
          categoryId: productData.categoryId,
          imageFile: null,
        });
      } catch (err) {
        setError('فشل تحميل بيانات المنتج');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        imageFile: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('slug', formData.slug);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('featured', String(formData.featured));
      data.append('categoryId', formData.categoryId);
      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      } else if (formData.image) {
        data.append('imageUrl', formData.image);
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: data,
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || 'فشل تحديث المنتج');
        setSaving(false);
        return;
      }

      alert('تم تحديث المنتج بنجاح!');
      router.push('/admin/products');
    } catch (err) {
      setError('حدث خطأ أثناء تحديث المنتج');
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
            <Link href="/admin/products" className="text-burgundy-600 hover:text-burgundy-700">
              <ArrowRight size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-sage-900">تعديل المنتج: {formData.name}</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                اسم المنتج <span className="text-red-600">*</span>
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
                الوصف <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sage-900 font-bold mb-2">
                  السعر ($) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sage-900 font-bold mb-2">
                  الكمية المتوفرة
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                التصنيف <span className="text-red-600">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                required
              >
                <option value="">اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sage-900 font-bold mb-2">
                صورة المنتج
              </label>
              
              {formData.image && !formData.imageFile && (
                <div className="mb-4">
                  <p className="text-sm text-sage-600 mb-2">الصورة الحالية:</p>
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-sage-200">
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-burgundy-50 file:text-burgundy-700 hover:file:bg-burgundy-100"
              />
              <p className="text-sm text-sage-600 mt-1">
                اختر صورة جديدة لتغيير الصورة الحالية (اختياري)
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-burgundy-600 border-sage-300 rounded focus:ring-burgundy-500"
              />
              <label className="text-sage-900 font-medium">منتج مميز</label>
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
                href="/admin/products"
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
