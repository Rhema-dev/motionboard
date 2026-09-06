import { colors } from '@/theme';
import type { Budget, CategoryId, CategorySlice, ExpenseCategory, Transaction } from '@/types/finance';

export const categoryMeta: Record<Exclude<CategoryId, 'income'>, { label: string; color: string; glyph: string }> = {
  housing: { label: 'Housing', color: colors.primary, glyph: 'H' },
  food: { label: 'Food', color: colors.warning, glyph: 'F' },
  transport: { label: 'Transport', color: colors.blue, glyph: 'T' },
  fun: { label: 'Leisure', color: colors.purple, glyph: 'L' },
  shopping: { label: 'Shopping', color: colors.danger, glyph: 'S' },
};

export function formatNaira(value: number) {
  return `₦${Math.round(value).toLocaleString('en-NG')}`;
}

export function expenseTotal(transactions: Transaction[]) {
  return transactions.filter((item) => item.kind === 'expense').reduce((sum, item) => sum + item.amount, 0);
}

export function incomeTotal(transactions: Transaction[]) {
  return transactions.filter((item) => item.kind === 'income').reduce((sum, item) => sum + item.amount, 0);
}

export function categorySlices(transactions: Transaction[]): CategorySlice[] {
  const total = expenseTotal(transactions);
  const amounts = new Map<ExpenseCategory, number>();
  transactions.forEach((item) => {
    if (item.kind === 'expense') amounts.set(item.category, (amounts.get(item.category) ?? 0) + item.amount);
  });
  return (Object.entries(categoryMeta) as [ExpenseCategory, (typeof categoryMeta)[ExpenseCategory]][])
    .map(([category, meta]) => ({ category, label: meta.label, color: meta.color, amount: amounts.get(category) ?? 0, percentage: total ? (amounts.get(category) ?? 0) / total : 0 }))
    .filter((slice) => slice.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function spentForBudget(budget: Budget, transactions: Transaction[]) {
  return transactions.filter((item) => item.kind === 'expense' && item.category === budget.category).reduce((sum, item) => sum + item.amount, 0);
}
