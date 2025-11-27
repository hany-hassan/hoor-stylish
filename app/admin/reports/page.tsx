'use client';

import { useState, useEffect } from 'react';
import { BarChart, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

interface SalesData {
  date: string;
  total: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setSalesData(data.salesData);
        setTopProducts(data.topProducts);
        setTotalRevenue(data.totalRevenue);
      }
    } catch (error) {
      console.error('Failed to fetch reports');
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

  // Calculate max value for chart scaling
  const maxSales = Math.max(...salesData.map((d) => d.total), 1);

  return (
    <div className="min-h-screen bg-sand-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-sage-900 mb-8">التقارير والإحصائيات</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">إجمالي المبيعات</p>
                <p className="text-3xl font-bold text-burgundy-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign size={40} className="text-burgundy-200" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">عدد الطلبات</p>
                <p className="text-3xl font-bold text-burgundy-600">
                  {salesData.reduce((acc, curr) => acc + 1, 0)} {/* Approximate for demo */}
                </p>
              </div>
              <ShoppingBag size={40} className="text-burgundy-200" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">متوسط قيمة الطلب</p>
                <p className="text-3xl font-bold text-burgundy-600">
                  ${(totalRevenue / (salesData.length || 1)).toFixed(2)}
                </p>
              </div>
              <TrendingUp size={40} className="text-burgundy-200" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
              <BarChart size={24} />
              <span>المبيعات اليومية (آخر 7 أيام)</span>
            </h2>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {salesData.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="w-full bg-burgundy-500 rounded-t-sm hover:bg-burgundy-600 transition-colors relative group"
                    style={{ height: `${(day.total / maxSales) * 100}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-sage-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${day.total}
                    </div>
                  </div>
                  <span className="text-xs text-sage-600 rotate-45 origin-left mt-2">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-sage-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              <span>المنتجات الأكثر مبيعاً</span>
            </h2>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-burgundy-100 text-burgundy-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium text-sage-900">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-burgundy-600">${product.revenue}</p>
                    <p className="text-xs text-sage-500">{product.sales} مبيعات</p>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-center text-sage-500 py-4">لا توجد بيانات كافية</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
