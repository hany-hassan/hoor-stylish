'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/lib/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-64 bg-sand-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              مميز
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-block bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
              {product.category.name}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-sage-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sage-600 text-sm line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-burgundy-600">
              ${product.price}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ShoppingCart size={18} />
              <span>إضافة للسلة</span>
            </button>
          </div>

          {/* Stock Status */}
          {product.stock <= 0 && (
            <p className="text-red-600 text-sm mt-2 font-medium">نفذت الكمية</p>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-gold-600 text-sm mt-2">
              {product.stock} قطع متبقية فقط
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
