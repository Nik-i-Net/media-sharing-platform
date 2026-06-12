# Auth0 Setup Guide

> **Note**: Auth0 integration consists of two parts. This guide covers the **Backend** setup. The **Frontend** part will be documented in the frontend repository.

### 1. Create API
1. Log in to the [Auth0 Dashboard](https://manage.auth0.com/).
2. Go to **Applications** > **APIs** > click **Create API**.
3. Set a **Name** and an **Identifier** (your Backend base URL - JWT_AUDIENCE from .env).

### 2. Create Post-Login Action
1. Go to **Actions** > **Library** > **Create Action** > **Create Custom Action**.
2. Set a **Name** and choose **Login / Post Login** for **Trigger**
3. Copy code from [post-login.action.cjs](./post-login.action.cjs)
4. Adjuct **JWT_AUDIENCE** to match your value from .env
5. Click **Add Secret** and set:
    - **Key**: "API_KEY"
    - **Value**: your AUTH0_API_KEY value from .env
6. Deploy the action.
7. Go to **Actions** > **Triggers** > **post-login** > drag your action and click **Apply**.

### 3. Create M2M Client-Credentials Action (optional, for testing)
1. Go to **Actions** > **Library** > **Create Action** > **Create Custom Action**.
2. Set a **Name** and choose **M2M Client-Credentials** for **Trigger**
3. Copy code from [M2M-credentials-exchange.action.cjs](./M2M-credentials-exchange.action.cjs)
4. Adjuct **JWT_AUDIENCE** to match your value from .env
5. Deploy the action.
6. Go to **Actions** > **Triggers** > **credentials-exchange** > drag your action and click **Apply**.

### 4. Environment Variables
Check the following environment variables in your `.env.***` file:

```env
JWT_ISSUER= # Should match: Applications - APIs - *ApiName* - Quickstart - Node.Js - *issuerBaseURL*
JWT_AUDIENCE= # Should match: Applications - APIs - *ApiName* - Quickstart - Node.Js - *audience*
AUTH0_API_KEY= # API_TOKEN for Auth0 Post-Login action
```
