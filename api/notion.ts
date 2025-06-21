import { Client } from '@notionhq/client'

// Vercelの環境変数からAPIキーとDB IDを取得
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' })
  }

  const { action, payload } = req.body

  switch (action) {
    case 'testConnection':
      try {
        await notion.databases.retrieve({ database_id: DATABASE_ID })
        return res.status(200).json({ success: true })
      } catch (error: any) {
        console.error('Notion connection error:', error)
        return res.status(500).json({ success: false, error: { message: error.message } })
      }

    case 'addExpense':
      try {
        const { amount, paymentMethod, purpose, date } = payload
        await notion.pages.create({
          parent: { database_id: DATABASE_ID },
          properties: {
            '金額': { number: amount },
            '支払い方法': { select: { name: paymentMethod } },
            '用途': { title: [{ text: { content: purpose } }] },
            '日付': { date: { start: date } },
          },
        })
        return res.status(200).json({ success: true })
      } catch (error: any) {
        console.error('Error adding expense:', error)
        return res.status(500).json({ success: false, error: { message: error.message } })
      }

    case 'getExpenses':
      try {
        const response = await notion.databases.query({
          database_id: DATABASE_ID,
          sorts: [{ property: '日付', direction: 'descending' }],
        })
        const expenses = response.results.map((page: any) => ({
          id: page.id,
          amount: page.properties['金額']?.number || 0,
          paymentMethod: page.properties['支払い方法']?.select?.name || '',
          purpose: page.properties['用途']?.title?.[0]?.text?.content || '',
          date: page.properties['日付']?.date?.start || '',
        }))
        return res.status(200).json({ success: true, expenses })
      } catch (error: any) {
        console.error('Error getting expenses:', error)
        return res.status(500).json({ success: false, error: { message: error.message }, expenses: [] })
      }

    default:
      return res.status(400).json({ message: 'Invalid action' })
  }
} 