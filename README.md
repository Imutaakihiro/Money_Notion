# Notion お金管理アプリ

NotionのAPIを活用したシンプルなお金管理アプリです。

## 機能

- **支出記録**: 金額、支払い方法、用途を記録
- **Notion連携**: データをNotionデータベースに自動保存
- **履歴表示**: 記録した支出の履歴を一覧表示
- **レスポンシブデザイン**: スマートフォンとデスクトップに対応

## セットアップ

### 1. Notionの準備

1. [Notion Integrations](https://www.notion.so/my-integrations)でインテグレーションを作成
2. APIキーを取得
3. 以下のプロパティを持つデータベースを作成:
   - **金額** (Number)
   - **支払い方法** (Select)
   - **用途** (Text)
   - **日付** (Date)
4. データベースにインテグレーションを共有

### 2. アプリの設定

1. アプリの「設定」タブを開く
2. NotionのAPIキーとデータベースIDを入力
3. 「接続設定を保存」をクリック

### 3. 使用開始

設定完了後、ホームページから支出の記録を開始できます。

## 技術スタック

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **API**: Notion API
- **Icons**: Lucide React

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## 注意事項

- Notion APIの利用には制限があります
- 大量のデータを扱う場合はレート制限にご注意ください
- APIキーは安全に管理してください