const webpush = require('web-push');

try {
  webpush.setVapidDetails(
    "mailto:support@quranapp.com",
    "BIpiY3iIQcWPvTvST1b0gR21m046hVXCY-B3F_tppkENZ0Iti7j9gMKtq_90xiei9w5YWXUWaunAdclQswjVv10",
    "b0qH4edNxyM1gVd53jqollnWPqWyO0LkUbbM-3aUTb0"
  );
  console.log("VAPID Keys validation check passed successfully!");
} catch (err) {
  console.error("VAPID Keys validation check failed:", err.message);
}
