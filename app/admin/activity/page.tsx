'use client';

import { useState, useEffect } from 'react';
import { Clock, User } from 'lucide-react';

interface Activity {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-sage-900 mb-8">سجل النشاطات</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-sage-50 text-sage-900">
                <tr>
                  <th className="px-6 py-4 font-bold">النشاط</th>
                  <th className="px-6 py-4 font-bold">التفاصيل</th>
                  <th className="px-6 py-4 font-bold">المستخدم</th>
                  <th className="px-6 py-4 font-bold">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-sage-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-sage-900">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 text-sage-600">
                      {activity.details || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sage-700">
                        <User size={16} />
                        <span>{activity.admin.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sage-500 text-sm" dir="ltr">
                      <div className="flex items-center justify-end gap-2">
                        <span>{new Date(activity.createdAt).toLocaleString('ar-EG')}</span>
                        <Clock size={14} />
                      </div>
                    </td>
                  </tr>
                ))}
                {activities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sage-500">
                      لا توجد نشاطات مسجلة بعد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
