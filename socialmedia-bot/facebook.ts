import { Api } from "telegram/tl";
import { FB, Facebook } from "fb";

/**
 * Generates a Long-Lived User Token
 */
export async function longLivedUserTokenGenerator() {
    const appId = process.env.FB_APP_ID || "";
    const appSecret = process.env.FB_APP_SECRET || "";
    const shortLivedUserToken = process.env.FB_USER_ACCESS_TOKEN || "";

    if (!appId || !appSecret || !shortLivedUserToken) {
        throw new Error(
            "❌ Please set FB_APP_ID, FB_APP_SECRET, and FB_USER_ACCESS_TOKEN (short-lived) in .env"
        );
    }

    FB.options({ version: "v21.0" });

    try {
        const res: any = await FB.api("oauth/access_token", {
            grant_type: "fb_exchange_token",
            client_id: appId,
            client_secret: appSecret,
            fb_exchange_token: shortLivedUserToken,
        });

        if (res.error) {
            throw new Error(`Error exchanging token: ${JSON.stringify(res.error)}`);
        }

        console.log("✅ Long-lived User Token (valid ~60 days):", res.access_token);
        return res.access_token;
    } catch (err) {
        console.error("❌ Exception:", err);
        throw err;
    }
}

/**
 * Gets Page Access Token from User Token
 */
export async function getPageAccessToken(
    pageId: string,
    userAccessToken: string
): Promise<string> {
    FB.setAccessToken(userAccessToken);

    const res: any = await FB.api("me/accounts");

    if (res.error) {
        throw new Error(`Error fetching Page tokens: ${JSON.stringify(res.error)}`);
    }

    const page = res.data.find((p: any) => p.id === pageId);
    if (!page) {
        throw new Error(`Page with ID ${pageId} not found in your account.`);
    }

    return page.access_token;
}

/**
 * Publishes a post to a Facebook Page
 */
export async function publishPost(message: Api.Message) {
    const fb = new Facebook({ version: "v21.0" });
    const pageId = process.env.FB_PAGE_ID || "";
    const userAccessToken = process.env.FB_USER_ACCESS_TOKEN || "";
    if (!pageId || !userAccessToken) throw new Error("Missing FB_PAGE_ID or FB_USER_ACCESS_TOKEN");

    // 🔑 Get Page Access Token
    const { data: accounts } = await fb.api("me/accounts", {
        access_token: userAccessToken,
    });
    const page = accounts.find((p: any) => p.id === pageId);
    if (!page) throw new Error(`Page ${pageId} not found`);
    fb.setAccessToken(page.access_token);

    console.log({ pageId, message });

    if (message.media && message.media.photo) {
        // ✅ Download Telegram photo to Buffer
        const buffer = await (message.downloadMedia({}) as Promise<Buffer>);

        // ✅ Upload photo
        const res = await fb.api(`${pageId}/photos`, "post", {
            caption: message.message || "",
            source: buffer, // fb SDK handles multipart
        });

        console.log("📸 Posted photo:", res);
        return res;

    } else if (
        message.media &&
        message.media.document &&
        message.media.document.mimeType?.startsWith("video")
    ) {
        // ✅ Download Telegram video
        const buffer = await (message.downloadMedia({}) as Promise<Buffer>);

        // ✅ Upload video
        const res = await fb.api(`${pageId}/videos`, "post", {
            description: message.message || "",
            source: buffer, // fb SDK handles upload
        });

        console.log("🎥 Posted video:", res);
        return res;

    } else {
        // ✅ Text post
        const res = await fb.api(`${pageId}/feed`, "post", {
            message: message.message,
        });

        console.log("✍️ Posted text:", res);
        return res;
    }
}
