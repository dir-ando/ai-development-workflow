'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryTotal } from '../../types/household';

interface BreakdownTabProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  getCategoryBreakdown: (month: string, type: 'income' | 'expense') => CategoryTotal[];
}

const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

export function BreakdownTab({ currentMonth, setCurrentMonth, getCategoryBreakdown }: BreakdownTabProps) {
  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const breakdown = getCategoryBreakdown(currentMonth, selectedType);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const chartData = breakdown.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">カテゴリ内訳</h2>
        <input
          type="month"
          value={currentMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType('income')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedType === 'income'
              ? 'bg-green-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          収入
        </button>
        <button
          onClick={() => setSelectedType('expense')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedType === 'expense'
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          支出
        </button>
      </div>

      {breakdown.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {selectedType === 'income' ? '収入' : '支出'}のデータがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {selectedType === 'income' ? '収入' : '支出'}の割合
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">詳細</h3>
            <div className="space-y-3">
              {breakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-700 font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-slate-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-900">合計</span>
                  <span className={selectedType === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
