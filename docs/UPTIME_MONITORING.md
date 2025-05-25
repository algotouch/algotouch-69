# Uptime Monitoring

This project exposes a simple health check Edge Function for uptime tools.

## Health Check Endpoint

- **URL:** `/functions/v1/health-check`
- **Response:** `{"status":"ok"}`

### Usage

1. Deploy the `health-check` function to your Supabase project.
2. Configure your uptime service (e.g. UptimeRobot, StatusCake) to send a `GET` request to the endpoint.
3. The service should expect a `200` status code and the JSON body shown above.
4. Trigger alerts if the request fails or returns a non-200 response.

The function handles CORS and does not require authentication, making it safe for public monitoring.
