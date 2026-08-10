const http = require('http');

const PORT = 3000;
const PATH = '/api/push/send?bypass=true';
const INTERVAL_MS = 60000; // Trigger every 1 minute

console.log("=================================================");
console.log(`⏰ Local Cron Simulator for Closed-Tab Web Push`);
console.log(`Sending requests to http://localhost:${PORT}${PATH} every 60 seconds.`);
console.log("=================================================");

function triggerCron() {
  const now = new Date().toLocaleTimeString();
  console.log(`[${now}] Triggering cron check...`);

  const req = http.request({
    hostname: 'localhost',
    port: PORT,
    path: PATH,
    method: 'GET',
  }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log(`[${now}] Status: ${res.statusCode}, Results:`, parsed.results || parsed);
      } catch (e) {
        console.log(`[${now}] Status: ${res.statusCode}, Response: ${data}`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`[${now}] Connection failed (Is your Next.js server running on port ${PORT}?):`, err.message);
  });

  req.end();
}

// Trigger once immediately, then every minute
triggerCron();
setInterval(triggerCron, INTERVAL_MS);
