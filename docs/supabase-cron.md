# Setting Up Scheduled Cron Jobs & Notification Queue in Supabase

This document explains how to set up scheduled cron jobs inside your Supabase database to periodically trigger the **Notification Queue & Dispatch System** (`/api/push/send`).

---

## Architecture Overview

```
Supabase pg_cron (Every 2-5 mins)
      │
      ▼
HTTP GET /api/push/send?bypass=true
      │
      ├─► 1. Enqueue due prayer notifications into "NotificationQueue" table
      ├─► 2. Process pending & retrying items via Web Push (Google FCM / Apple APNs)
      ├─► 3. On success ──► Mark SENT with delivery timestamp
      ├─► 4. On transient failure ──► Schedule automatic RETRY with exponential backoff (30s, 60s, 120s, 300s, 600s)
      └─► 5. On expired subscription (410/404) ──► Clean up invalid device token automatically
```

---

## Step 1: Enable PostgreSQL Extensions
To schedule jobs and make asynchronous HTTP requests directly from your database:

1. Open your **Supabase Dashboard**.
2. Navigate to **Database** (from the left sidebar) -> **Extensions**.
3. Search for and enable the following extensions:
   * **`pg_cron`**: Enables scheduling PostgreSQL commands.
   * **`pg_net`**: Enables making asynchronous HTTP requests from inside the database.

---

## Step 2: Schedule or Update the Cron Job
Go to the **SQL Editor** in the Supabase Dashboard and run the following command to schedule a new cron job:

```sql
-- Unschedule previous job if exists
select cron.unschedule('namaz-push-cron');

-- Schedule cron job to run every 2 minutes (recommended for precise prayer azan timing)
select cron.schedule(
  'namaz-push-cron',
  '*/2 * * * *',
  $$
  select net.http_get(
    url := 'https://alquran.qubartech.com/api/push/send?bypass=true'
  );
  $$
);
```

> **Tip**: You can also run every minute (`* * * * *`) or every 5 minutes (`*/5 * * * *`). Because our queue system tracks deduplication keys (`subId_prayerName_YYYY-MM-DD`), it will **never send duplicate notifications** to the same device for the same prayer.

---

## Step 3: Monitoring & Managing the Queue

### 1. View Notification Queue in Supabase SQL Editor
Run the following query in your Supabase SQL Editor to see all queued, sent, and retrying notifications:

```sql
-- View latest 20 notifications across all devices
SELECT 
  id, 
  "prayerName", 
  title, 
  status, 
  attempts, 
  "lastError", 
  "nextRetryAt", 
  "sentAt", 
  "createdAt"
FROM "NotificationQueue"
ORDER BY "createdAt" DESC
LIMIT 20;

-- Check summary counts by status
SELECT status, count(*) 
FROM "NotificationQueue" 
GROUP BY status;
```

### 2. View Active Push Subscriptions (Devices)
```sql
SELECT 
  id, 
  "userId", 
  city, 
  country, 
  reminders, 
  "lastNotified", 
  "updatedAt"
FROM "PushSubscription"
ORDER BY "updatedAt" DESC;
```

### 3. View Supabase Cron Job Logs
```sql
-- View cron execution history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

---

## Step 4: Testing & Direct API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/push/send?bypass=true` | `GET` / `POST` | Standard cron trigger. Enqueues due prayer notifications and delivers pending queue items. |
| `/api/push/send?bypass=true&force=true` | `GET` / `POST` | **Force Test**: Immediately enqueues and dispatches test notifications to all active registered devices. |
| `/api/push/queue` | `GET` | Returns real-time queue diagnostic statistics and recent items. |
| `/api/push/queue` | `POST` | Queue management actions: `{"action": "process"}` or `{"action": "retry_failed"}`. |
