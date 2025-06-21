import React, { useState } from 'react'
import { useNotion } from '../contexts/NotionContext'
import { PlusCircle, AlertCircle, CheckCircle, CreditCard, Banknote, Smartphone, RefreshCw } from 'lucide-react'
import { testConnection } from '../api/notion'

const HomePage = () => {
  const { isConnected, addExpense } = useNotion()
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    purpose: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const paymentMethods = [
    { value: '現金', label: '現金', icon: Banknote },
    { value: 'クレジットカード', label: 'クレジットカード', icon: CreditCard },
    { value: 'デビットカード', label: 'デビットカード', icon: CreditCard },
    { value: 'PayPay', label: 'PayPay', icon: Smartphone },
    { value: '楽天Pay', label: '楽天Pay', icon: Smartphone },
    { value: 'その他', label: 'その他', icon: Smartphone },
  ]

  const handleTestConnection = async () => {
    setIsTesting(true)
    setMessage(null)
    
    try {
      const result = await testConnection()
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Notion APIに正常に接続できました！' })
      } else {
        setMessage({ type: 'error', text: `❌ 接続エラー: ${result.error?.message || '不明なエラー'}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ 接続テスト失敗: ${error}` })
    }
    
    setIsTesting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Notionに接続できません。しばらく待ってから再試行してください。' })
      return
    }

    if (!formData.amount || !formData.paymentMethod || !formData.purpose) {
      setMessage({ type: 'error', text: 'すべての項目を入力してください' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const expense = {
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      purpose: formData.purpose,
      date: new Date().toISOString()
    }

    const success = await addExpense(expense)
    
    if (success) {
      setMessage({ type: 'success', text: '支出を記録しました！' })
      setFormData({ amount: '', paymentMethod: '', purpose: '' })
    } else {
      setMessage({ type: 'error', text: '記録に失敗しました。再度お試しください。' })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="max-w-md mx-auto p-4 mt-4">
      <div className="card animate-fade-in">
        <div className="text-center mb-6">
          <PlusCircle className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">支出を記録</h2>
          <p className="text-gray-600">金額、支払い方法、用途を入力してください</p>
          
          {/* 接続状態とテストボタン */}
          <div className="mt-4 space-y-2">
            <div className={`p-2 rounded-lg border ${
              isConnected 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }`}>
              <p className="text-sm">
                {isConnected ? '✅ Notion接続済み' : '⏳ Notionに接続中...'}
              </p>
            </div>
            
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                isTesting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              {isTesting ? (
                <>
                  <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
                  テスト中...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  API接続テスト
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center space-x-2 animate-slide-up ${
            message.type === 'success' 
              ? 'bg-success-50 text-success-700 border border-success-200' 
              : 'bg-error-50 text-error-700 border border-error-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              金額 (円)
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="input-field text-lg"
              placeholder="例: 1500"
              min="0"
              step="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              支払い方法
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    formData.paymentMethod === value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              用途
            </label>
            <input
              type="text"
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="input-field"
              placeholder="例: 昼食、交通費、書籍代"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '記録中...' : '支出を記録する'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default HomePage