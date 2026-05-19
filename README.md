# 人生分岐シミュレーター

3ヶ月後の自分から届いた未来通信をきっかけに、12週間の生活コマンドを選びながら未来を立て直していく静的Webゲームです。

## 概要

- タイトル画面 + 未来通信導入
- 1ターン = 1週間、全12ターンの進行
- 10種の生活コマンド選択
- 8項目ステータス管理
- 条件付きイベント分岐（4種）
- 未来回避率と5段階エンディング分岐
- 関連サービス導線 + 行動レポート導線
- localStorageオートセーブ
- 完全静的構成（外部API、サーバー処理なし）

## ファイル構成

```
.
├── index.html
├── style.css
├── app.js
├── README.md
└── assets/
	├── title-screen.png
	├── future-message.png
	├── main-command-screen.png
	├── event-screen.png
	├── ending-screen.png
	├── player-normal.png
	├── player-tired.png
	├── player-recovered.png
	├── player-determined.png
	├── player-anxious.png
	├── future-bad.png
	└── future-saved.png
```

## ローカル実行

1. このフォルダでHTTPサーバーを起動
2. ブラウザで `http://localhost:8000` を開く

例:

```bash
python3 -m http.server 8000
```

## GitHub Pages 公開

1. GitHubに `jinsei-bunki-simulator` リポジトリを作成
2. `main` ブランチへPush
3. GitHubの Pages 設定で `Deploy from a branch` を選択
4. Branch: `main` / Folder: `/ (root)` を保存
5. 公開URL:

`https://<ユーザー名>.github.io/jinsei-bunki-simulator/`

## 注意

このアプリは娯楽・内省・行動整理を目的としたコンテンツです。医療・法律・金融・転職などの専門助言を提供するものではありません。
