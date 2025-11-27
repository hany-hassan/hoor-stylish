'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
  });

  if (cart.length === 0 && !success) {
    router.push('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إتمام الطلب');
      }

      setSuccess(true);
      setOrderId(data.order.id);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center py-20">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-900 mb-4">تم استلام طلبك بنجاح!</h1>
          <p className="text-sage-600 mb-2">شكراً لتسوقك معنا.</p>
          <p className="text-sage-600 mb-6 font-mono bg-sage-50 py-2 rounded">رقم الطلب: {orderId.slice(-6)}</p>
          <Link
            href="/products"
            className="block w-full bg-burgundy-600 text-white py-3 rounded-lg font-bold hover:bg-burgundy-700 transition-colors"
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="text-burgundy-600 hover:text-burgundy-700">
            <ArrowRight size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-sage-900">إتمام الشراء</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold text-sage-900 mb-6">بيانات التوصيل</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sage-900 font-bold mb-2">الاسم بالكامل</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sage-900 font-bold mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sage-900 font-bold mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sage-900 font-bold mb-2">المدينة</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sage-900 font-bold mb-2">العنوان بالتفصيل</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                      placeholder="اسم الشارع، رقم المبنى، رقم الشقة..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 mt-8"
                >
                  {loading ? 'جاري التنفيذ...' : `تأكيد الطلب ($${total.toFixed(2)})`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-sage-900 mb-6">ملخص الطلب</h2>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-2 border-b border-sage-100 last:border-0">
                    <div className="w-16 h-16 bg-sage-100 rounded-md overflow-hidden flex-shrink-0 relative">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sage-900 text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-sage-500 text-xs">
                        {item.quantity} × ${item.product.price}
                      </p>
                    </div>
                    <p className="font-bold text-burgundy-600 text-sm">
                      ${(item.quantity * item.product.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-sage-200 pt-4 space-y-2">
                <div className="flex justify-between text-sage-600">
                  <span>المجموع الفرعي</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sage-600">
                  <span>الشحن</span>
                  <span className="text-green-600">مجاني</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-sage-900 pt-2">
                  <span>الإجمالي</span>
                  <span className="text-burgundy-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
