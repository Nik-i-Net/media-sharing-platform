# Stripe Setup Guide

### 1. Copy Stripe API Key
1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com).
2. Go to **Developers** (bottom bar) > **API Keys**
3. Copy **Secret key** (sk_test_...) to **STRIPE_API_KEY** in your .env

### 2. Create Pro Plan Product
2. Go to **Product catalog** > click **Create product**.
3. Set a Name, Pricing: **Recurring**, Amount and Billing period: **Monthly**.
4. Go to **Your Product** > **Your Price**
5. Copy **Price ID** (price_...) to **STRIPE_PRO_PLAN_PRICE_ID** in your .env

### 3. Setup Webhooks
1. Go to **Developers** (bottom bar) > **Webhooks** > click **Add destination**.
2. Select events:
    - customer.subscription.created
    - customer.subscription.updated
    - customer.subscription.deleted
3. On next page, set **Destination type** to **Webhook endpoint** and click continue.
4. For **Endpoint URL**, use the following format: `https://<your-api>/api/v1/webhooks/stripe`
5. Copy **Signing secret** (whsec_...) to **STRIPE_WEBHOOK_SECRET** in your .env
