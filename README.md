# time-liner

## 概要

- 指定の slack チャンネルを別のチャンネルに転送してくれる SlackApp

## 導入

- git clone
- [slack api](https://api.slack.com/apps) から slackApp を作る
- 以下のスコープを OAuth & Permissions より選択
  - bot
    - channels:history
    - channels:read
    - chat:write
    - files:read
    - im:history
    - incoming-webhook
    - users.profile:read
    - users:read
    - users:read:email
    - eam:read
  - user
    - chat:write
    - links:read
    - links:write
    - files:write
- `$cp .env.example .env`
  - .env 項目
    - `SLACK_WORKSPACE`に slack のワークスペース名
    - `CHANNEL_NAME`に転送先の slack チャンネル名
    - `PORT`にリスニングしたい番号（入れなければデフォルトでは _3000_）
    - Basic information
      - `Signing Secret`を`SLACK_SIGNING_SECRET`
    - OAuth & Permission
      - `OAuth Access Token`を`SLACK_OAUTH_TOKEN`
      - `Bot User OAuth Access Token`を`SLACK_SIGNING_SECRET`
- ローカルで以下を実施
  - `$ yarn` | `$ npm i`
  - `ngrok`を Homebrew でインストール（入ってない方のみ）
  - `$ ngrok http ${n}` でポート番号指定して ngrok を立ち上げる
  - CLI に出てきた URL を slackApp の InteractiveComponents に貼り付け
- slackApp で以下を設定
  - Interactive Components
    - RequestURL に ngrok の URL を貼り付け
  - Event Subscriptions
    - RequestURL に `${ngrokのURL}/slack/events` を貼り付け
    - Subscribe to bot events に 以下を選択し追加
      - message.channels
      - message.im
- `ngrok`はセッションが切れたら都度再起動し slackApp の RequestURL を新規 URL で更新

## デバッグ

### [VSCode]

`.vscode/launch.json` を作成し、以下の内容を貼り付け

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Bolt",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}/lib",
      "protocol": "inspector",
      "outFiles": ["${workspaceFolder}/lib/**/*.js"],
      "trace": true,
      "restart": true
    }
  ]
}
```

任意の位置にブレークポイントを設定後、デバッガから`Attach to Bolt`を実行。  
`$npm run dev:watch`で本アプリをデバッグ実行。

## ビルド

## 注意
