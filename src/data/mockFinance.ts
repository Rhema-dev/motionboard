import type { Budget, Transaction } from '@/types/finance';

export const initialTransactions: Transaction[] = [
  { id: 't1', merchant: 'Salary', category: 'income', amount: 420000, occurredAt: '2026-09-01', kind: 'income' },
  { id: 't2', merchant: 'Rent', category: 'housing', amount: 120000, occurredAt: '2026-09-02', kind: 'expense' },
  { id: 't3', merchant: 'Market Square', category: 'food', amount: 18500, occurredAt: '2026-09-02', kind: 'expense' },
  { id: 't4', merchant: 'Bolt', category: 'transport', amount: 6400, occurredAt: '2026-09-03', kind: 'expense' },
  { id: 't5', merchant: 'Filmhouse', category: 'fun', amount: 8500, occurredAt: '2026-09-03', kind: 'expense' },
  { id: 't6', merchant: 'Data bundle', category: 'shopping', amount: 12000, occurredAt: '2026-09-04', kind: 'expense' },
  { id: 't7', merchant: 'Artisan Café', category: 'food', amount: 5600, occurredAt: '2026-09-04', kind: 'expense' },
  { id: 't8', merchant: 'Fuel', category: 'transport', amount: 15000, occurredAt: '2026-09-05', kind: 'expense' }
];

export const initialBudgets: Budget[] = [
  { category: 'housing', limit: 140000 },
  { category: 'food', limit: 60000 },
  { category: 'transport', limit: 45000 },
  { category: 'fun', limit: 30000 },
  { category: 'shopping', limit: 40000 }
];
