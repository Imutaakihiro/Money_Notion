// This is a placeholder for the Notion API functions
// In a real implementation, these would be server-side endpoints

import { Client } from '@notionhq/client'

const notion = new Client({
  auth: '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',
})

const DATABASE_ID = '21954fc183298038be67fccacb31e13a'

export const testConnection = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    await notion.databases.retrieve({ database_id: DATABASE_ID })
    return { success: true }
  } catch (error) {
    console.error('Notion connection error:', error)
    return { success: false, error }
  }
}

export const addExpense = async (expense: {
  amount: number
  paymentMethod: string
  purpose: string
  date: string
}) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        '金額': {
          number: expense.amount
        },
        '支払い方法': {
          select: {
            name: expense.paymentMethod
          }
        },
        '用途': {
          title: [
            {
              text: {
                content: expense.purpose
              }
            }
          ]
        },
        '日付': {
          date: {
            start: expense.date
          }
        }
      }
    })
    return { success: true, data: response }
  } catch (error) {
    console.error('Error adding expense:', error)
    return { success: false, error }
  }
}

export const getExpenses = async () => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: '日付',
          direction: 'descending'
        }
      ]
    })

    const expenses = response.results.map((page: any) => ({
      id: page.id,
      amount: page.properties['金額']?.number || 0,
      paymentMethod: page.properties['支払い方法']?.select?.name || '',
      purpose: page.properties['用途']?.title?.[0]?.text?.content || '',
      date: page.properties['日付']?.date?.start || ''
    }))

    return { success: true, expenses }
  } catch (error) {
    console.error('Error getting expenses:', error)
    return { success: false, error, expenses: [] }
  }
}