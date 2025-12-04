import { getStore } from "@netlify/blobs";

const STORE_NAME = "dua-data";
const DATA_KEY = "main-data";
const BACKUPS_KEY_PREFIX = "backup-";

function getCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };
}

export default async (request, context) => {
    const headers = getCorsHeaders();

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers,
        });
    }

    try {
        // Extract backup key from URL
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/");
        const filename = pathParts[pathParts.length - 1];

        // Convert filename back to backup key
        const backupKey = filename.replace(".json", "").replace("backup-", BACKUPS_KEY_PREFIX);

        const store = getStore(STORE_NAME);

        // Get backup data
        const backupData = await store.get(backupKey, { type: "json" });

        if (!backupData) {
            return new Response(JSON.stringify({ error: "Backup not found" }), {
                status: 404,
                headers,
            });
        }

        // Restore to main data
        await store.set(DATA_KEY, JSON.stringify(backupData));

        return new Response(
            JSON.stringify({
                success: true,
                message: "Data restored successfully",
            }),
            {
                status: 200,
                headers,
            }
        );
    } catch (error) {
        console.error("Error restoring backup:", error);
        return new Response(
            JSON.stringify({ error: "Failed to restore backup", details: error.message }),
            {
                status: 500,
                headers,
            }
        );
    }
};

export const config = {
    path: "/api/restore/*",
};
