import { useLocalStorage } from './useLocalStorage';
import type { Transaction, MonthlySummary, CategoryTotal } from '../types/household';

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('household-transactions', []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  const getTransactionsByMonth = (yearMonth: string): Transaction[] => {
    return transactions.filter((transaction) => transaction.date.startsWith(yearMonth));
  };

  const getMonthlySummary = (yearMonth: string): MonthlySummary => {
    const monthTransactions = getTransactionsByMonth(yearMonth);
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  };

  const getCategoryBreakdown = (yearMonth: string, type: 'income' | 'expense'): CategoryTotal[] => {
    const monthTransactions = getTransactionsByMonth(yearMonth).filter((t) => t.type === type);
    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, number>();
    monthTransactions.forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

    const result: CategoryTotal[] = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }));

    return result.sort((a, b) => b.amount - a.amount);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByMonth,
    getMonthlySummary,
    getCategoryBreakdown,
  };
}
