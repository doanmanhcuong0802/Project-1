import { useState } from 'react'
import { products } from './products'
import './App.css'

function App() {
  const [selectedFit, setSelectedFit] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<number[]>([])

  const filteredProducts = products.filter((product) => {
    const fitMatch =
      selectedFit === 'all' || product.fit === selectedFit

    const categoryMatch =
      selectedCategory === 'all' ||
      product.category === selectedCategory

    return fitMatch && categoryMatch
  })

  const addToCart = (id: number) => {
    const product = products.find((item) => item.id === id)

    if (!product) return

    const currentQuantity = cart.filter(
      (item) => item === id
    ).length

    if (currentQuantity < product.quantity) {
      setCart((previous) => [...previous, id])
    }
  }

  const removeFromCart = (id: number) => {
    setCart((previous) => {
      const index = previous.indexOf(id)

      if (index === -1) return previous

      return previous.filter((_, i) => i !== index)
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const cartTotal = cart.reduce((total, id) => {
    const product = products.find((item) => item.id === id)

    return total + (product?.price || 0)
  }, 0)

  const categoryNames: Record<string, string> = {
    't-shirt': 'T-Shirts',
    shirt: 'Shirts',
    hoodie: 'Hoodies',
    pants: 'Pants',
    shorts: 'Shorts',
  }

  return (
    <div className="shop">

      {/* NAVBAR */}
      <header className="navbar">
        <h1>THRIFT STORE</h1>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
          <a href="#products">Collection</a>
          <a href="#cart">Cart ({cart.length})</a>
        </nav>

        <div className="cart">
          🛒 Cart ({cart.length})
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="subtitle">SUSTAINABLE FASHION</p>

          <h2>
            Second-hand style.
            <br />
            First-class finds.
          </h2>

          <p>
            Discover unique pre-loved clothing at affordable prices.
            Give fashion a second life.
          </p>

          <a href="#products" className="shop-button">
            SHOP NOW
          </a>
        </div>
      </section>

      {/* PRODUCTS */}
      <main id="products">

        <div className="section-heading">
          <p className="subtitle">OUR COLLECTION</p>

          <h2>Find Your Style</h2>

          <p>
            Explore our collection of pre-loved clothing.
          </p>

          <p>
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* FILTERS */}
        <div className="filters">

          <select
            value={selectedFit}
            onChange={(e) => setSelectedFit(e.target.value)}
          >
            <option value="all">All Fits</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            <option value="all">All Categories</option>
            <option value="t-shirt">T-Shirts</option>
            <option value="shirt">Shirts</option>
            <option value="hoodie">Hoodies</option>
            <option value="pants">Pants</option>
            <option value="shorts">Shorts</option>
          </select>

          <button
            className="reset-button"
            onClick={() => {
              setSelectedFit('all')
              setSelectedCategory('all')
            }}
          >
            Reset Filters
          </button>

        </div>

        {/* PRODUCT GRID */}
        <div className="product-grid">

          {filteredProducts.map((product) => {
            const currentQuantity = cart.filter(
              (id) => id === product.id
            ).length

            const imageMissing = !product.image

            return (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  {imageMissing ? (
                    <div className="image-placeholder">
                      Image not found
                    </div>
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        console.error(
                          'Cannot load image:',
                          product.image
                        )
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}

                </div>

                <div className="product-info">

                  <p className="product-category">
                    {product.fit.toUpperCase()} /{' '}
                    {categoryNames[product.category]}
                  </p>

                  <h3>{product.name}</h3>

                  <p>Size: {product.size}</p>

                  <p>Color: {product.color}</p>

                  <div className="product-bottom">

                    <strong>
                      ${product.price.toFixed(2)} CAD
                    </strong>

                    <span>
                      {product.quantity > 0
                        ? `${product.quantity} in stock`
                        : 'Sold out'}
                    </span>

                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={
                      product.quantity === 0 ||
                      currentQuantity >= product.quantity
                    }
                  >
                    {product.quantity === 0
                      ? 'Sold Out'
                      : currentQuantity >= product.quantity
                        ? 'Maximum Reached'
                        : 'Add to Cart'}
                  </button>

                </div>

              </article>
            )
          })}

        </div>

        {/* SHOPPING CART */}
        <section className="cart-summary" id="cart">

          <h2>Shopping Cart</h2>

          <p>Total items: {cart.length}</p>

          {cart.length === 0 ? (
            <p>Your shopping cart is empty.</p>
          ) : (
            <div className="cart-items">

              {products
                .filter((product) =>
                  cart.includes(product.id)
                )
                .map((product) => {
                  const quantity = cart.filter(
                    (id) => id === product.id
                  ).length

                  return (
                    <div
                      className="cart-item"
                      key={product.id}
                    >
                      <span>
                        {product.name} × {quantity}
                      </span>

                      <span>
                        ${(product.price * quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                      >
                        Remove one
                      </button>
                    </div>
                  )
                })}

            </div>
          )}

          <h3>
            Total: ${cartTotal.toFixed(2)} CAD
          </h3>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
          >
            Clear Cart
          </button>

        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <h2>THRIFT STORE</h2>

        <p>
          Pre-loved clothing. Better choices. Better future.
        </p>

        <p>© 2026 Thrift Store</p>
      </footer>

    </div>
  )
}

export default App
