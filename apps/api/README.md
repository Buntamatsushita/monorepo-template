# api

FastAPI アプリ（`src/api`）。依存は [uv](https://docs.astral.sh/uv/) で管理します。

```bash
cd apps/api
uv sync --all-groups
uv run uvicorn api.main:app --reload --host 0.0.0.0
```

`DATABASE_URL`（例: `postgresql+asyncpg://app:app@localhost:5432/app`）を環境変数で渡してください。
