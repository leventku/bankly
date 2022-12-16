type Balance = {
  amount: {
    currency: string
    value: number
  }
}

export type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: {
    value: number;
    currency_iso: string;
  };
}

export type Account = {
  account_id: string;
  balance: Balance;
}

export type LoadableState<T> =
  | { type: 'not_asked' }
  | { type: 'loading' }
  | { type: 'loaded', data: T[] }
  | { type: 'error', error: Error }