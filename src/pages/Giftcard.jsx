import React, { useMemo, useState } from "react";

const PRESET_AMOUNTS = [25, 50, 100, 150, 250];

const initialForm = {
  amount: 50,
  recipientName: "",
  recipientEmail: "",
  senderName: "",
  message: "",
  deliveryDate: "",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function GiftCard({
  onAddToCart,
  currency = "USD",
}) {
  const [form, setForm] = useState(initialForm);
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState({});

  const amount = useMemo(() => {
    if (customAmount !== "") {
      const value = Number(customAmount);
      return Number.isFinite(value) ? value : 0;
    }

    return Number(form.amount);
  }, [customAmount, form.amount]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const chooseAmount = (value) => {
    setCustomAmount("");

    setForm((current) => ({
      ...current,
      amount: value,
    }));

    setErrors((current) => ({
      ...current,
      amount: "",
    }));
  };

  const updateCustomAmount = (event) => {
    const value = event.target.value;

    setCustomAmount(value);

    setForm((current) => ({
      ...current,
      amount: 0,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!amount || amount < 10 || amount > 1000) {
      nextErrors.amount =
        "Choose an amount between $10 and $1,000.";
    }

    if (!form.recipientName.trim()) {
      nextErrors.recipientName = "Recipient name is required.";
    }

    if (!form.recipientEmail.trim()) {
      nextErrors.recipientEmail =
        "Recipient email is required.";
    } else if (
      !/^\S+@\S+\.\S+$/.test(form.recipientEmail)
    ) {
      nextErrors.recipientEmail =
        "Enter a valid email address.";
    }

    if (!form.senderName.trim()) {
      nextErrors.senderName = "Your name is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const giftCard = {
      id: `gift-card-${Date.now()}`,
      name: `${formatCurrency(amount)} Gift Card`,
      price: amount,
      quantity: 1,

      metadata: {
        type: "gift-card",
        amount,
        currency,
        recipientName: form.recipientName.trim(),
        recipientEmail: form.recipientEmail.trim(),
        senderName: form.senderName.trim(),
        message: form.message.trim(),
        deliveryDate: form.deliveryDate || null,
      },
    };

    if (onAddToCart) {
      onAddToCart(giftCard);
    }
  };

  return (
    <main className="gift-card-page">
      <div className="gift-card-container">
        <section className="gift-card-hero">
          <div className="gift-card-preview">
            <div className="gift-card-design">
              <span className="gift-card-brand">
                YOUR BRAND
              </span>

              <div>
                <span className="gift-card-label">
                  GIFT CARD
                </span>

                <strong>
                  {formatCurrency(amount || 0)}
                </strong>
              </div>

              <span className="gift-card-recipient">
                For {form.recipientName || "Someone special"}
              </span>
            </div>
          </div>

          <div className="gift-card-content">
            <span className="gift-card-badge">
              THE PERFECT GIFT
            </span>

            <h1>Give the gift of choice</h1>

            <p className="gift-card-intro">
              Send a digital gift card instantly by email.
              Choose an amount, add a personal message, and
              you're ready to go.
            </p>

            <form onSubmit={handleSubmit}>
              <section className="gift-card-section">
                <h2>Choose an amount</h2>

                <div className="gift-card-amounts">
                  {PRESET_AMOUNTS.map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        !customAmount &&
                        Number(form.amount) === value
                          ? "active"
                          : ""
                      }
                      onClick={() => chooseAmount(value)}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>

                <label className="gift-card-field">
                  <span>Custom amount</span>

                  <div className="gift-card-input-prefix">
                    <span>$</span>

                    <input
                      type="number"
                      min="10"
                      max="1000"
                      step="1"
                      value={customAmount}
                      onChange={updateCustomAmount}
                      placeholder="Enter amount"
                    />
                  </div>
                </label>

                {errors.amount && (
                  <p className="gift-card-error">
                    {errors.amount}
                  </p>
                )}
              </section>

              <section className="gift-card-section">
                <h2>Recipient</h2>

                <label className="gift-card-field">
                  <span>Recipient name</span>

                  <input
                    name="recipientName"
                    value={form.recipientName}
                    onChange={updateField}
                    placeholder="Jane Smith"
                    autoComplete="name"
                  />

                  {errors.recipientName && (
                    <small>{errors.recipientName}</small>
                  )}
                </label>

                <label className="gift-card-field">
                  <span>Recipient email</span>

                  <input
                    name="recipientEmail"
                    type="email"
                    value={form.recipientEmail}
                    onChange={updateField}
                    placeholder="jane@example.com"
                    autoComplete="email"
                  />

                  {errors.recipientEmail && (
                    <small>{errors.recipientEmail}</small>
                  )}
                </label>
              </section>

              <section className="gift-card-section">
                <h2>Your message</h2>

                <label className="gift-card-field">
                  <span>Your name</span>

                  <input
                    name="senderName"
                    value={form.senderName}
                    onChange={updateField}
                    placeholder="Your name"
                  />

                  {errors.senderName && (
                    <small>{errors.senderName}</small>
                  )}
                </label>

                <label className="gift-card-field">
                  <span>Personal message</span>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={updateField}
                    placeholder="Happy birthday! Hope you enjoy it..."
                    maxLength={250}
                    rows={4}
                  />

                  <small>
                    {form.message.length}/250
                  </small>
                </label>

                <label className="gift-card-field">
                  <span>Delivery date</span>

                  <input
                    name="deliveryDate"
                    type="date"
                    value={form.deliveryDate}
                    onChange={updateField}
                  />

                  <small>
                    Leave blank to send after payment.
                  </small>
                </label>
              </section>

              <div className="gift-card-summary">
                <span>Gift card value</span>
                <strong>{formatCurrency(amount || 0)}</strong>
              </div>

              <button
                type="submit"
                className="gift-card-submit"
              >
                Continue to checkout
              </button>

              <p className="gift-card-secure">
                🔒 Secure payment · Digital delivery
              </p>
            </form>
          </div>
        </section>

        <section className="gift-card-benefits">
          <div>
            <span>⚡</span>
            <h3>Instant delivery</h3>
            <p>
              Send your gift card directly to the recipient's
              inbox.
            </p>
          </div>

          <div>
            <span>💳</span>
            <h3>Flexible amounts</h3>
            <p>
              Choose a preset value or enter your own amount.
            </p>
          </div>

          <div>
            <span>🎁</span>
            <h3>Personal message</h3>
            <p>
              Add a thoughtful message to make your gift
              special.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/*
Suggested CSS:

.gift-card-page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f8fafc;
  color: #0f172a;
}

.gift-card-container {
  width: min(1100px, 100%);
  margin: auto;
}

.gift-card-hero {
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  gap: 64px;
  align-items: start;
}

.gift-card-preview {
  position: sticky;
  top: 24px;
}

.gift-card-design {
  aspect-ratio: 1.6;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 22px;
  color: white;
  background:
    radial-gradient(circle at 20% 20%, #f472b6, transparent 35%),
    linear-gradient(135deg, #7c3aed, #ec4899);
  box-shadow: 0 25px 60px rgba(124, 58, 237, .25);
  overflow: hidden;
}

.gift-card-brand {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: .12em;
}

.gift-card-design > div {
  display: grid;
  gap: 4px;
}

.gift-card-label {
  font-size: 12px;
  opacity: .8;
}

.gift-card-design strong {
  font-size: clamp(32px, 5vw, 52px);
}

.gift-card-recipient {
  font-size: 14px;
  opacity: .9;
}

.gift-card-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #fce7f3;
  color: #be185d;
  font-size: 11px;
  font-weight: 800;
}

.gift-card-content h1 {
  margin: 14px 0 12px;
  font-size: clamp(36px, 5vw, 52px);
  line-height: 1.05;
}

.gift-card-intro {
  margin-bottom: 32px;
  color: #64748b;
  line-height: 1.7;
}

.gift-card-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e2e8f0;
}

.gift-card-section h2 {
  margin-bottom: 16px;
  font-size: 18px;
}

.gift-card-amounts {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}

.gift-card-amounts button {
  padding: 12px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  cursor: pointer;
  font-weight: 700;
}

.gift-card-amounts button:hover,
.gift-card-amounts button.active {
  border-color: #7c3aed;
  background: #f5f3ff;
  color: #6d28d9;
}

.gift-card-field {
  display: grid;
  gap: 7px;
  margin-bottom: 16px;
}

.gift-card-field > span {
  font-size: 14px;
  font-weight: 600;
}

.gift-card-field input,
.gift-card-field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  font: inherit;
  outline: none;
}

.gift-card-field textarea {
  resize: vertical;
}

.gift-card-field input:focus,
.gift-card-field textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, .08);
}

.gift-card-field small {
  color: #64748b;
  font-size: 12px;
}

.gift-card-field small:not(:last-child) {
  color: #dc2626;
}

.gift-card-input-prefix {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  overflow: hidden;
}

.gift-card-input-prefix span {
  padding-left: 14px;
  color: #64748b;
}

.gift-card-input-prefix input {
  border: 0;
  box-shadow: none;
}

.gift-card-error {
  margin: -8px 0 14px;
  color: #dc2626;
  font-size: 12px;
}

.gift-card-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 18px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
}

.gift-card-summary strong {
  font-size: 24px;
}

.gift-card-submit {
  width: 100%;
  padding: 16px;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: white;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.gift-card-submit:hover {
  background: #000;
}

.gift-card-secure {
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

.gift-card-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 70px;
}

.gift-card-benefits > div {
  padding: 24px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
}

.gift-card-benefits span {
  font-size: 24px;
}

.gift-card-benefits h3 {
  margin: 12px 0 6px;
}

.gift-card-benefits p {
  margin: 0;
  color: #64748b;
  line-height: 1.5;
  font-size: 14px;
}

@media (max-width: 800px) {
  .gift-card-page {
    padding: 24px 14px;
  }

  .gift-card-hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .gift-card-preview {
    position: static;
  }
}

@media (max-width: 520px) {
  .gift-card-amounts {
    grid-template-columns: repeat(3, 1fr);
  }

  .gift-card-benefits {
    grid-template-columns: 1fr;
  }
}
*/
