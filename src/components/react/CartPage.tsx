import Cart from './Cart';

export default function CartPage() {
  return (
    <main className="cart-page">
      <div className="cart-page__header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb__separator" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">Cart</span>
        </nav>
        <h1>Your cart</h1>
      </div>
      <Cart />
    </main>
  );
}
