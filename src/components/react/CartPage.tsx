import Cart from './Cart';

export default function CartPage() {
  return (
    <section className="cart-page">
      <div className="cart-page__header">
        <nav className="breadcrumb">
          <a href="/">Home</a>
          <span className="breadcrumb__separator">›</span>
          <span className="breadcrumb__current">Cart</span>
        </nav>
        <h1>Your Cart</h1>
      </div>
      <Cart />
    </section>
  );
}
