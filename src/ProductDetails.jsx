import { AddToCart } from './AddToCart';

export function ProductDetails({ product, onBack, cartCount, updateCartState }) {
    return (
        <div className="details-container">
            <button onClick={onBack} className="btn-secondary">&larr; Back to Products</button>
            <div className="details-content">
                <img src={product.image} alt={product.name} className="details-image" />
                <div>
                    <h2>{product.name}</h2>
                    <p className="details-price">₹{product.price}</p>
                    <p>{product.description}</p>

                    <AddToCart
                        productId={product.id}
                        cartCount={cartCount}
                        updateCartState={updateCartState}
                    />
                </div>
            </div>
        </div>
    );
}