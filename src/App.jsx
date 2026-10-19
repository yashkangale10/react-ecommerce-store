import React, { Suspense, useState } from 'react';
import { preload, prefetchDNS } from 'react-dom';
import { UserContext } from './UserContext';
import { fetchProducts } from './api';
import { RegistrationForm } from './RegistrationForm';
import { ProductList } from './ProductList';
import { ProductDetails } from './ProductDetails';
import { ErrorBoundary } from './ErrorBoundary';
import { UserProfile } from './UserProfile';
import './styles.css';

// Fetch early before component renders
const productsPromise = fetchProducts();

// React 19 Feature: Asset Loading APIs
// Preload the specific image URL so it downloads immediately
preload('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQL37DokLglQe2gNsdNpRB7F36Jlocw3Cll3-SE3xRdpQ&s', { as: 'image' });

// Prefetch the DNS for the base domain of that image
prefetchDNS('https://encrypted-tbn0.gstatic.com');

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  return (
    /* React 19 Feature: Context object can be used directly instead of .Provider */
    <UserContext value={{ user, setUser }}>
      <div className="app-container">

        {/* React 19 Feature: Document Metadata Hoisting */}
        <title>Mini E-Commerce Store - Products</title>
        <meta name="description" content="A mini e-commerce application built with React 19 features." />

        <header className="app-header">
          <h1>Mini E-Commerce Store</h1>
          {/* React 19 Feature: UserProfile reads from Context via use(UserContext) */}
          {user ? <UserProfile /> : <p>Guest User (Please Register)</p>}
        </header>

        <main>
          {!user ? (
            <RegistrationForm />
          ) : (
            selectedProduct ? (
              <ProductDetails
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                cartCount={cartCount}
                updateCartState={setCartCount}
              />
            ) : (
              <div>
                <h2>Our Products</h2>
                <ErrorBoundary>
                  <Suspense fallback={<h3>Loading products...</h3>}>
                    <ProductList
                      productsPromise={productsPromise}
                      onSelectProduct={setSelectedProduct}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )
          )}
        </main>
      </div>
    </UserContext>
  );
}