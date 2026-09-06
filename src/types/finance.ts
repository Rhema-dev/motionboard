export type CategoryId = 'housing' | 'food' | 'transport' | 'fun' | 'shopping' | 'income';
export type ExpenseCategory = Exclude<CategoryId, 'income'>;

type TransactionBase = { id: string; merchant: string; amount: number; occurredAt: string };
export type Transaction =
  | (TransactionBase & { category: ExpenseCategory; kind: 'expense' })
  | (TransactionBase & { category: 'income'; kind: 'income' });

export type Budget = { category: ExpenseCategory; limit: number };
export type CategorySlice = {
  category: ExpenseCategory;
  label: string;
  color: string;
  amount: number;
  percentage: number;
};
