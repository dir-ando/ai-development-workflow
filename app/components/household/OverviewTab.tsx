import { useState } from 'react';
import type { Transaction } from '../../types/household';
import { TransactionForm } from './TransactionForm';

interface OverviewTabProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  getMonthlySummary: (month: string) => {
    income: number;
    expense: number;
    balance: number;
  };
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function OverviewTab({ currentMonth, setCurrentMonth, getMonthlySummary, addTransaction }: OverviewTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const summary = getMonthlySummary(currentMonth);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{currentMonth.replace('-', '年')}月の収支</h2>
        <input
          type="month"
          value={currentMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-slate-600">収入</h3>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(summary.income)}</div>
          <div className="text-xs text-slate-500 mt-1">0件の取引</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-slate-600">支出</h3>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-red-600">{formatCurrency(summary.expense)}</div>
          <div className="text-xs text-slate-500 mt-1">1件の取引</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-slate-600">収支</h3>
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className={`text-3xl font-bold ${summary.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            {summary.balance >= 0 ? formatCurrency(summary.balance) : `-${formatCurrency(Math.abs(summary.balance))}`}
          </div>
          <div className="text-xs text-slate-500 mt-1">資産</div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-semibold">新しい取引を追加</span>
        </button>

        {isFormOpen && (
          <div className="mt-6">
            <TransactionForm
              onSubmit={(transaction) => {
                addTransaction(transaction);
                setIsFormOpen(false);
              }}
              onCancel={() => setIsFormOpen(false)}
              defaultDate={`${currentMonth}-${String(new Date().getDate()).padStart(2, '0')}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
