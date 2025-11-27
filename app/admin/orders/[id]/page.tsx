'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, Mail, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order', error);
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!confirm('هل أنت متأكد من تغيير حالة الطلب؟')) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      const data = await res.json();
      setOrder(data.order);
      alert('تم تحديث حالة الطلب بنجاح');
    } catch (error) {
      alert('فشل تحديث حالة الطلب');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'قيد الانتظار',
      confirmed: 'تم التأكيد',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-sand-50">
        <h1 className="text-2xl font-bold text-sage-900 mb-4">الطلب غير موجود</h1>
        <Link href="/admin/orders" className="text-burgundy-600 hover:text-burgundy-700 flex items-center gap-2">
          <ArrowRight size={20} />
          العودة للطلبات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="text-burgundy-600 hover:text-burgundy-700">
              <ArrowRight size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-sage-900">تفاصيل الطلب #{order.id.slice(-6)}</h1>
              <p className="text-sage-600 text-sm">
                تم الطلب في {new Date(order.createdAt).toLocaleDateString('ar-EG')} الساعة {new Date(order.createdAt).toLocaleTimeString('ar-EG')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Info & Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-sage-900 mb-4">حالة الطلب</h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getStatusColor(order.status)}`}>
                  {order.status === 'pending' && <Clock size={20} />}
                  {order.status === 'confirmed' && <CheckCircle size={20} />}
                  {order.status === 'shipped' && <Truck size={20} />}
                  {order.status === 'delivered' && <CheckCircle size={20} />}
                  {order.status === 'cancelled' && <XCircle size={20} />}
                  {getStatusText(order.status)}
                </span>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus('confirmed')}
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        تأكيد الطلب
                      </button>
                      <button
                        onClick={() => updateStatus('cancelled')}
                        disabled={updating}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        إلغاء الطلب
                      </button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus('shipped')}
                      disabled={updating}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      شحن الطلب
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateStatus('delivered')}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      تم التوصيل
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-sage-900 mb-4">المنتجات ({order.orderItems.length})</h2>
              <div className="divide-y divide-sage-100">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-sage-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-sage-900">{item.product.name}</h3>
                      <p className="text-sage-600 text-sm">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-burgundy-600">${item.price.toFixed(2)}</p>
                      <p className="text-xs text-sage-500">الإجمالي: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-sage-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-sage-900">المجموع الكلي</span>
                <span className="font-bold text-2xl text-burgundy-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-sage-900 mb-6">بيانات العميل</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-sage-100 p-2 rounded-full text-sage-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-sage-500">الاسم</p>
                    <p className="font-medium text-sage-900">{order.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-sage-100 p-2 rounded-full text-sage-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-sage-500">البريد الإلكتروني</p>
                    <p className="font-medium text-sage-900">{order.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-sage-100 p-2 rounded-full text-sage-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-sage-500">رقم الهاتف</p>
                    <p className="font-medium text-sage-900 dir-ltr text-right">{order.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-sage-900 mb-6">عنوان التوصيل</h2>
              
              <div className="flex items-start gap-3">
                <div className="bg-sage-100 p-2 rounded-full text-sage-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-medium text-sage-900 mb-1">{order.city}</p>
                  <p className="text-sage-600 leading-relaxed">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
