import { useOptimistic, useState } from 'react';
import { addToCartApi } from './api';

export function AddToCart({ productId, cartCount, updateCartState }) {
    const [error, setError] = useState(null);

    // React 19 Feature: useOptimistic
    const [optimisticCartCount, addOptimisticCart] = useOptimistic(
        cartCount,
        (currentState, newAmount) => currentState + newAmount
    );

    const formAction = async () => {
        setError(null);
        addOptimisticCart(1); // Optimistic UI update

        try {
            await addToCartApi(productId);
            updateCartState(cartCount + 1); // Real state update
        } catch (err) {
            setError(err.message); // Optimistic state auto-rolls back on failure
        }
    };

    return (
        <div className="cart-section">
            <p className="cart-count">🛒 Cart: {optimisticCartCount}</p>
            <form action={formAction}>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                    Add to Cart
                </button>
            </form>
            {error && <p className="cart-error">{error}</p>}
        </div>
    );
}