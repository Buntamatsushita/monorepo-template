FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

COPY apps/api/pyproject.toml apps/api/uv.lock ./
RUN uv sync --frozen --all-groups --no-install-project

COPY apps/api/ .

RUN uv sync --frozen --all-groups

EXPOSE 8000

# 開発: ホストの bind mount で上書きされた後も依存を揃えてから起動
CMD ["sh", "-c", "uv sync --frozen --all-groups && uv run uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload"]
