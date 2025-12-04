import { getStore } from "@netlify/blobs";

const STORE_NAME = "dua-data";
const DATA_KEY = "main-data";

function getCorsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };
}

// This function is used to initialize data in Netlify Blobs
// Call this endpoint with your back-end.json data to seed the database
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
        const store = getStore(STORE_NAME);

        // Check if data already exists
        const existingData = await store.get(DATA_KEY, { type: "json" });

        if (existingData && existingData.length > 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Data already exists. Use force=true to override.",
                    count: existingData.length,
                }),
                {
                    status: 200,
                    headers,
                }
            );
        }

        // Get data from request body
        const newData = await request.json();

        if (!Array.isArray(newData)) {
            return new Response(
                JSON.stringify({ error: "Invalid data format. Expected an array." }),
                {
                    status: 400,
                    headers,
                }
            );
        }

        await store.set(DATA_KEY, JSON.stringify(newData));

        return new Response(
            JSON.stringify({
                success: true,
                message: "Data initialized successfully",
                count: newData.length,
            }),
            {
                status: 200,
                headers,
            }
        );
    } catch (error) {
        console.error("Error initializing data:", error);
        return new Response(
            JSON.stringify({ error: "Failed to initialize data", details: error.message }),
            {
                status: 500,
                headers,
            }
        );
    }
};

export const config = {
    path: "/api/init-data",
};
