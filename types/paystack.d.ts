declare module "@paystack/inline-js" {
  interface TransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    onSuccess?: (transaction: { reference: string; [key: string]: unknown }) => void;
    onCancel?: () => void;
  }

  export default class PaystackPop {
    newTransaction(options: TransactionOptions): void;
  }
}
