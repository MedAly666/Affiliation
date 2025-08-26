import fetch from "node-fetch";

const appId = process.env.FB_APP_ID || "";
const appSecret = process.env.FB_APP_SECRET || "";
const shortLivedUserToken = process.env.FB_USER_ACCESS_TOKEN || ""; // short-lived token

if (!appId || !appSecret || !shortLivedUserToken) {
    console.error("❌ Please set FB_APP_ID, FB_APP_SECRET, and FB_USER_ACCESS_TOKEN (short-lived) in .env");
    process.exit(1);
}

(async () => {
    try {
        const url = `https://graph.facebook.com/v21.0/oauth/access_token?` +
            `grant_type=fb_exchange_token&` +
            `client_id=${appId}&` +
            `client_secret=${appSecret}&` +
            `fb_exchange_token=${shortLivedUserToken}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error("❌ Error exchanging token:", data.error);
        } else {
            console.log("✅ Long-lived User Access Token (valid ~60 days):\n");
            console.log(data.access_token);
            console.log("\n👉 Save this as FB_USER_ACCESS_TOKEN in your .env");
        }
    } catch (err) {
        console.error("❌ Exception:", err);
    }
})();
