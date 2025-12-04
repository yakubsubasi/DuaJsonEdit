import { getStore } from "@netlify/blobs";

const STORE_NAME = "dua-data";
const BACKUPS_KEY_PREFIX = "backup-";

function getCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Content-Type": "application/json",
    };
}

export default async (request, context) => {
    const headers = getCorsHeaders();

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers,
        });
    }

    try {
        const store = getStore(STORE_NAME);
        const { blobs } = await store.list({ prefix: BACKUPS_KEY_PREFIX });

        const backups = blobs
            .map((b) => ({
                filename: b.key.replace(BACKUPS_KEY_PREFIX, "backup-") + ".json",
                key: b.key,
            }))
            .sort((a, b) => b.key.localeCompare(a.key));

        return new Response(JSON.stringify(backups), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error listing backups:", error);
        return new Response(
            JSON.stringify({ error: "Failed to list backups", details: error.message }),
            {
                status: 500,
                headers,
            }
        );
    }
};

export const config = {
    path: "/api/backups",
};
