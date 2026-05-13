# はじめての方向けガイド（日本語・丁寧版）

このドキュメントは、**Web 開発や Docker に不慣れな方**でも、手順どおりに進めればローカルでアプリ一式を動かせることを目標に書いています。分からない単語が出てきたら、まずはこのページの「用語をもう少しだけ」まで戻って読み直して構いません。

---

## このガイドでできること

最後まで進むと、次の状態になります。

- パソコン上で **データベース（PostgreSQL）**、**API（FastAPI）**、**画面（React）** が同時に動いている。
- ブラウザで画面を開き、API の状態（`/health`）が画面に表示される。
- ソースコードを保存すると、**ホットリロード**（保存に合わせて自動で反映）が効く。

---

## 読み方のおすすめ

1. 「そもそもこのリポジトリは何か」と「Docker をざっくり理解する」を読む。  
2. 「事前に用意するもの」で自分の PC に足りるものを確認する。  
3. 「最初の起動手順」を **上から順に** 実行する（飛ばさない）。  
4. うまくいったら「ホットリロードを試す」と「日常で使うコマンド」を読む。  
5. つまずいたら「よくあるつまずきと対処」を開く。

---

## そもそもこのリポジトリは何か

このリポジトリは **モノレポ**（モノレポジトリ）という形のひな形です。ひとつのフォルダ（Git のリポジトリ）の中に、複数のアプリをまとめて置くやり方です。

| フォルダ | 役割（ざっくり） |
|----------|------------------|
| `apps/web` | ユーザーがブラウザで見る **画面**（React + TypeScript） |
| `apps/api` | 画面が呼び出す **API**（FastAPI + Python） |
| （Compose が用意する）PostgreSQL | データを保存する **データベース** |

通常、画面・API・DB はそれぞれ別のプロセスとして動きます。このテンプレートでは **Docker Compose** を使って、それらをまとめて起動できるようにしてあります。

---

## Docker と Compose をざっくり理解する

### コンテナとは

**コンテナ**は、「アプリが動くためのミニ環境」をパソコン上に作ったものだと考えてください。仮想マシン（VM）に似ていますが、より軽量で、開発の再現性を上げやすい仕組みです。

### イメージとは

**イメージ**は、コンテナの設計図パックです。「Node が入っている」「Python が入っている」などがあらかじめ決まっています。`docker compose up --build` の **build** は、この設計図を自分の PC 向けにビルド（組み立て）する作業です。

### Compose とは

**Docker Compose** は、`compose.yaml` に書かれた複数のコンテナを、**一括で**起動・停止するための仕組みです。このリポジトリでは次の 3 つがサービスとして定義されています。

| サービス名 | 役割 |
|------------|------|
| `postgres` | PostgreSQL（データベース） |
| `api` | FastAPI（API サーバー） |
| `web` | Vite + React（フロントの開発サーバー） |

---

## 事前に用意するもの

### 必須

- **Docker Desktop**（Windows / Mac 向けの公式アプリ）  
  - ダウンロード: [Docker Desktop](https://www.docker.com/products/docker-desktop/)  
  - インストール後、**一度起動しておく**必要があります。メニューバー（Mac）やタスクバー（Windows）にクジラのアイコンがあり、**Running** になっている状態が目安です。

### あるとよいもの

- **Git**（リポジトリを clone したり更新したりするため）  
  - [Git の公式サイト](https://git-scm.com/)

### このテンプレートの特徴（安心してほしい点）

- **Node.js や Python を自分の PC に入れなくても**、Docker さえ動けば開発を始められます。  
- エディタ（VS Code、Cursor など）は好きなものを使って構いません。

---

## 用語をもう少しだけ

| 用語 | 意味 |
|------|------|
| **リポジトリのルート** | `compose.yaml` や `README.md` がある、いちばん上のフォルダ。ここで `docker compose` を実行します。 |
| **Compose** | `compose.yaml` に従って複数コンテナをまとめて扱う仕組み。 |
| **サービス** | Compose が管理する「ひとつのコンテナ役」。このリポジトリでは `postgres` / `api` / `web`。 |
| **ボリューム** | コンテナを消しても残るデータ置き場。DB の中身や、フロントの `node_modules` 用に使っています。 |
| **bind mount（バインドマウント）** | あなたの PC 上のフォルダ（例: `apps/web`）を、コンテナの中のパスにそのままつなぐこと。**保存したコードがすぐコンテナ側にも見える**ので、ホットリロードに向いています。 |
| **`DATABASE_URL`** | API が PostgreSQL に接続するときに使う **接続文字列**（ユーザー名・パスワード・ホスト名などが入った 1 本の文字列）。 |
| **環境変数** | OS やアプリが読み取る「設定の名前と値」。`.env` に書くと Compose やアプリに渡されます。 |
| **ポート** | パソコンの「窓口番号」のようなもの。例: ブラウザで `http://localhost:5173` と書くときの **5173** がポート番号です。 |
| **localhost** | いま操作している **自分自身の PC** を指すホスト名です。 |

---

## 最初の起動手順（ここから実際に操作）

### 0. Docker Desktop を起動する

メニューバー／タスクバーで Docker が動いていることを確認してください。止まっていると、これ以降のコマンドが失敗します。

### 1. ターミナルを開き、リポジトリのルートに移動する

**ルート**は、`compose.yaml` があるフォルダです。

例（パスは自分の環境に合わせてください）。

```bash
cd /path/to/monorepo-template
```

`ls`（Mac / Linux）または `dir`（Windows のコマンドプロンプト）で、`compose.yaml` が見えることを確認すると安心です。

### 2. `.env` ファイルを用意する

このリポジトリには **ひな形**として `.env.example` が入っています。これをコピーして **`.env`** という名前のファイルを作ります。

**Mac / Linux（bash / zsh）の例:**

```bash
cp .env.example .env
```

**Windows（PowerShell）の例:**

```powershell
Copy-Item .env.example .env
```

#### `.env` は何のためか

- パスワードやポート番号などを **自分の PC 用に** 置いておくファイルです。  
- **Git にコミットしないでください**（他人にパスワードが漏れないようにするため）。このリポジトリの `.gitignore` には `.env` が含まれています。

初めての起動では、**コピーだけで中身を変えなくても**動くようになっています。

### 3. Compose でコンテナを起動する

ルートで次を実行します。

```bash
docker compose up --build
```

#### このコマンドの意味（短く）

| 部分 | 意味 |
|------|------|
| `docker compose` | Compose を使う、という宣言。 |
| `up` | 定義どおりにコンテナを起動する。 |
| `--build` | 起動前にイメージを **ビルドし直す**（初回や Dockerfile を変えたときに必要）。 |

#### 起動中に表示されるログについて

- 画面にログが流れ続けるのは **正常**です。  
- 初回は **数分**かかることがあります（イメージのダウンロードや `npm ci`、`uv sync` など）。  
- **エラーっぽい英語**が出た場合は、後述の「よくあるつまずき」を見てください。

#### 止め方（前景で起動している場合）

ターミナルで **Ctrl + C**（Mac は **control + C** の場合もあります）を押すと、コンテナが止まります。

#### バックグラウンドで起動したい場合（おまけ）

ログを別ウィンドウに残したいときは **`-d`**（デタッチ）を付けます。

```bash
docker compose up --build -d
```

止めるときはルートで次を実行します。

```bash
docker compose down
```

### 4. ブラウザで動作確認する

次の URL を **順に** 試してみてください。

1. **フロント（画面）**  
   [http://localhost:5173](http://localhost:5173)  
   - API の `/health` の内容が表示されれば成功に近いです。

2. **API のドキュメント（Swagger UI）**  
   [http://localhost:8000/docs](http://localhost:8000/docs)  
   - ブラウザ上で API を試せます。初心者の方は「API が生きている印」として見てください。

3. **ヘルスチェック（JSON）**  
   [http://localhost:8000/health](http://localhost:8000/health)  
   - データベースに繋がっていれば、`database` が `"up"` になる想定です。

#### うまくいっているときの目安

- `/health` の JSON で `"status": "ok"` かつ `"database": "up"` が理想です。  
- もし `"database": "down"` のときは、Postgres の起動待ちや接続文字列の不一致が疑われます。しばらく待って再読み込みするか、ログを確認してください。

---

## フォルダの地図（どこを触ればいいか）

日常いちばん触るのは次の場所です。

| 場所 | 触る内容の例 |
|------|----------------|
| `apps/web/src/` | 画面の見た目や動き（React） |
| `apps/api/src/api/` | API のルートや DB 周り（Python） |
| `compose.yaml` | サービス構成やポート（慣れるまで触らなくてよい） |
| `.env` | 自分の PC 用の設定（**秘密情報はここにだけ**） |

共有ライブラリを将来置く場所として `packages/` があります。今は空でも問題ありません。

---

## 依存パッケージの追加（ライブラリを足す）

「画面用」「API 用」で **別々の場所**に追加します。混同しないよう、ディレクトリを必ず切り替えてください。

### 全体の流れ（どちらのスタックでも共通）

1. 正しいフォルダに移動する（`apps/web` か `apps/api`）。  
2. 公式ドキュメントに従い、**インストール用コマンド**を実行する。  
3. 自動で更新された **ロックファイル**（後述）と `package.json` / `pyproject.toml` を **まとめて Git にコミット**する。  
4. チームや CI はロックファイルで **同じバージョン**を再現するため、**ロックをコミットし忘れない**ことが重要です。

---

### フロント（`apps/web`・npm）

作業ディレクトリは **`apps/web`** です。

#### 本番コードからも使うライブラリ（例: UI ユーティリティ）

```bash
cd apps/web
npm install パッケージ名
```

例（実在するパッケージ名に読み替えてください）。

```bash
npm install date-fns
```

#### 開発中だけ必要なライブラリ（テスト、型定義など）

```bash
cd apps/web
npm install -D パッケージ名
```

#### 変更されるファイル

| ファイル | 説明 |
|----------|------|
| `package.json` | 依存一覧（人間が読むための宣言）。 |
| `package-lock.json` | **実際に入るバージョン**が書かれたロック。CI の `npm ci` はこれを読みます。 |

**どちらもコミットしてください。** `package-lock.json` だけ欠けると、他の環境や CI で再現できません。

#### Docker だけで開発している場合（ホストに Node が無いとき）

リポジトリのルートから、一時的に `web` サービス用コンテナでコマンドを実行できます（`apps/web` はホストと共有されているので、`package.json` の変更はそのまま残ります）。

```bash
docker compose run --rm web npm install パッケージ名
```

開発用パッケージなら `-D` を付けます。

```bash
docker compose run --rm web npm install -D パッケージ名
```

あとは通常どおり `docker compose up` で起動し直せば、次回の `npm ci` で依存が揃います。

---

### API（`apps/api`・uv）

作業ディレクトリは **`apps/api`** です。このプロジェクトでは **[uv](https://docs.astral.sh/uv/)** が `pyproject.toml` と `uv.lock` を管理します。

#### 本番コードからも使うライブラリ

```bash
cd apps/api
uv add パッケージ名
```

例。

```bash
uv add httpx
```

#### 開発・品質チェック用だけ使うライブラリ（このリポジトリでは `dev` グループ）

```bash
cd apps/api
uv add --dev パッケージ名
```

`--dev` は `pyproject.toml` の `[dependency-groups] dev` に追加されます（CI では `uv sync --frozen --all-groups` で **dev も含めて**揃えています）。

#### 変更されるファイル

| ファイル | 説明 |
|----------|------|
| `pyproject.toml` | 依存の宣言とバージョン制約。 |
| `uv.lock` | 解決済みの **正確なバージョン**のロック。CI の `uv sync --frozen` はこれが必須です。 |

**どちらもコミットしてください。** `uv.lock` を忘れると、CI や他メンバーの環境で **同じ組み合わせ**を再現できません。

#### バージョンを付けて足したいとき（例）

```bash
uv add "fastapi>=0.115"
```

#### Docker だけで開発している場合（ホストに uv が無いとき）

ルートから次のように実行できます。

```bash
docker compose run --rm api uv add パッケージ名
```

開発用グループへ入れる例です。

```bash
docker compose run --rm api uv add --dev パッケージ名
```

---

### 共有ライブラリ（`packages/`）について

複数アプリから共通のコードを import したくなったら `packages/` に置く、という **置き場**だけ先にあります。  
Vite や Python のパスをどう通すかはプロジェクト方針次第なので、**最初のうちは `apps/web` / `apps/api` に直接追加する**ので問題ありません。

---

## `.env` の主な項目（読み取り用の説明）

`.env.example` に同じ項目が並んでいます。意味だけ押さえておけば十分です。

| 変数名 | 何のためか |
|--------|------------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | PostgreSQL のユーザー名・パスワード・データベース名。 |
| `POSTGRES_PORT` | あなたの PC から Postgres にアクセスするときのポート（デフォルト 5432）。 |
| `API_PORT` / `WEB_PORT` | ブラウザから API / フロントにアクセスするときのポート。 |
| `VITE_API_URL` | **ブラウザ**が API を呼ぶときのベース URL。普段は `http://localhost:8000` のままでよいです。 |
| `CORS_ORIGINS` | ブラウザからのリクエストを許可する **画面の URL の一覧**（カンマ区切り）。 |
| `VITE_USE_POLLING` | Mac などでファイル変更が反映されにくいときに `1` にする Vite 用の設定。 |

**補足（とても大切）:** ブラウザは「あなたの PC」上で動きます。そのため API の URL は **`http://localhost:8000`** のように **localhost** を使います。コンテナの中ではサービス名 `api` で呼び分けますが、**ブラウザの JavaScript から `http://api:8000` のように書いても動きません**（名前解決できないため）。

---

## ホットリロードを試す（動いたあとの確認）

ホットリロードは、「コードを保存したら、手動でサーバーを止めずに反映される」状態のことです。

### フロント（`web`）

1. エディタで `apps/web/src/App.tsx` を開く。  
2. 見出しの文言など、**はっきり分かる文字**を少し変える。  
3. ファイルを **保存**する。  
4. ブラウザに戻り、数秒以内に表示が変わるか確認する。

変われば、Vite のホットリロードが効いています。

### API（`api`）

1. エディタで `apps/api/src/api/main.py` を開く。  
2. 例として、`FastAPI(title="api", ...)` の `title` を別の短い文字列に変える。  
3. 保存する。  
4. ターミナルのログに **再起動っぽい行** が出るか、`/docs` を再読み込みして反映を確認する。

`--reload` が有効なので、保存に反応してプロセスが立ち直ります。

---

## リンター・フォーマッターの仕組み

「リンター」はコードの **問題やバグっぽい書き方**を指摘するツール、「フォーマッター」はインデントや空白などの **見た目を統一**するツールです。このリポジトリでは両方が入っています。

### フロント（`apps/web`）のツール

| ツール | 役割 | 設定ファイル |
|--------|------|-------------|
| **ESLint** | リンター（バグの検出、React のルール） | `apps/web/eslint.config.js` |
| **Prettier** | フォーマッター（空白・改行・セミコロンの統一） | `apps/web/.prettierrc.json` |
| **TypeScript** | 型チェック（ビルド時にも走る） | `apps/web/tsconfig.*.json` |

#### ターミナルからのコマンド（`apps/web` で実行）

| やりたいこと | コマンド | 説明 |
|--------------|---------|------|
| 問題を検出する | `npm run lint` | ESLint がコードを検査し、問題があれば表示します。 |
| 自動修正する | `npm run lint:fix` | ESLint が自動で直せるものは直します。 |
| フォーマットを揃える | `npm run format` | Prettier がファイル全体の書式を整えます。 |
| フォーマットの確認だけ | `npm run format:check` | 直すべき箇所があるか表示だけします（CI 向き）。 |
| ビルド（型チェック含む） | `npm run build` | TypeScript の型チェック → Vite のビルド。 |

#### Docker だけで開発しているとき

```bash
docker compose run --rm web npm run lint
docker compose run --rm web npm run format
```

### API（`apps/api`）のツール

| ツール | 役割 | 設定ファイル |
|--------|------|-------------|
| **Ruff** | リンター **兼** フォーマッター（Python 用、非常に高速） | `apps/api/pyproject.toml` の `[tool.ruff]` セクション |

Ruff は 1 つのツールで **リント + フォーマット** の両方をこなします。Python の世界では flake8 や black が有名ですが、Ruff はそれらの代替として使えるオールインワンツールです。

#### ターミナルからのコマンド（`apps/api` で実行）

| やりたいこと | コマンド | 説明 |
|--------------|---------|------|
| 問題を検出する | `uv run ruff check src` | Ruff がコードを検査し、問題があれば表示します。 |
| 自動修正する | `uv run ruff check --fix src` | 安全に直せるものだけ直します。 |
| フォーマットを揃える | `uv run ruff format src` | インデント・空白・引用符などを統一します。 |
| フォーマットの確認だけ | `uv run ruff format --check src` | 直すべき箇所があるか表示だけします。 |

#### Docker だけで開発しているとき

```bash
docker compose run --rm api uv run ruff check src
docker compose run --rm api uv run ruff format src
```

### VS Code / Cursor なら「保存するだけ」

このリポジトリには `.vscode/settings.json` が含まれていて、**ファイルを保存するだけで**次のことが自動で起きます。

- **TypeScript / React ファイル** → Prettier がフォーマット + ESLint が修正可能な問題を自動修正
- **Python ファイル** → Ruff がフォーマット + import 整理 + 自動修正

つまり、**保存 → 勝手にきれいになる** のが基本の流れです。手動でコマンドを打つのは、CI が失敗したときや一括チェックしたいときだけです。

### 推奨拡張機能について

`.vscode/extensions.json` にこのリポジトリで使う **推奨拡張機能** を定義してあります。VS Code / Cursor でリポジトリを開くと、右下に「推奨拡張機能をインストールしますか？」と通知が出るので、**すべてインストール**するのがおすすめです。

| 拡張機能 | 何をするか |
|----------|-----------|
| **ESLint** (`dbaeumer.vscode-eslint`) | TypeScript / React のリント結果をエディタに赤線で表示 |
| **Prettier** (`esbenp.prettier-vscode`) | TypeScript / CSS / JSON / Markdown のフォーマッター |
| **Ruff** (`charliermarsh.ruff`) | Python のリント + フォーマット（保存時に自動実行） |
| **Python** (`ms-python.python`) | Python の基本サポート（デバッグ、仮想環境の検出など） |
| **Pylance** (`ms-python.vscode-pylance`) | Python の型チェック・補完の強化 |
| **EditorConfig** (`editorconfig.editorconfig`) | `.editorconfig` を読んで改行コードやインデントを合わせる |
| **Docker** (`ms-azuretools.vscode-docker`) | Dockerfile / `compose.yaml` のシンタックスハイライトと補完 |
| **GitLens** (`eamodio.gitlens`) | Git の変更履歴をエディタ上に表示 |
| **GitHub Actions** (`github.vscode-github-actions`) | CI ワークフロー YAML の補完とバリデーション |

### `.editorconfig` について

`.editorconfig` はエディタの種類を問わず **インデント幅**・**改行コード（LF）**・**末尾空白の削除** を統一するファイルです。VS Code / Cursor では上記の拡張機能を入れるだけで効きます。チームで複数のエディタを使う場合にも役立ちます。

---

## 日常で使うコマンド（ルートで実行）

| やりたいこと | コマンド例 |
|--------------|------------|
| 前景で起動（ログが見える） | `docker compose up --build` |
| バックグラウンドで起動 | `docker compose up --build -d` |
| 状態を見る | `docker compose ps` |
| 止める（前景） | ターミナルで Ctrl + C |
| 止める（バックグラウンド起動後） | `docker compose down` |
| ログだけ見る（バックグラウンド時） | `docker compose logs -f web` など |

サービス名（`web` / `api` / `postgres`）は `compose.yaml` の `services:` 以下に書かれた名前と一致します。

---

## よくあるつまずきと対処

### 「Docker に接続できない」などと出る

- Docker Desktop が **起動しているか** を確認してください。  
- 会社 PC などではポリシーで Docker が止められていることがあります。その場合は担当者に相談してください。

### ポートがすでに使われている（`address already in use` など）

別のアプリが同じ番号を使っています。`.env` で次を **空いている番号**に変えてから、もう一度 `docker compose up --build` してください。

- `POSTGRES_PORT`（既定 5432）  
- `API_PORT`（既定 8000）  
- `WEB_PORT`（既定 5173）  

**注意:** Postgres のポートを変えた場合、API 側の接続先は Compose 内ではサービス名 `postgres` の **5432（コンテナ内）** のままなので、通常は API の `DATABASE_URL` をいじる必要はありません（ホスト側の公開ポートだけが変わります）。

### フロントは開けるが API に繋がらない

1. `.env` の `VITE_API_URL` が `http://localhost:8000` になっているか確認する。  
2. `docker compose ps` で `api` が **Up** か確認する。  
3. `VITE_*` は **web コンテナ起動時**に読まれることがあるため、`.env` を変えたら **`docker compose down` してから再度 `up`** が確実です。

### ブラウザの開発者ツールに CORS エラーが出る

API は `CORS_ORIGINS` に書かれた **画面の URL** からだけブラウザ通信を許可します。

- フロントを `http://127.0.0.1:5173` で開いているのに、`.env` に `http://localhost:5173` しか無い、など **微妙に違う**と失敗します。  
- **localhost と 127.0.0.1 は別物**として扱われることがあります。迷ったら両方 `.env` の `CORS_ORIGINS` に書いてください（`.env.example` にも例があります）。

### Mac で保存してもフロントが更新されない

Docker Desktop のファイル共有の影響で、ファイル監視が不安定なことがあります。`.env` に次を足すか変更してから、Compose を再起動してください。

```env
VITE_USE_POLLING=1
```

### データベースをまっさらにしたい

ボリュームごと消すと DB の中身がリセットされます。**開発用**として使ってください。

```bash
docker compose down -v
```

そのあと、再度 `docker compose up --build` します。

### Windows でパスや改行でコケる

- リポジトリは **WSL2 上の Linux ファイルシステム** に置くと、Docker まわりが安定しやすいです。  
- 改行コード（CRLF / LF）でスクリプトが壊れるケースがあるため、エディタは **LF 推奨**にすると安心です。

### パスワードに記号を入れたい

`DATABASE_URL` は URL 形式のため、`@` や `:` などがパスワードに含まれると **解釈が壊れる**ことがあります。初心者のうちは **英数字だけの長めのパスワード**にするとトラブルが減ります。

---

## ローカルで Docker を使わない場合（少し慣れてから）

Docker を使わずにホスト直で動かすには、**Node / Python / PostgreSQL を自分で用意**する必要があります。

- **web:** `cd apps/web` → `npm install` → `npm run dev`  
- **api:** PostgreSQL を別途起動し、`DATABASE_URL` を環境変数で渡したうえで、`cd apps/api` → `uv sync --all-groups` → `uv run uvicorn api.main:app --reload`

詳細は各フォルダの `README` や公式ドキュメントも参照してください。

---

## CI（GitHub Actions）について

GitHub にプッシュすると、`.github/workflows/ci.yml` が次を自動で確認します。

- フロントの **lint** と **ビルド**  
- API の **依存ロックの整合**（`uv sync --frozen`）と **ruff**  
- `compose.yaml` の **文法チェック**

チーム開発では、この CI が緑（成功）になることを目安にレビューすると安心です。

---

## 次のステップ（参考）

このテンプレートには含めていませんが、実務ではよく次のようなものを足していきます。

- 本番向けの **マルチステージ Dockerfile**  
- DB の **マイグレーション**（Alembic など）  
- **認証・認可**（ログイン、トークンなど）

まずはこのリポジトリで **起動・変更・ログ確認** に慣れることをおすすめします。

---

## まだ解決しないとき

次の情報があると、人に聞く／検索するときに便利です。

- OS の種類とバージョン（例: macOS 14、Windows 11）  
- `docker compose ps` の出力  
- `docker compose logs api --tail=100` など、**失敗しそうなサービス**のログ末尾

落ち着いて **ログの最後の方** を読むと、原因のヒントが書かれていることが多いです。
