/**
 * Pings the backend every 14 minutes to prevent Render's
 * free tier from putting the server to sleep.
 * Call this once in main.tsx if using Render free tier.
 */
export function startKeepAlive() {
  const url = `${import.meta.env.VITE_API_URL}/api/actuator/health`
  const ping = () => fetch(url).catch(() => {}) // silent fail
  ping() // immediate first ping
  setInterval(ping, 14 * 60 * 1000) // every 14 min
}
