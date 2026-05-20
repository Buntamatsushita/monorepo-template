# monorepo-template

React（Vite + TypeScript）と FastAPI（uv）、PostgreSQL を **Docker Compose** でまとめたモノレポのひな形です。**Docker Desktop さえ入っていれば**、PC に Node や Python を入れずに起動できます。

## はじめての方へ（重要）

手順・用語・トラブル対処を **できるだけ丁寧に** 書いたガイドがあります。**まずこちらを読んでから**コマンドを実行してください。

**[docs/getting-started-ja.md](docs/getting-started-ja.md)**

## クイックスタート（概要だけ）

1. Docker Desktop を起動する。  
2. リポジトリのルートで `.env.example` を `.env` にコピーする。  
3. `docker compose up --build` を実行する。  
4. ブラウザで [http://localhost](http://localhost)（画面）と [http://localhost/api/docs](http://localhost/api/docs)（API ドキュメント）を開く。

各コマンドの意味や、うまくいかないときの見方は上記の日本語ガイドに任せます。タブレットなど別デバイスから触る手順（LAN・VS Code のポート転送）は [getting-started-ja.md の該当節](docs/getting-started-ja.md#タブレットや別デバイスから触る) を参照してください。

## リポジトリ構成

| パス | 内容 |
|------|------|
| `apps/web` | Vite + React + TypeScript（npm） |
| `apps/api` | FastAPI + uv + SQLAlchemy（asyncpg） |
| `docker/` | 開発用 Dockerfile・nginx 設定 |
| `compose.yaml` | postgres / api / web / nginx |
| `packages/` | 将来の共有ライブラリ用 |
| `docs/getting-started-ja.md` | **初心者向けの詳しい手順書** |

## ローカル開発（Docker なし・上級）

- **web:** `cd apps/web && npm install && npm run dev`  
- **api:** PostgreSQL を別途用意し、`DATABASE_URL` を設定したうえで `cd apps/api && uv sync --all-groups && uv run uvicorn api.main:app --reload`

## CI

GitHub にプッシュすると `.github/workflows/ci.yml` が、web の lint/build、api の `ruff` と `uv sync --frozen`、`compose.yaml` の検証を実行します。
