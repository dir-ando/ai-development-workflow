'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useTransactions } from '../hooks/useTransactions';
import { OverviewTab } from '../components/household/OverviewTab';
import { HistoryTab } from '../components/household/HistoryTab';
import { BreakdownTab } from '../components/household/BreakdownTab';

export default function HouseholdPage() {
  const transactionHooks = useTransactions();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 pb-0">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-4xl font-bold text-slate-900">家計簿アプリ</h1>
            </div>
            <p className="text-slate-600 mb-6">
              収入と支出を記録して、家計を管理しましょう
            </p>
          </div>

          <Tabs.Root defaultValue="overview" className="w-full">
            <Tabs.List className="flex border-b border-slate-200 px-8">
              <Tabs.Trigger
                value="overview"
                className="flex items-center gap-2 px-6 py-4 text-slate-600 hover:text-slate-900 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                概要
              </Tabs.Trigger>
              <Tabs.Trigger
                value="history"
                className="flex items-center gap-2 px-6 py-4 text-slate-600 hover:text-slate-900 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                取引履歴
              </Tabs.Trigger>
              <Tabs.Trigger
                value="breakdown"
                className="flex items-center gap-2 px-6 py-4 text-slate-600 hover:text-slate-900 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                カテゴリ内訳
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview" className="p-8">
              <OverviewTab
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                {...transactionHooks}
              />
            </Tabs.Content>

            <Tabs.Content value="history" className="p-8">
              <HistoryTab
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                {...transactionHooks}
              />
            </Tabs.Content>

            <Tabs.Content value="breakdown" className="p-8">
              <BreakdownTab
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                {...transactionHooks}
              />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </main>
    </div>
  );
}
