# Setting Up Scheduled Cron Jobs in Supabase

This document explains how to set up a scheduled cron job inside your Supabase database to periodically trigger the prayer time push notification API endpoint (`/api/push/send`).

---

## Step 1: Enable PostgreSQL Extensions
To schedule jobs and make HTTP requests directly from your database, you need to enable two PostgreSQL extensions:

1. Open your **Supabase Dashboard**.
2. Navigate to **Database** (from the left sidebar) -> **Extensions**.
3. Search for and enable the following extensions:
   * **`pg_cron`**: Enables scheduling PostgreSQL commands.
   * **`pg_net`**: Enables making asynchronous HTTP requests from inside the database.

---

## Step 2: Schedule the Cron Job
Once the extensions are enabled, go to the **SQL Editor** in the Supabase Dashboard and run the following command to schedule a new cron job:

```sql
select cron.schedule(
  'namaz-push-cron', -- Unique name for this cron job
  '*/5 * * * *',      -- Cron expression (runs every 5 minutes)
  $$
  select net.http_get(
    url := 'https://alquran.qubartech.com/api/push/send?bypass=true'
  );
  $$
);
```

---

## Step 3: Managing the Cron Job

### 1. View Active Scheduled Jobs
To inspect all scheduled jobs and make sure your job is active:
```sql
select * from cron.job;
```

### 2. View Execution Logs
To see the execution history, statuses, and response codes of previous runs:
```sql
select * from cron.job_run_details order by start_time desc limit 10;
```

### 3. Deleting / Stopping the Job
If you need to stop or remove the scheduled task, run the following:
```sql
select cron.unschedule('namaz-push-cron');
```
