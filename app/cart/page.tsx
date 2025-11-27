'use client';

import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart, isCartLoaded } = useCart();

  // Show loading state while cart is being loaded from localStorage
  if (!isCartLoaded) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mb-4"></div>
          <p className="text-sage-600 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag size={100} className="mx-auto text-sage-300 mb-6" />
          <h1 className="text-3xl font-bold text-sage-900 mb-4">سلة التسوق فارغة</h1>
          <p className="text-sage-600 mb-8 text-lg">لم تقم بإضافة أي منتجات بعد</p>
          <Link
            href="/products"
            className="inline-block bg-burgundy-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-burgundy-700 transition-colors"
          >
            تسوقي الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-sage-900">سلة التسوق</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
          >
            <Trash2 size={20} />
            <span>إفراغ السلة</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-xl font-semibold text-sage-900 hover:text-burgundy-600 mb-2 block"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.product.category && (
                      <p className="text-sage-600 mb-3">{item.product.category.name}</p>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="bg-sage-200 hover:bg-sage-300 p-2 rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-bold text-sage-900 w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="bg-sage-200 hover:bg-sage-300 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-left">
                        <p className="text-2xl font-bold text-burgundy-600">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sage-600 text-sm">
                          ${item.product.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <h2 className="text-2xl font-bold text-sage-900 mb-6">ملخص الطلب</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sage-700">
                  <span>المجموع الفرعي</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sage-700">
                  <span>الشحن</span>
                  <span className="font-semibold text-green-600">مجاني</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-sage-900">
                  <span>الإجمالي</span>
                  <span className="text-burgundy-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-4 rounded-lg font-bold text-lg mb-4 transition-colors text-center"
              >
                إتمام عملية الشراء
              </Link>

              <Link
                href="/products"
                className="block text-center text-sage-700 hover:text-burgundy-600 font-medium flex items-center justify-center gap-2"
              >
                <ArrowRight size={20} />
                <span>متابعة التسوق</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
