import { useState, useEffect } from 'react'
import { useNotion } from '../contexts/NotionContext'
import { History, Calendar, CreditCard, AlertCircle, RefreshCw } from 'lucide-react'
import type { Expense } from '../contexts/NotionContext'

const HistoryPage = () => {
  const { isConnected, getExpenses } = useNotion()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadExpenses = async () => {
    if (!isConnected) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (err) {
      setError('履歴の取得に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [isConnected])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-4 mt-8">
        <div className="card text-center animate-fade-in">
          <AlertCircle className="h-16 w-16 text-warning-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notion接続が必要です</h2>
          <p className="text-gray-600 mb-6">
            履歴を表示するには、まず設定ページでNotionに接続してください。
          </p>
          <a
            href="/admin"
            className="btn-primary inline-block"
          >
            設定ページへ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-4">
      <div className="card animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <History className="h-8 w-8 text-primary-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">支出履歴</h2>
              <p className="text-gray-600">記録した支出の一覧です</p>
            </div>
          </div>
          <button
            onClick={loadExpenses}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="mb-6 p-4 bg-primary-50 rounded-lg">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">合計支出額</h3>
            <p className="text-2xl font-bold text-primary-700">{formatAmount(totalAmount)}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600">履歴を読み込み中...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">まだ記録がありません</h3>
            <p className="text-gray-600 mb-6">ホームページから最初の支出を記録してみましょう</p>
            <a href="/" className="btn-primary inline-block">支出を記録する</a>
          </div>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div
                key={expense.id || index}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatAmount(expense.amount)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(expense.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <CreditCard className="h-4 w-4" />
                    <span>{expense.paymentMethod}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{expense.purpose}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage