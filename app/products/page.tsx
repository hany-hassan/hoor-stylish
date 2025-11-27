'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/types';
import { Filter } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((res) => res.json()),
      fetch('/api/categories').then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-sage-900 mb-4">جميع المنتجات</h1>
          <p className="text-lg text-sage-600">
            اكتشفي مجموعتنا الكاملة من الأزياء الإسلامية الأنيقة
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={24} className="text-burgundy-600" />
            <h2 className="text-2xl font-semibold text-sage-900">التصنيفات</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === ''
                  ? 'bg-burgundy-600 text-white'
                  : 'bg-white text-sage-700 hover:bg-sage-100'
              }`}
            >
              الكل
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-burgundy-600 text-white'
                    : 'bg-white text-sage-700 hover:bg-sage-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Count */}
        <div className="mb-6">
          <p className="text-sage-600 text-lg">
            عرض <span className="font-bold text-burgundy-600">{filteredProducts.length}</span> منتج
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-burgundy-600"></div>
            <p className="mt-4 text-sage-600 text-lg">جاري تحميل المنتجات...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-sage-600">لا توجد منتجات في هذا التصنيف</p>
          </div>
        )}
      </div>
    </div>
  );
}
