export const fetchProducts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: "Wireless Headphones", price: 7999, category: "Electronics", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL37DokLglQe2gNsdNpRB7F36Jlocw3Cll3-SE3xRdpQ&s", description: "High quality noise-canceling headphones." },
                { id: 2, name: "Running Shoes", price: 5999, category: "Sports", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT25xOjyFGQ9ivwepnSOLnGtXxiVH3q6zmQw37khhQZSw&s=10", description: "Comfortable and durable running shoes." },
                { id: 3, name: "Coffee Maker", price: 3499, category: "Home", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREAnQpIC_uA7n5048OBsTOFC9nE-f3-1zD4f3nFlkWAA&s=10", description: "Brews perfect coffee every time." }
            ]);
        }, 1500);
    });
};

export const registerUser = (formData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const name = formData.get("name");
            const email = formData.get("email");
            const password = formData.get("password");

            if (!name || !email || !password) {
                resolve({ success: false, error: "All fields are required." });
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                resolve({ success: false, error: "Please enter a valid email address." });
            } else if (password.length < 6) {
                resolve({ success: false, error: "Password must be at least 6 characters." });
            } else {
                resolve({ success: true, user: { name, email } });
            }
        }, 1500);
    });
};

export const addToCartApi = (productId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Product ID 3 (Coffee Maker) always fails to demonstrate optimistic rollback
            if (productId === 3) {
                reject(new Error("Network Error: Failed to add to cart."));
            } else {
                resolve({ success: true });
            }
        }, 1500);
    });
};