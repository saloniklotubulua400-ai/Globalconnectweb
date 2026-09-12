import React from "react";

export default function Success({
  order = null,
  onContinueShopping,
  onViewOrder,
}) {
  const orderNumber =
    order?.orderNumber ||
    order?.id ||
    "ORDER-CONFIRMED";

  const email =
    order?.customer?.email ||
    order?.email ||
    "";

  const items = order?.items || [];

  const total =
    order?.totals?.total ??
    order?.total ??
    items.reduce(
      (sum, item) =>
        sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );

  const currency = order?.totals?.currency || "USD";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);

  return (
    <main className="success-page">
      <div className="success-container">
        <section className="success-card">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>

          <span className="success-label">ORDER CONFIRMED</span>

          <h1>Thank you for your order!</h1>

          <p className="success-message">
            Your order has been successfully placed. We’ll send
            your confirmation and delivery details shortly.
          </p>

          {email && (
            <p className="success-email">
              Confirmation sent to <strong>{email}</strong>
            </p>
          )}

          <div className="success-order">
            <div>
              <span>Order number</span>
              <strong>{orderNumber}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          {items.length > 0 && (
            <div className="success-items">
              <h2>Order summary</h2>

              {items.map((item, index) => (
                <div
                  className="success-item"
                  key={item.id || `${item.name}-${index}`}
                >
                  <div className="success-item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                      />
                    ) : (
                      <span>📦</span>
                    )}

                    <span className="success-quantity">
                      {item.quantity || 1}
                    </span>
                  </div>

                  <div className="success-item-info">
                    <strong>{item.name}</strong>

                    {item.metadata && (
                      <small>
                        {item.metadata.data &&
                          `${item.metadata.data} · `}
                        {item.metadata.duration}
                      </small>
                    )}
                  </div>

                  <strong>
                    {formatCurrency(
                      Number(item.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <div className="success-actions">
            <button
              type="button"
              className="success-primary"
              onClick={onContinueShopping}
            >
              Continue shopping
            </button>

            {onViewOrder && (
              <button
                type="button"
                className="success-secondary"
                onClick={onViewOrder}
              >
                View order
              </button>
            )}
          </div>
        </section>

        <section className="success-next">
          <div>
            <span>01</span>
            <div>
              <h3>Confirmation</h3>
              <p>
                Your order details have been saved and a
                confirmation has been sent.
              </p>
            </div>
          </div>

          <div>
            <span>02</span>
            <div>
              <h3>Processing</h3>
              <p>
                We’ll prepare your order and keep you updated
                on its status.
              </p>
            </div>
          </div>

          <div>
            <span>03</span>
            <div>
              <h3>Delivery</h3>
              <p>
                You’ll receive delivery information as soon as
                your order is ready.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/*
Suggested CSS:

.success-page {
  min-height: 100vh;
  padding: 64px 20px;
  background:
    radial-gradient(
      circle at 50% 0%,
      #ede9fe 0,
      #f8fafc 38%,
      #f8fafc 100%
    );
  color: #0f172a;
}

.success-container {
  width: min(850px, 100%);
  margin: 0 auto;
}

.success-card {
  padding: 48px;
  text-align: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, .08);
}

.success-icon {
  width: 72px;
  height: 72px;
  display: grid;
  place-items: center;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: #dcfce7;
  color: #16a34a;
  font-size: 38px;
  font-weight: 800;
}

.success-label {
  color: #16a34a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
}

.success-card h1 {
  margin: 12px 0;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.1;
}

.success-message {
  max-width: 600px;
  margin: 0 auto;
  color: #64748b;
  line-height: 1.7;
}

.success-email {
  margin: 20px 0 0;
  color: #475569;
  font-size: 14px;
}

.success-order {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 32px;
  text-align: left;
}

.success-order > div {
  padding: 18px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.success-order span,
.success-order strong {
  display: block;
}

.success-order span {
  margin-bottom: 5px;
  color: #64748b;
  font-size: 12px;
}

.success-order strong {
  font-size: 16px;
}

.success-items {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid #e2e8f0;
  text-align: left;
}

.success-items h2 {
  margin: 0 0 16px;
  font-size: 18px;
}

.success-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.success-item:last-child {
  border-bottom: 0;
}

.success-item-image {
  position: relative;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f1f5f9;
}

.success-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.success-quantity {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #111827;
  color: white;
  font-size: 10px;
  font-weight: 700;
}

.success-item-info {
  display: grid;
  gap: 4px;
}

.success-item-info strong {
  font-size: 14px;
}

.success-item-info small {
  color: #64748b;
  font-size: 12px;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

.success-actions button {
  padding: 13px 20px;
  border-radius: 9px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.success-primary {
  border: 0;
  background: #111827;
  color: white;
}

.success-primary:hover {
  background: #000;
}

.success-secondary {
  border: 1px solid #cbd5e1;
  background: white;
  color: #0f172a;
}

.success-next {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.success-next > div {
  display: flex;
  gap: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
}

.success-next span {
  color: #7c3aed;
  font-size: 12px;
  font-weight: 800;
}

.success-next h3 {
  margin: 0 0 5px;
  font-size: 14px;
}

.success-next p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 700px) {
  .success-page {
    padding: 24px 14px;
  }

  .success-card {
    padding: 28px 18px;
  }

  .success-order,
  .success-next {
    grid-template-columns: 1fr;
  }

  .success-actions {
    flex-direction: column;
  }

  .success-actions button {
    width: 100%;
  }
}
*/
