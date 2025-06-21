import React, { createContext, useContext, useState, useEffect } from 'react'

interface NotionConfig {
  apiKey: string
  databaseId: string
}

interface NotionContextType {
  config: NotionConfig | null
  setConfig: (config: NotionConfig) => void
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
  const [config, setConfigState] = useState<NotionConfig | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem('notionConfig')
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig)
      setConfigState(parsedConfig)
      setIsConnected(true)
    }
  }, [])

  const setConfig = (newConfig: NotionConfig) => {
    setConfigState(newConfig)
    localStorage.setItem('notionConfig', JSON.stringify(newConfig))
    setIsConnected(true)
  }

  const addExpense = async (expense: Expense): Promise<boolean> => {
    if (!config) return false

    try {
      const response = await fetch('/api/notion/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expense,
          config
        }),
      })

      if (response.ok) {
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding expense:', error)
      return false
    }
  }

  const getExpenses = async (): Promise<Expense[]> => {
    if (!config) return []

    try {
      const response = await fetch('/api/notion/get-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.expenses || []
      }
      return []
    } catch (error) {
      console.error('Error getting expenses:', error)
      return []
    }
  }

  return (
    <NotionContext.Provider value={{
      config,
      setConfig,
      isConnected,
      addExpense,
      getExpenses,
    }}>
      {children}
    </NotionContext.Provider>
  )
}