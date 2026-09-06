import { create } from 'zustand';
import { initialBudgets, initialTransactions } from '@/data/mockFinance';
import type { Budget, Transaction } from '@/types/finance';

type FinanceState = {
  transactions: Transaction[];
  budgets: Budget[];
  selectedTransactionId: string | null;
  isSheetOpen: boolean;
  removeTransaction: (id: string) => void;
  updateBudget: (category: Budget['category'], limit: number) => void;
  openTransaction: (id: string) => void;
  closeSheet: () => void;
};

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: initialTransactions,
  budgets: initialBudgets,
  selectedTransactionId: null,
  isSheetOpen: false,
  removeTransaction: (id) => set((state) => ({
    transactions: state.transactions.filter((item) => item.id !== id),
    selectedTransactionId: state.selectedTransactionId === id ? null : state.selectedTransactionId,
    isSheetOpen: state.selectedTransactionId === id ? false : state.isSheetOpen,
  })),
  updateBudget: (category, limit) => set((state) => ({ budgets: state.budgets.map((item) => item.category === category ? { ...item, limit: Math.round(limit) } : item) })),
  openTransaction: (id) => set({ selectedTransactionId: id, isSheetOpen: true }),
  closeSheet: () => set({ isSheetOpen: false, selectedTransactionId: null }),
}));
