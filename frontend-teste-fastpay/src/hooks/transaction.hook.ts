import create from 'zustand'
import { devtools } from 'zustand/middleware'
import api from '@/services/api'
import { Category } from './category.hook'
import { useAsyncHook } from './async.hook'

type Transaction = {
  id?: string;
  description: string;
  value: number;
  date: string;
  categoryId: Number;
  category?: Category;
};

type TransactionHook = {
  transactions?: Transaction[];
  transaction?: Transaction;
  getTransactions: () => void;
  addTransaction: (data: Transaction) => void;
  editTransaction: (id: string, data: Transaction) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => void;
  getSummary: () => void;
};


export const useTransactionHook = create<TransactionHook>()(
  devtools((set, get) => ({
    getTransactions: async () => {
      const response = await api.get('/transactions')
        .then((response) => {
          response.data.map((transaction: Transaction) => {
            transaction.date = new Date(transaction.date).toISOString().split('T')[0]
            transaction.date = transaction.date.split('-').reverse().join('/')
          });
          set({ transactions: response.data })
        })
        .catch(() => {
          alert
            ('Erro ao carregar transações')
        }
        );
      return response;
    },
    addTransaction: async (data) => {
      const asyncHook = useAsyncHook.getState()
      asyncHook.loading()
      const response = await api.post('/transactions', data)
        .then(() => {
          alert('Transação adicionada com sucesso')
          asyncHook.sucess()
          get().getTransactions();
        })
        .catch(() => {
          alert('Erro ao adicionar transação')
          asyncHook.sucess()
        });
      return response;
    },
    editTransaction: async (id, data) => {
      const asyncHook = useAsyncHook.getState()
      asyncHook.loading()
      const response = await api.put(`/transactions/${id}`, data)
        .then(() => {
          alert('Transação editada com sucesso')
          asyncHook.sucess()
          get().getTransactions();
        })
        .catch(() => {
          alert('Erro ao editar transação')
          asyncHook.sucess()
        });
      return response;
    },
    deleteTransaction: async (id) => {
      const response = await api.delete(`/transactions/${id}`)
        .then(() => {
          alert('Transação deletada com sucesso')
          get().getTransactions()
        })
        .catch(() => {
          alert('Erro ao deletar transação')
        });

      return response;
    },
    getTransactionById: async (id) => {
      try {
        const response = await api.get(`/transactions/${id}`)
        set({ transaction: response.data })
      } catch (error) {
        alert('Erro ao carregar transação')
      }
    },
    getSummary: async () => {
      try {
        const response = await api.post('/transactions/summary')
        return response.data
      } catch (error) {
        alert('Erro ao carregar relatório')
      }
    },
  }))
)