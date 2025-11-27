'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-burgundy-600"></div>
          <p className="mt-4 text-sage-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-sage-600 mb-6">المنتج غير موجود</p>
          <Link href="/products" className="text-burgundy-600 hover:text-burgundy-700 font-medium">
            العودة للمنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sage-600 mb-8">
          <Link href="/" className="hover:text-burgundy-600">الرئيسية</Link>
          <ArrowRight size={16} />
          <Link href="/products" className="hover:text-burgundy-600">المنتجات</Link>
          <ArrowRight size={16} />
          <span className="text-sage-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-96 lg:h-[600px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.featured && (
                <div className="absolute top-6 right-6 bg-gold-500 text-white px-4 py-2 rounded-full font-bold">
                  منتج مميز
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Category */}
            {product.category && (
              <span className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                {product.category.name}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-sage-900 mb-4">{product.name}</h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-5xl font-bold text-burgundy-600">${product.price}</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-sage-900 mb-3">الوصف</h2>
              <p className="text-sage-700 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <CheckCircle size={20} />
                  متوفر في المخزون ({product.stock} قطعة)
                </p>
              ) : (
                <p className="text-red-600 font-medium">نفذت الكمية</p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-8">
                <label className="block text-sage-900 font-semibold mb-3 text-lg">الكمية</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-sage-200 hover:bg-sage-300 p-3 rounded-lg transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold text-sage-900 w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="bg-sage-200 hover:bg-sage-300 p-3 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  added
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-burgundy-600 hover:bg-burgundy-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle size={24} />
                    <span>تمت الإضافة للسلة</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={24} />
                    <span>إضافة للسلة</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
