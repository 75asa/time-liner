## 概要
- 指定のslackチャンネルを別のチャンネルに転送してくれるslackApp

## 導入
- git clone
- [slack api](https://api.slack.com/apps)からslackAppを作る
- 以下のスコープをOAuth & Permissionsより選択
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
  - user
    - chat:write
    - links:read
    - links:write
- `cp .env.example .env`
  - .env項目
    - `SLACK_WORKSPACE`にslackのワークスペース名
    - `CHANNEL_NAME`に転送先のslackチャンネル名
    - `PORT`にリスニングしたい番号（入れなければデフォルトでは _3000_ 
    - Basic information
      - `Signing Secret`を`SLACK_SIGNING_SECRET`
    - OAuth & Permission
      - `OAuth Access Token`を`SLACK_OAUTH_TOKEN`
      - `Bot User OAuth Access Token`を`SLACK_SIGNING_SECRET`
- ローカルで以下を実施
  - `$ yarn` | `npm i`
  - `ngrok`をHomebrewでインストール（入ってない方のみ）
  - `$ ngrok http ${n}` でポート番号指定してngrokを立ち上げる
  - CLIに出てきたURLをslackAppの InteractiveComponentsに貼り付け
- slackAppで以下を設定
  - Interactive Components
    - RequestURLにngrokのURLを貼り付け
  - Event Subscriptions
    - RequestURLに `${ngrokのURL}/slack/events` を貼り付け
    - Subscribe to bot eventsに 以下を選択し追加
      - message.channels
      - message.im
- `ngrok`はセッションが切れたら都度再起動しslackAppのRequestURLを新規URLで更新

## ビルド

## 注意


