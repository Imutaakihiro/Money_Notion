import React, { createContext, useContext, useState, useEffect } from 'react'
import { testConnection, addExpense as addExpenseAPI, getExpenses as getExpensesAPI } from '../api/notion'

interface NotionContextType {
  isConnected: boolean
  addExpense: (expense: Expense) => Promise<boolean>
  getExpenses: () => Promise<Expense[]>
}

export interface Expense {
  id?: string
  amount: number
  paymentMethod: string
  purpose: string
  date: string
}

const NotionContext = createContext<NotionContextType | undefined>(undefined)

export const useNotion = () => {
  const context = useContext(NotionContext)
  if (context === undefined) {
    throw new Error('useNotion must be used within a NotionProvider')
  }
  return context
}

export const NotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // アプリ起動時にNotion接続をテスト
    const checkConnection = async () => {
      const result = await testConnection()
      setIsConnected(result.success)
    }
    checkConnection()
  }, [])

  const addExpense = async (expense: Expense): Promise<boolean> => {
    try {
      const result = await addExpenseAPI(expense)
      return result.success
    } catch (error) {
      console.error('Error adding expense:', error)
      return false
    }
  }

  const getExpenses = async (): Promise<Expense[]> => {
    try {
      const result = await getExpensesAPI()
      return result.success ? result.expenses : []
    } catch (error) {
      console.error('Error getting expenses:', error)
      return []
    }
  }

  return (
    <NotionContext.Provider value={{
      isConnected,
      addExpense,
      getExpenses,
    }}>
      {children}
    </NotionContext.Provider>
  )
}