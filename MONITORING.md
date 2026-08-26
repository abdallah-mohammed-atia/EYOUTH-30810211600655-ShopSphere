# Monitoring (UptimeRobot) — Task 1.4

1) Add a monitor for the backend health endpoint

- Sign in to UptimeRobot and create a new HTTP(s) monitor.
- Set the URL to: `https://<YOUR_BACKEND_URL>/api/health` and interval to 5 minutes.
- Optionally add an alert contact (email or SMS).

2) Example: register a monitor using UptimeRobot API (requires `UPTIMEROBOT_API_KEY`):

```bash
curl -X POST https://api.uptimerobot.com/v2/newMonitor \
  -H 'Content-Type: application/json' \
  -d '{"api_key": "<UPTIMEROBOT_API_KEY>", "format": "json", "type": 1, "friendly_name": "ShopSphere Backend", "url": "https://<YOUR_BACKEND_URL>/api/health"}'
```

3) Verification
- After the monitor is created, UptimeRobot will report status in its dashboard. Take a screenshot or copy the monitor URL into your submission evidence document.
