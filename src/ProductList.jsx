import { use } from 'react';

export function ProductList({ productsPromise, onSelectProduct }) {
    // React 19 Feature: use() API
    const products = use(productsPromise);

    return (
        <div className="product-grid">
            {products.map(product => (
                <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <p className="product-price">₹{product.price}</p>
                    <p><span className="product-category">{product.category}</span></p>
                    <p className="product-desc">{product.description}</p>
                    <button onClick={() => onSelectProduct(product)} className="btn-primary" style={{ marginTop: 'auto' }}>
                        View Details
                    </button>
                </div>
            ))}
        </div>
    );
}