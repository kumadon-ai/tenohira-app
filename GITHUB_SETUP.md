# てのひら — GitHub セットアップガイド

## リポジトリ情報
- **GitHub URL**: https://github.com/kumadon-ai/tenohira-app
- **アカウント**: kumadon-ai (fumikuma47@gmail.com)

---

## STEP 1 — GitHubでリポジトリを作成

1. https://github.com/new を開く
2. 以下を入力：
   - **Repository name**: `tenohira-app`
   - **Description**: `障害者向け生活支援WEBアプリ`
   - **Visibility**: `Private`
   - `Add a README file` は **チェックしない**
3. **「Create repository」** をクリック

---

## STEP 2 — ローカルにGitをセットアップ

```bash
# Gitの初期設定（初回のみ）
git config --global user.name "kumadon-ai"
git config --global user.email "fumikuma47@gmail.com"

# プロジェクトフォルダを作成
mkdir tenohira-app
cd tenohira-app

# ダウンロードしたファイルをこのフォルダに配置してから：
git init
git add .
git commit -m "feat: 初回リリース — モックモード実装"
```

---

## STEP 3 — GitHubにプッシュ

```bash
git remote add origin https://github.com/kumadon-ai/tenohira-app.git
git branch -M main
git push -u origin main
```

> **認証エラーが出た場合**：
> GitHub → Settings → Developer settings → Personal access tokens → Generate new token
> スコープは `repo` にチェック → 生成されたトークンをパスワード代わりに使用

---

## 日常の作業フロー

### 新機能を追加するとき
```bash
git checkout -b feature/機能名
# ファイルを編集
git add .
git commit -m "feat: ○○を追加"
git push origin feature/機能名
```

### mainにマージ（動作確認後）
```bash
git checkout main
git merge feature/機能名
git push origin main
```

### 変更を保存するだけ
```bash
git add .
git commit -m "mock: ○○のモックデータを更新"
git push
```

---

## コミットメッセージ規則

| プレフィックス | 用途 |
|---|---|
| `feat:` | 新機能追加 |
| `fix:` | バグ修正 |
| `mock:` | モックデータ変更 |
| `ui:` | 見た目の変更 |
| `docs:` | ドキュメント更新 |

---

## ブランチ構成

```
main            ← 安定版（デモ可能な状態）
  └── dev       ← 開発統合
        ├── feature/google-maps-api
        ├── feature/pwa
        └── feature/emergency-sms
```

---

## GitHub Pages で即公開（任意）

1. リポジトリ → Settings → Pages
2. Source: `Deploy from a branch` / Branch: `main`
3. Save → 公開URL：
   ```
   https://kumadon-ai.github.io/tenohira-app/accessibility-support-app.html
   ```
