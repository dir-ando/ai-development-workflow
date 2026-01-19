import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Transaction } from '../../types/household';
import { TransactionForm } from './TransactionForm';

interface HistoryTabProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  getTransactionsByMonth: (month: string) => Transaction[];
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export function HistoryTab({
  currentMonth,
  setCurrentMonth,
  getTransactionsByMonth,
  updateTransaction,
  deleteTransaction,
}: HistoryTabProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const transactions = getTransactionsByMonth(currentMonth);

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMonth(e.target.value);
  };

  const handleDelete = (id: string) => {
    if (confirm('この取引を削除してもよろしいですか？')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">取引履歴</h2>
        <input
          type="month"
          value={currentMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            取引がありません
          </div>
        ) : (
          transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-2xl font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{formatDate(transaction.date)}</div>
                    {transaction.description && (
                      <div className="text-sm text-slate-500 mt-1">{transaction.description}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="編集"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      title="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      <Dialog.Root open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-[overlayShow_150ms_cubic-bezier(0.16,1,0.3,1)]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md data-[state=open]:animate-[contentShow_150ms_cubic-bezier(0.16,1,0.3,1)]">
            <Dialog.Title className="text-2xl font-bold text-slate-900 mb-6">取引を編集</Dialog.Title>
            {editingTransaction && (
              <TransactionForm
                initialData={editingTransaction}
                onSubmit={(updates) => {
                  updateTransaction(editingTransaction.id, updates);
                  setEditingTransaction(null);
                }}
                onCancel={() => setEditingTransaction(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
