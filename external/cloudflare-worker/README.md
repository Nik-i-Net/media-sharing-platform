# Cloudflare Setup Guide

### 1. Install dependencies
Go to `external/cloudflare-worker` and run `pnpm install`

### 2. Authenticate Wrangler
`pnpm wrangler login`

### 3. Create a Bucket, Queue and setup notifications
```bash
pnpm wrangler r2 bucket create *bucket name*
pnpm wrangler queues create *queue name*
pnpm wrangler r2 bucket notification create *bucket name* \
--queue *queue name* \
--event-type object-create
```

Adjust `wrangler.jsonc`:
- `r2_buckets.bucket_name` to match your bucket name
- `queues.consumers.queue` to match your queue name

### 4. Deploy the Worker and set secrets
```bash
pnpm wrangler deploy
pnpm wrangler secret put API_KEY # click enter and enter your API key
pnpm wrangler secret put WEBHOOK_URL # use format: https://<your-api>/api/v1/webhooks/cloudflare
```

### 5. Environment Variables
Set the following environment variables in your `.env.***` file:

```env
CLOUDFLARE_ACCOUNT_ID= # Storage & databases - R2 - Overview - Account Details - Account ID
CLOUDFLARE_ACCESS_KEY_ID= # Create in Storage & databases - R2 - Overview - API Tokens - Manage
CLOUDFLARE_SECRET_ACCESS_KEY= # Same as previous
CLOUDFLARE_BUCKET= # Bucket name
CLOUDFLARE_API_KEY= # API_KEY (secret set using wrangler)

MEDIA_BASE_URL= # Compute - Workers & Pages - *copy URL under the worker name*
```
