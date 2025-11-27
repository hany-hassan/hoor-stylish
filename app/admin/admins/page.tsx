'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, User } from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشرف؟')) return;

    try {
      const res = await fetch(`/api/admin/admins/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAdmins(admins.filter((admin) => admin.id !== id));
      } else {
        alert('فشل حذف المشرف');
      }
    } catch (error) {
      console.error('Failed to delete admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-sage-900">إدارة المشرفين</h1>
          <Link
            href="/admin/admins/new"
            className="bg-burgundy-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-burgundy-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة مشرف جديد</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-sage-50 text-sage-900">
                <tr>
                  <th className="px-6 py-4 font-bold">الاسم</th>
                  <th className="px-6 py-4 font-bold">البريد الإلكتروني</th>
                  <th className="px-6 py-4 font-bold">تاريخ الإنضمام</th>
                  <th className="px-6 py-4 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-sage-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-sage-900 flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-200 rounded-full flex items-center justify-center text-sage-600">
                        <User size={20} />
                      </div>
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sage-600">{admin.email}</td>
                    <td className="px-6 py-4 text-sage-600" dir="ltr">
                      {new Date(admin.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
