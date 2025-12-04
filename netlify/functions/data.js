import { getStore } from "@netlify/blobs";

// Initial data import - will be loaded from back-end.json on first deploy
const STORE_NAME = "dua-data";
const DATA_KEY = "main-data";
const BACKUPS_KEY_PREFIX = "backup-";

// Helper to get CORS headers
function getCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json",
    };
}

// Helper to create backup
async function createBackup(store, data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupKey = `${BACKUPS_KEY_PREFIX}${timestamp}`;
    await store.set(backupKey, JSON.stringify(data));

    // Keep only last 10 backups
    const { blobs } = await store.list({ prefix: BACKUPS_KEY_PREFIX });
    const sortedBackups = blobs
        .map((b) => b.key)
        .sort()
        .reverse();

    for (let i = 10; i < sortedBackups.length; i++) {
        await store.delete(sortedBackups[i]);
    }

    return backupKey;
}

export default async (request, context) => {
    const headers = getCorsHeaders();

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    try {
        const store = getStore(STORE_NAME);

        if (request.method === "GET") {
            // Get data
            let data = await store.get(DATA_KEY, { type: "json" });

            // If no data exists, return empty array (initial state)
            if (!data) {
                data = [];
            }

            return new Response(JSON.stringify(data), {
                status: 200,
                headers,
            });
        }

        if (request.method === "POST") {
            // Get existing data for backup
            const existingData = await store.get(DATA_KEY, { type: "json" });

            // Create backup if data exists
            let backupKey = null;
            if (existingData) {
                backupKey = await createBackup(store, existingData);
            }

            // Save new data
            const newData = await request.json();
            await store.set(DATA_KEY, JSON.stringify(newData));

            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Data saved successfully",
                    backup: backupKey,
                }),
                {
                    status: 200,
                    headers,
                }
            );
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers,
        });
    } catch (error) {
        console.error("Error in data function:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error", details: error.message }),
            {
                status: 500,
                headers,
            }
        );
    }
};

export const config = {
    path: "/api/data",
};
