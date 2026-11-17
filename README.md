# Rizi Backend API

Rizi Backend API 是 Rizi 電商網站的後端服務，提供會員註冊與登入、管理員登入、商品管理及會員購物車等功能。

## 選用技術

- Node.js 26.x
- Express 5
- JavaScript（CommonJS）
- TypeORM
- PostgreSQL 17
- pnpm
- JWT、bcrypt
- Helmet、CORS、express-rate-limit
- Node.js Test Runner、ESLint

專案採分層架構，依功能拆分為 Route、Controller、Service、Repository、Schema 與 Entity。

## 本機啟動

### 前置需求

- Node.js 24.x
- pnpm 10.x
- Docker Desktop，或可連線的 PostgreSQL

### 1. 安裝依賴

```bash
pnpm install
```

### 2. 建立環境變數

.env 內容在 mail 中提供。

### 3. 啟動 PostgreSQL

使用專案提供的 Docker Compose：

```bash
docker compose up -d postgres
```

### 4. 建立資料表與種子資料

```bash
pnpm migration:run
pnpm seed
```

`pnpm seed` 會建立系統基礎資料、商品資料，以及 `.env` 中 `ADMIN_EMAIL`、`ADMIN_PASSWORD` 所指定的管理員帳號。

### 5. 啟動開發伺服器

```bash
pnpm dev
```

預設服務位址為 `http://localhost:5050`，可透過以下端點確認 API 與資料庫是否正常：

```text
GET http://localhost:5050/healthcheck
```

回傳 `OK` 代表服務與資料庫連線正常。

## API 測試

Postman Collection 位於 [`docs/Rizi Backend API.postman_collection.json`](docs/Rizi%20Backend%20API.postman_collection.json)，匯入 Postman 後即可測試現有 API。登入成功後，Collection 會自動保存會員或管理員的 JWT，供後續授權請求使用。
