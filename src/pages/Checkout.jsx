import React, { useMemo, useState } from "react";

/**
 * Checkout.jsx
 *
 * Expected cart item shape:
 * {
 *   id: "product-1",
 *   name: "Product name",
 *   price: 49.99,
 *   quantity: 2,
 *   image: "/images/product.jpg"
 * }
 *
 * Usage:
 * <Checkout
 *   items={cartItems}
 *   onSubmit={async (order) => {
 *     // Create payment/order on your backend here.
 *   }}
 * />
 */

const TAX_RATE = 0.08;
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 100;

const initialForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function normalizeCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function normalizeExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validate(form) {
  const errors = {};

  if (!form.email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email.";
  }

  if (!form.firstName.trim()) errors.firstName = "Required.";
  if (!form.lastName.trim()) errors.lastName = "Required.";
  if (!form.address.trim()) errors.address = "Required.";
  if (!form.city.trim()) errors.city = "Required.";
  if (!form.state.trim()) errors.state = "Required.";
  if (!form.postalCode.trim()) errors.postalCode = "Required.";

  if (!form.cardName.trim()) errors.cardName = "Required.";

  const cardDigits = form.cardNumber.replace(/\D/g, "");
  if (cardDigits.length < 13) {
    errors.cardNumber = "Enter a valid card number.";
  }

  if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
    errors.expiry = "Use MM/YY.";
  }

  if (!/^\d{3,4}$/.test(form.cvv)) {
    errors.cvv = "Enter a valid CVV.";
  }

  return errors;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
}) {
  return (
    <div className="checkout-field">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {error && (
        <span id={`${name}-error`} className="checkout-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default function Checkout({
  items = [],
  onSubmit,
  currency = "USD",
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      ),
    [items]
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;

  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const updateField = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "cardNumber") {
      nextValue = normalizeCardNumber(value);
    }

    if (name === "expiry") {
      nextValue = normalizeExpiry(value);
    }

    if (name === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");

    if (!acceptedTerms) {
      setSubmitError("Please accept the terms and conditions.");
      return;
    }

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const order = {
        customer: {
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
        },

        shippingAddress: {
          address: form.address.trim(),
          apartment: form.apartment.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country,
        },

        payment: {
          // In production, tokenize card details with Stripe/another
          // payment provider rather than sending raw card data yourself.
          cardName: form.cardName.trim(),
          cardNumber: form.cardNumber.replace(/\D/g, ""),
          expiry: form.expiry,
          cvv: form.cvv,
        },

        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),

        totals: {
          subtotal,
          shipping,
          tax,
          total,
          currency,
        },
      };

      await onSubmit(order);
    } catch (error) {
      setSubmitError(
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <main className="checkout-empty">
        <h1>Your cart is empty</h1>
        <p>Add an item to your cart before checking out.</p>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="checkout-container">
        <header className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order securely.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="checkout-layout">
            <section className="checkout-main">
              <div className="checkout-card">
                <h2>Contact information</h2>

                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  error={errors.email}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="checkout-card">
                <h2>Shipping address</h2>

                <div className="checkout-grid">
                  <Field
                    label="First name"
                    name="firstName"
                    value={form.firstName}
                    onChange={updateField}
                    error={errors.firstName}
                    autoComplete="given-name"
                  />

                  <Field
                    label="Last name"
                    name="lastName"
                    value={form.lastName}
                    onChange={updateField}
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>

                <Field
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  error={errors.address}
                  autoComplete="street-address"
                />

                <Field
                  label="Apartment, suite, etc. (optional)"
                  name="apartment"
                  value={form.apartment}
                  onChange={updateField}
                  autoComplete="address-line2"
                />

                <div className="checkout-grid checkout-grid-3">
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    error={errors.city}
                    autoComplete="address-level2"
                  />

                  <Field
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={updateField}
                    error={errors.state}
                    autoComplete="address-level1"
                  />

                  <Field
                    label="ZIP code"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={updateField}
                    error={errors.postalCode}
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <div className="checkout-card">
                <div className="payment-heading">
                  <div>
                    <h2>Payment</h2>
                    <p>Your payment information is encrypted.</p>
                  </div>

                  <span aria-hidden="true">🔒</span>
                </div>

                <Field
                  label="Name on card"
                  name="cardName"
                  value={form.cardName}
                  onChange={updateField}
                  error={errors.cardName}
                  autoComplete="cc-name"
                />

                <Field
                  label="Card number"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={updateField}
                  error={errors.cardNumber}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                />

                <div className="checkout-grid">
                  <Field
                    label="Expiry"
                    name="expiry"
                    value={form.expiry}
                    onChange={updateField}
                    error={errors.expiry}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                  />

                  <Field
                    label="CVV"
                    name="cvv"
                    value={form.cvv}
                    onChange={updateField}
                    error={errors.cvv}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                  />
                </div>
              </div>

              <label className="checkout-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                />

                <span>
                  I agree to the terms and conditions and confirm that my
                  information is correct.
                </span>
              </label>

              {submitError && (
                <div className="checkout-submit-error" role="alert">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                className="checkout-submit"
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : `Pay ${formatCurrency(total)}`}
              </button>
            </section>

            <aside className="checkout-summary">
              <h2>Order summary</h2>

              <div className="checkout-items">
                {items.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div className="checkout-item-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span>📦</span>
                      )}

                      <span className="checkout-quantity">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="checkout-item-info">
                      <strong>{item.name}</strong>
                      <span>
                        {formatCurrency(Number(item.price))}
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(
                        Number(item.price) * Number(item.quantity)
                      )}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong>
                    {shipping === 0
                      ? "Free"
                      : formatCurrency(shipping)}
                  </strong>
                </div>

                <div>
                  <span>Tax</span>
                  <strong>{formatCurrency(tax)}</strong>
                </div>

                <div className="checkout-total">
                  <span>Total</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>

              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="free-shipping-message">
                  Add{" "}
                  {formatCurrency(
                    FREE_SHIPPING_THRESHOLD - subtotal
                  )}{" "}
                  more for free shipping.
                </p>
              )}
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

/*
Optional CSS:

.checkout {
  min-height: 100vh;
  background: #f7f7f8;
  padding: 48px 20px;
  color: #171717;
}

.checkout-container {
  width: min(1100px, 100%);
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 32px;
}

.checkout-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

.checkout-header p {
  margin: 0;
  color: #6b7280;
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 24px;
  align-items: start;
}

.checkout-main {
  display: grid;
  gap: 20px;
}

.checkout-card,
.checkout-summary {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.checkout-card h2,
.checkout-summary h2 {
  margin: 0 0 20px;
  font-size: 18px;
}

.checkout-field {
  display: grid;
  gap: 7px;
  margin-bottom: 16px;
}

.checkout-field label {
  font-size: 14px;
  font-weight: 600;
}

.checkout-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  outline: none;
  font: inherit;
}

.checkout-field input:focus {
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, .08);
}

.checkout-field input[aria-invalid="true"] {
  border-color: #dc2626;
}

.checkout-error {
  color: #dc2626;
  font-size: 12px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkout-grid-3 {
  grid-template-columns: 1.4fr .8fr .8fr;
}

.payment-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.payment-heading p {
  margin: -12px 0 20px;
  color: #6b7280;
  font-size: 13px;
}

.checkout-summary {
  position: sticky;
  top: 20px;
}

.checkout-items {
  display: grid;
  gap: 16px;
}

.checkout-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
}

.checkout-item-image {
  position: relative;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  overflow: visible;
  border-radius: 10px;
  background: #f3f4f6;
}

.checkout-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.checkout-quantity {
  position: absolute;
  top: -7px;
  right: -7px;
  min-width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: #111827;
  color: white;
  font-size: 11px;
}

.checkout-item-info {
  display: grid;
  gap: 4px;
}

.checkout-item-info strong {
  font-size: 14px;
}

.checkout-item-info span {
  color: #6b7280;
  font-size: 13px;
}

.checkout-totals {
  display: grid;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.checkout-totals > div {
  display: flex;
  justify-content: space-between;
}

.checkout-total {
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 18px;
}

.free-shipping-message {
  margin: 18px 0 0;
  padding: 12px;
  border-radius: 8px;
  background: #f0fdf4;
  color: #166534;
  font-size: 13px;
}

.checkout-terms {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 13px;
  color: #4b5563;
}

.checkout-terms input {
  margin-top: 2px;
}

.checkout-submit {
  width: 100%;
  margin-top: 16px;
  padding: 15px 20px;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.checkout-submit:hover {
  background: #000;
}

.checkout-submit:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.checkout-submit-error {
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

.checkout-empty {
  padding: 80px 20px;
  text-align: center;
}

@media (max-width: 800px) {
  .checkout {
    padding: 24px 14px;
  }

  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
    order: -1;
  }
}

@media (max-width: 520px) {
  .checkout-grid,
  .checkout-grid-3 {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .checkout-card,
  .checkout-summary {
    padding: 18px;
  }
}
*/
