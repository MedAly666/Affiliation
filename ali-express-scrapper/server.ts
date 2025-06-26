import { serve } from "bun";

// Keep track of startup time
const startTime = new Date();

// Create a simple server to keep the app alive
const server = serve({
  port: process.env.PORT || 8080,
  hostname: "0.0.0.0", // This is crucial for Fly.io to connect to your app
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/") {
      const uptime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      return new Response(`AliExpress Scraper is running\nUptime: ${uptime} seconds\nStarted at: ${startTime.toISOString()}`);
    }
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ 
        status: "healthy",
        uptime: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        startedAt: startTime.toISOString()
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server started at ${startTime.toISOString()}`);
console.log(`Server listening on ${server.hostname}:${server.port}`);

// Print environment details for debugging
console.log('Environment details:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT || 8080}`);
console.log(`CI: ${process.env.CI}`);

// Handle graceful shutdown
function shutdown() {
  console.log("Shutting down server...");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);