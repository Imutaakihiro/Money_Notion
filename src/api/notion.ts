// This is a placeholder for the Notion API functions
// In a real implementation, these would be server-side endpoints

export const testConnection = async (_config: { apiKey: string; databaseId: string }) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}

export const addExpense = async (_expense: any, _config: { apiKey: string; databaseId: string }) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 1000)
  })
}

export const getExpenses = async (_config: { apiKey: string; databaseId: string }) => {
  // Simulate API call with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        expenses: [
          {
            id: '1',
            amount: 1500,
            paymentMethod: 'クレジットカード',
            purpose: '昼食',
            date: new Date().toISOString()
          },
          {
            id: '2',
            amount: 300,
            paymentMethod: '現金',
            purpose: '電車代',
            date: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      })
    }, 1000)
  })
}