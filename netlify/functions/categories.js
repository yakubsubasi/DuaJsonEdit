import { getStore } from "@netlify/blobs";

const STORE_NAME = "dua-data";
const DATA_KEY = "main-data";

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
        // Extract category ID from URL
        const url = new URL(request.url);
        const pathParts = url.pathname.split("/");
        const categoryId = parseInt(pathParts[pathParts.length - 1]);

        if (isNaN(categoryId)) {
            return new Response(JSON.stringify({ error: "Invalid category ID" }), {
                status: 400,
                headers,
            });
        }

        const store = getStore(STORE_NAME);
        const data = await store.get(DATA_KEY, { type: "json" });

        if (!data) {
            return new Response(JSON.stringify({ error: "No data found" }), {
                status: 404,
                headers,
            });
        }

        const category = data.find((c) => c.id === categoryId);

        if (!category) {
            return new Response(JSON.stringify({ error: "Category not found" }), {
                status: 404,
                headers,
            });
        }

        return new Response(JSON.stringify(category), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error reading category:", error);
        return new Response(
            JSON.stringify({ error: "Failed to read category", details: error.message }),
            {
                status: 500,
                headers,
            }
        );
    }
};

export const config = {
    path: "/api/categories/*",
};
