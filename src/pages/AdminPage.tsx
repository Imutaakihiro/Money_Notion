import { useState } from 'react'
import { useNotion } from '../contexts/NotionContext'
import { Settings, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

const AdminPage = () => {
  const { config, setConfig, isConnected } = useNotion()
  const [formData, setFormData] = useState({
    apiKey: config?.apiKey || '',
    databaseId: config?.databaseId || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.apiKey || !formData.databaseId) {
      setMessage({ type: 'error', text: 'APIキーとデータベースIDの両方を入力してください' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Test the connection
      const testResponse = await fetch('/api/notion/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (testResponse.ok) {
        setConfig(formData)
        setMessage({ type: 'success', text: 'Notionに正常に接続されました！' })
      } else {
        setMessage({ type: 'error', text: '接続に失敗しました。APIキーとデータベースIDを確認してください。' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '接続テストに失敗しました。' })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-4">
      <div className="card animate-fade-in">
        <div className="text-center mb-6">
          <Settings className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">Notion接続設定</h2>
          <p className="text-gray-600">NotionのAPIキーとデータベースIDを設定してください</p>
        </div>

        {isConnected && (
          <div className="mb-6 p-4 bg-success-50 text-success-700 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <span>Notionに接続済みです</span>
          </div>
        )}

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
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Notion APIキー
            </label>
            <input
              type="password"
              id="apiKey"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              className="input-field"
              placeholder="secret_xxxxxxxxxxxxxxxx"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              <a 
                href="https://www.notion.so/my-integrations" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 inline-flex items-center"
              >
                Notion インテグレーションページ <ExternalLink className="h-4 w-4 ml-1" />
              </a>
              で新しいインテグレーションを作成してAPIキーを取得してください。
            </p>
          </div>

          <div>
            <label htmlFor="databaseId" className="block text-sm font-medium text-gray-700 mb-2">
              データベースID
            </label>
            <input
              type="text"
              id="databaseId"
              value={formData.databaseId}
              onChange={(e) => setFormData(prev => ({ ...prev, databaseId: e.target.value }))}
              className="input-field"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              NotionデータベースのURLから取得できます。データベースをインテグレーションに共有することを忘れずに。
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? '接続テスト中...' : '接続設定を保存'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">データベース設定手順</h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">1. Notionでデータベースを作成</h4>
              <p>以下のプロパティを持つデータベースを作成してください：</p>
              <div className="mt-2 space-y-1 font-mono text-xs bg-white p-3 rounded border">
                <div>• <span className="font-semibold">金額</span> (Number)</div>
                <div>• <span className="font-semibold">支払い方法</span> (Select)</div>
                <div>• <span className="font-semibold">用途</span> (Text)</div>
                <div>• <span className="font-semibold">日付</span> (Date)</div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">2. インテグレーションを共有</h4>
              <p>作成したデータベースの右上の「...」→「Add connections」から、作成したインテグレーションを追加してください。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage