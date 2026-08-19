# AIケース面接シミュレーター

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

ケース問題の生成、追加情報の質問、最終回答の作成、フィードバックまでをAI面接官と練習できるNext.jsアプリケーションです。

## 概要

曖昧さのあるケース面接を、再現可能な練習ループへ変換するプロジェクトです。選択したカテゴリーからAIが問題を生成し、ユーザーが確認質問をしている間は面接官として回答します。最後に、問題理解、論理、構造、得られた情報の活用を基準として回答を評価します。

本ツールは面接練習用であり、正式な採用評価ではありません。

## 基本フロー

1. ケースカテゴリーを選択します。
2. 新しいケース問題を生成します。
3. AI面接官へ追加情報を質問します。
4. 構造化した最終回答を作成します。
5. スコア、強み、改善点、模範回答のポイントを受け取ります。

## 対応カテゴリー

- 市場規模推定
- 収益性
- 戦略
- ブレインストーミング
- その他のビジネスケース

## 主な機能

- AIによるケース問題生成。
- 会話履歴を使った複数回の確認質問。
- 最終回答の構造化評価。
- 総合スコアと要約。
- 強みと改善提案。
- 模範回答のポイント。
- レスポンシブな単一画面UI。
- サーバー側OpenAI APIアクセス。

## 技術スタック

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Next.js Route Handlers
- OpenAI API（`gpt-4o-mini`）
- ESLint、Turbopack

## アーキテクチャ

```text
Browser
  → Next.js page
  → /api/case-question | /api/ask-question | /api/evaluate
  → OpenAI API
  → structured JSON response
  → practice UI
```

OpenAI APIキーはサーバー側Route Handlerからのみ読み込みます。

## APIルート

### `POST /api/case-question`

選択カテゴリーのケースを生成します。

```json
{
  "category": "market-sizing"
}
```

### `POST /api/ask-question`

面接官の役割を維持しながら確認質問へ回答します。

```json
{
  "caseQuestion": "Case prompt",
  "conversationHistory": [],
  "userQuestion": "What is the current revenue?"
}
```

### `POST /api/evaluate`

ケースと会話履歴を含めて最終回答を評価します。

```json
{
  "question": "Case prompt",
  "userAnswer": "Structured response",
  "conversationHistory": []
}
```

## ローカル実行

```bash
git clone https://github.com/zxcc9867/CaseStudy.git
cd CaseStudy
npm install
```

`.env.example`を`.env`へコピーし、次を設定します。

```env
OPENAI_API_KEY=your_openai_api_key
```

開発サーバーを起動します。

```bash
npm run dev
```

`http://localhost:3000`を開きます。

## 検証

```bash
npm run lint
npm run build
npm run start
```

## モデル設定

現在は`gpt-4o-mini`を利用し、処理ごとにtemperatureを分けています。

- 問題生成: `0.8`
- 面接官回答: `0.7`
- 評価: `0.4`

生成では多様性を、評価では一貫性を優先する設定です。

## デプロイ

通常のNext.jsプロジェクトとしてVercelへデプロイできます。

1. GitHubリポジトリをimportします。
2. Vercelの設定に`OPENAI_API_KEY`を登録します。
3. デプロイ後、3つのAPIルートを確認します。

## セキュリティと制限

- `OPENAI_API_KEY`を`NEXT_PUBLIC_`変数で公開しないでください。
- `.env`をコミットしないでください。
- AIが生成する問題や評価は不完全または不安定な場合があります。
- スコアは練習用フィードバックであり、客観的な採用判断ではありません。
- 公開運用ではrate limiting、使用量監視、不正利用対策が必要です。
- APIコストはモデル利用量と会話長に依存します。

## ライセンスと貢献

学習とケース面接練習を目的として作成しました。バグ報告や具体的な改善提案はGitHub Issuesで受け付けます。
