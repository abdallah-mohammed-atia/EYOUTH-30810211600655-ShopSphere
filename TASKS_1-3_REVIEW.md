# Tasks 1-3 Review — Evidence and Commands

This file contains the concrete commands and short evidence snippets used to verify Tasks 1–3 (Setup, Auth, Products/Shopping).

1) Seed + DB count

Command:

```bash
docker compose exec backend npm run seed
docker compose exec db psql -U postgres -d ecommerce -c "select count(*) from products;"
```

Evidence (excerpt):

Seeding output includes "Created product: running shoes" ... "Seeding complete." and Postgres returned:

```
 count 
-------
    11
(1 row)
```

2) ORM count check

Command run inside backend container:

```bash
node -e "const { Product } = require('./src/models'); Product.count().then(c=>console.log('ORM count:',c))"
```

Evidence:

```
ORM count: 11
```

3) API smoke (products)

Command (host):

```powershell
Invoke-RestMethod 'http://localhost:5000/api/products' | ConvertTo-Json -Depth 4
```

Evidence (truncated): response JSON `items` included multiple products and `pagination.total: 11`.

4) Auth & protected endpoints

Commands (executed inside backend container):

```js
// Login as admin and create product
POST /api/auth/login { email: 'admin@example.com', password: 'Admin123!' }
// received 200 and token
POST /api/products (with admin token) => 201 Created
POST /api/products (with customer token) => 403 Forbidden
```

Evidence (excerpt):

```
create product 201 {"product":{...}}
create product with customer token 403 {"message":"You do not have permission to perform this action."}
```

5) Cart flow

Commands executed inside backend container:

```js
POST /api/cart { productId: 3, quantity: 2 } (authenticated customer)
GET /api/cart => returns items and total
```

Evidence:

```
getCart 200 {"items":[...],"total":"79.98"}
```

6) Mongo smoke

Command (inside backend container test script): inserted and read from Mongo collection `test`.

Evidence:

```
mongo test docs inserted: 1
```

Notes & Recommendations

- `.env` removed from repository; use `.env.example` as template. Set `JWT_SECRET` to a strong random value in production via CI/deployment secrets.
- `sequalize.sync({ alter: true })` now runs only in `NODE_ENV=development`. For staging/production, follow `backend/NON_DESTRUCTIVE_MIGRATION.md` and apply migrations.
- A GitHub Actions smoke-test workflow is added to start the stack and verify `/api/health` and `/api/products`.

If reviewer evidence files (logs or screenshots) are desired, I can attach them to the PR.
