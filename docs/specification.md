# 各イベントタイプまとめ

## Common（共通処理）

### EMOJI（絵文字）

- 内容
  - オリジナルに分報に絵文字が投稿されたら、紐付けされた投稿にも絵文字も登録する
- 必要なもの
  - リアクションが*追加された* オリジナルのチャンネル
    - :emoji:
    - ~~user~~
    - channel
    - ts
  - リアクションを*反映する*チャンネル
    - ↑ で取得した channel, ts で紐付けられた投稿の
      - channel
      - ts
  - 処理
    - [reactions.add](https://api.slack.com/methods/reactions.add)
      - 絵文字は bot が押したことにしかできない
        - ユーザが押したことにはできない
    - advanced
      - 誰がどのスタンプをいつ押したのかが、仕様的に厳しいので Home で誰が押したかを記録するのでもいいのかも
      - DM ではなくあくまで通知としたい
        - e.g. Slack default Mnetions & reactions

## User's Post（各個人分報のこと）

### EDIT（編集・更新）

- 内容
  - 個人分報が更新されたら、紐付けされた TL 分報の内容も更新する
- 必要なもの
  - 個人分報
    - edited event
      - `subtype: message_changed` になるのでそこで検知
      ```
      2020-10-18T02:37:40.483127+00:00 app[web.1]: {
      2020-10-18T02:37:40.483127+00:00 app[web.1]: message: {
      2020-10-18T02:37:40.483128+00:00 app[web.1]: type: 'message',
      2020-10-18T02:37:40.483128+00:00 app[web.1]: subtype: 'message_changed',
      2020-10-18T02:37:40.483128+00:00 app[web.1]: hidden: true,
      2020-10-18T02:37:40.483128+00:00 app[web.1]: message: {
      2020-10-18T02:37:40.483129+00:00 app[web.1]: client_msg_id: '0766abad-81f6-4a0f-86f7-759304e29f10',
      2020-10-18T02:37:40.483129+00:00 app[web.1]: type: 'message',
      2020-10-18T02:37:40.483130+00:00 app[web.1]: text: 'piyo\nあああああああああああああ',
      2020-10-18T02:37:40.483130+00:00 app[web.1]: user: 'UJDHDKKRR',
      2020-10-18T02:37:40.483131+00:00 app[web.1]: team: 'TJR10LG0Y',
      2020-10-18T02:37:40.483131+00:00 app[web.1]: edited: [Object],
      2020-10-18T02:37:40.483131+00:00 app[web.1]: blocks: [Array],
      2020-10-18T02:37:40.483131+00:00 app[web.1]: ts: '1602988631.000600',
      2020-10-18T02:37:40.483132+00:00 app[web.1]: source_team: 'TJR10LG0Y',
      2020-10-18T02:37:40.483132+00:00 app[web.1]: user_team: 'TJR10LG0Y'
      2020-10-18T02:37:40.483132+00:00 app[web.1]: },
      ```
  - TL 分報
    - ts
      - 個人分報の `event_ts` が同じ値になるので、それをキーに TL 投稿を探す（DB）
      ```
      2020-10-18T02:37:21.738404+00:00 app[web.1]: {
      2020-10-18T02:37:21.738406+00:00 app[web.1]: message: {
      2020-10-18T02:37:21.738440+00:00 app[web.1]: client_msg_id: '0766abad-81f6-4a0f-86f7-759304e29f10',
      2020-10-18T02:37:21.738441+00:00 app[web.1]: type: 'message',
      2020-10-18T02:37:21.738441+00:00 app[web.1]: text: 'piyo',
      2020-10-18T02:37:21.738441+00:00 app[web.1]: user: 'UJDHDKKRR',
      2020-10-18T02:37:21.738442+00:00 app[web.1]: ts: '1602988631.000600',
      2020-10-18T02:37:21.738442+00:00 app[web.1]: team: 'TJR10LG0Y',
      2020-10-18T02:37:21.738442+00:00 app[web.1]: blocks: [ [Object] ],
      2020-10-18T02:37:21.738442+00:00 app[web.1]: channel: 'CTDKZ45V1',
      2020-10-18T02:37:21.738443+00:00 app[web.1]: event_ts: '1602988631.000600',
      2020-10-18T02:37:21.738443+00:00 app[web.1]: channel_type: 'channel'
      2020-10-18T02:37:21.738443+00:00 app[web.1]: }
      2020-10-18T02:37:21.738444+00:00 app[web.1]: }
      ```
  - 処理
    - [chat.update](https://api.slack.com/methods/chat.update) で更新
      - TL の投稿は blocks の中の `section.text` を更新する

### DELETE（削除）

- 内容
  - 個人分報が*削除*されたら、紐付けされた TL 分報の内容も*削除*する
- 必要なもの
  - 個人分報
    - deleted event
      - `subtype: message_deleted` になるのでそこで検知
      ```
      2020-10-18T02:44:01.048813+00:00 app[web.1]: {
      2020-10-18T02:44:01.048813+00:00 app[web.1]: message: {
      2020-10-18T02:44:01.048814+00:00 app[web.1]: type: 'message',
      2020-10-18T02:44:01.048814+00:00 app[web.1]: subtype: 'message_deleted',
      2020-10-18T02:44:01.048815+00:00 app[web.1]: hidden: true,
      2020-10-18T02:44:01.048815+00:00 app[web.1]: deleted_ts: '1602988631.000600',
      2020-10-18T02:44:01.048815+00:00 app[web.1]: channel: 'CTDKZ45V1',
      2020-10-18T02:44:01.048816+00:00 app[web.1]: previous_message: {
      2020-10-18T02:44:01.048816+00:00 app[web.1]: client_msg_id: '0766abad-81f6-4a0f-86f7-759304e29f10',
      2020-10-18T02:44:01.048817+00:00 app[web.1]: type: 'message',
      2020-10-18T02:44:01.048817+00:00 app[web.1]: text: 'piyo\nあああああああああああああ',
      2020-10-18T02:44:01.048817+00:00 app[web.1]: user: 'UJDHDKKRR',
      2020-10-18T02:44:01.048818+00:00 app[web.1]: ts: '1602988631.000600',
      2020-10-18T02:44:01.048818+00:00 app[web.1]: team: 'TJR10LG0Y',
      2020-10-18T02:44:01.048818+00:00 app[web.1]: edited: [Object],
      2020-10-18T02:44:01.048818+00:00 app[web.1]: blocks: [Array]
      2020-10-18T02:44:01.048819+00:00 app[web.1]: },
      2020-10-18T02:44:01.048819+00:00 app[web.1]: event_ts: '1602989040.000800',
      2020-10-18T02:44:01.048819+00:00 app[web.1]: ts: '1602989040.000800',
      2020-10-18T02:44:01.048819+00:00 app[web.1]: channel_type: 'channel'
      2020-10-18T02:44:01.048819+00:00 app[web.1]: }
      2020-10-18T02:44:01.048820+00:00 app[web.1]: }
      ```
  - TL 分報
    - ts
      - 個人分報の `deleted_ts` が同じ値になるので、それをキーに TL 投稿を探す（DB）
  - 処理
    - [chat.delete](https://api.slack.com/methods/chat.delete)

### THREAD（スレッド）

- 内容
  - 個人分報にスレッドメッセージが投稿されたら、紐付けされた親投稿の TL 分報の blocks を更新する
- 必要なもの
  - 個人分報
    - payload[user]:
    - Users
      - userIcon
      - userName
      - userRealName
  - TL 分報
    - ts
      - 個人分報の payload[events_ts] が同じ値になるので、それをキーに TL 投稿を探す（DB）
  - 処理
    - [chat.update](https://api.slack.com/methods/chat.update) で更新
      - TL の投稿は blocks の中の `context の text and image` を追加する

## TL's Post（TL 分報）

### THREAD（スレッド）

- 内容
  - TL 分報にスレッドメッセージが投稿されたら、紐付けされた親投稿の投稿者に Home タブで通知をする
    - DM で元投稿の URL を送る？
    - Home で通知するのでもいいのかも
- 必要なもの
  - TL 分報
    - payload[user]:
    - ts
      - 個人分報の payload[events_ts] が同じ値になるので、それをキーに個人投稿を探す（DB）
  - 個人分報
    - payload[user]:
  - 処理
    - 個人分報の user に [chat.postMessage](https://api.slack.com/methods/chat.postMessage)
      - _im.list_ が必要っぽい
      - channel に user を指定する感じ
      - Home Tab 使うなら block kit を作成
