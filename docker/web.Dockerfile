FROM node:22-bookworm-slim

WORKDIR /app

COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci

COPY apps/web/ .

EXPOSE 5173

# 開発: bind mount 後に node_modules 用ボリュームへ依存を入れ直してから起動
CMD ["sh", "-c", "npm ci && npm run dev -- --host 0.0.0.0 --port 5173"]
