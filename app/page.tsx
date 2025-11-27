'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Sparkles, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const latestProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-burgundy-600 via-burgundy-500 to-gold-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={40} className="text-gold-300" />
            <h1 className="text-5xl md:text-6xl font-bold">حور ستايلش</h1>
            <Sparkles size={40} className="text-gold-300" />
          </div>
          <p className="text-xl md:text-2xl mb-8 text-sand-100 max-w-3xl mx-auto leading-relaxed">
            أزياء إسلامية راقية ومحتشمة - حيث تلتقي الأناقة بالاحتشام
          </p>
          <p className="text-lg mb-10 text-sand-50 max-w-2xl mx-auto">
            اكتشفي مجموعتنا المميزة من العبايات الفاخرة، الحجاب الأنيق، والفساتين المحتشمة التي تجمع بين الموضة العصرية والقيم الإسلامية
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-burgundy-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-sand-50 transition-all hover:scale-105 shadow-lg"
          >
            تسوقي الآن
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-sand-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-10">
              <Star size={32} className="text-gold-500" />
              <h2 className="text-4xl font-bold text-sage-900">المنتجات المميزة</h2>
              <Star size={32} className="text-gold-500" />
            </div>
            <p className="text-center text-sage-600 mb-12 text-lg">
              اختيارنا المميز من أفضل القطع لإطلالة محتشمة وأنيقة
            </p>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
                <p className="mt-4 text-sage-600">جاري التحميل...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Collection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-10">
            <TrendingUp size={32} className="text-burgundy-600" />
            <h2 className="text-4xl font-bold text-sage-900">أحدث الكوليكشن</h2>
            <TrendingUp size={32} className="text-burgundy-600" />
          </div>
          <p className="text-center text-sage-600 mb-12 text-lg">
            اكتشفي أحدث إضافاتنا من الأزياء الإسلامية العصرية
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
              <p className="mt-4 text-sage-600">جاري التحميل...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-burgundy-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-burgundy-700 transition-colors"
            >
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gradient-to-br from-sage-100 to-sand-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-sage-900 mb-12">تصنيفاتنا</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['عبايات', 'حجاب وطرح', 'نقاب', 'فساتين محتشمة', 'جلابيات'].map((category) => (
              <Link
                key={category}
                href="/products"
                className="bg-white p-6 rounded-lg text-center hover:shadow-xl transition-all hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-sage-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
