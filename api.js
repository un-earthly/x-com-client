import { createClient } from '@supabase/supabase-js'
const base = "http://localhost:8000"
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getStoreFrontKeys() {
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(user)
    const { data } = await supabase.from("shop").select().eq("user_id",user.user_id);

    return {
        API_KEY: data[0].api_key,
        SHOP_URL: data[0].shop_domain,
        PASSWORD: data[0].api_access
    };
}
export const markAsFullfilled = async (id, body) => {
    try {
        const headers = await getStoreFrontKeys();

        const response = await fetch(`${base}/order/${id}`, {
            method: "POST",
            headers,
            body
        });
        if (!response.ok) {
            throw new Error("Failed to FUllfill Orders");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}



export const fetchProducts = async () => {
    try {
        const headers = await getStoreFrontKeys();
        const response = await fetch(`${base}/products`, {
            headers
        }); // Change the URL to match your server endpoint
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
export const fetchProductDetails = async (id) => {
    try {
        const headers = await getStoreFrontKeys();

        const response = await fetch(`${base}/products/${id}`, {
            headers
        });
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
export const fetchOrders = async () => {
    try {
        const headers = await getStoreFrontKeys();

        const response = await fetch(`${base}/orders`, {
            headers
        }); // Change the URL to match your server endpoint
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
export const fetchOrderDetails = async (id) => {
    const headers = await getStoreFrontKeys();

    try {
        const response = await fetch(`${base}/order/${id}`, {
            headers
        });
        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}
