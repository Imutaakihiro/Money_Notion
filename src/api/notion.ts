// This is a placeholder for the Notion API functions
// In a real implementation, these would be server-side endpoints

import { Client } from '@notionhq/client'

const notion = new Client({
  auth: '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',
})

const DATABASE_ID = '21954fc183298038be67fccacb31e13a'

async function callApi(action: string, payload?: any) {
  try {
    const response = await fetch('/api/notion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || `API Error: ${response.statusText}`)
    }
    
    return data
  } catch (error: any) {
    console.error(`API call failed for action: ${action}`, error)
    return { success: false, error: { message: error.message } }
  }
}

export const testConnection = () => callApi('testConnection')
export const addExpense = (expense: any) => callApi('addExpense', expense)
export const getExpenses = () => callApi('getExpenses')