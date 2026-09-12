import React, { useMemo, useState } from "react";

const PRESET_AMOUNTS = [5, 10, 20, 50, 100, 200];

const INITIAL_FORM = {
  phone: "",
  customAmount: "",
};

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function normalizePhone(value) {
  return value.replace(/[^\d+ ]/g, "").slice(0, 20);
}

export default function TopUp({
  currency = "USD",
  operator = "Mobile",
  onTopUp,
}) {
  const [amount, setAmount] = useState(20);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedAmount = useMemo(() => {
    if (form.customAmount !== "") {
      const value = Number(form.customAmount);

      return Number.isFinite(value) ? value : 0;
    }

    return amount;
  }, [amount, form.customAmount]);

  const updatePhone = (event) => {
    const value = normalizePhone(event.target.value);

    setForm((current) => ({
      ...current,
      phone: value,
    }));

    if (errors.phone) {
      setErrors((current) => ({
        ...current,
        phone: "",
      }));
    }
  };

  const chooseAmount = (value) => {
    setAmount(value);

    setForm((current) => ({
      ...current,
      customAmount: "",
    }));

    setErrors((current) => ({
      ...current,
      amount: "",
    }));
  };

  const updateCustomAmount = (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      customAmount: value,
    }));

    setErrors((current) => ({
      ...current,
      amount: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.phone.trim()) {
      nextErrors.phone = "Enter the mobile number.";
    } else if (form.phone.replace(/\D/g, "").length < 8) {
      nextErrors.phone = "Enter a valid mobile number.";
    }

    if (
      !selectedAmount ||
      selectedAmount < 1 ||
      selectedAmount > 1000
    ) {
      nextErrors.amount =
        "Choose an amount between $1 and $1,000.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const topUp = {
      id: `topup-${Date.now()}`,
      name: `${operator} Mobile Top Up`,
      price: selectedAmount,
      quantity: 1,

      metadata: {
        type: "mobile-topup",
        operator,
        phone: form.phone.trim(),
        amount: selectedAmount,
        currency,
      },
    };

    if (!onTopUp) {
      console.log("Top-up:", topUp);
      return;
    }

    setLoading(true);

    try {
      await onTopUp(topUp);
    } catch (error) {
      setErrors({
        submit:
          error?.message ||
          "We couldn't process the top-up. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="topup-page">
      <div className="topup-container">
        <section className="topup-hero">
          <div className="topup-visual">
            <div className="topup-phone">
              <div className="topup-speaker" />

              <div className="topup-screen">
                <span className="topup-signal">● ● ● ●</span>

                <div className="topup-balance">
                  <small>Top up</small>
                  <strong>
                    {formatCurrency(
                      selectedAmount || 0,
                      currency
                    )}
                  </strong>
                </div>

                <div className="topup-signal-card">
                  <span>Mobile</span>
                  <strong>{operator}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="topup-content">
            <span className="topup-badge">
              INSTANT MOBILE TOP UP
            </span>

            <h1>Recharge your phone</h1>

            <p className="topup-intro">
              Add airtime or mobile credit instantly. Enter
              the number, choose an amount, and we'll handle
              the rest.
            </p>

            <form onSubmit={handleSubmit}>
              <section className="topup-section">
                <h2>Mobile number</h2>

                <label className="topup-field">
                  <span>Phone number</span>

                  <input
                    type="tel"
                    value={form.phone}
                    onChange={updatePhone}
                    placeholder="+1 555 123 4567"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={Boolean(errors.phone)}
                  />

                  {errors.phone && (
                    <small>{errors.phone}</small>
                  )}
                </label>

                <p className="topup-hint">
                  Double-check the number before continuing.
                </p>
              </section>

              <section className="topup-section">
                <div className="topup-section-heading">
                  <h2>Choose amount</h2>
                  <span>Up to $1,000</span>
                </div>

                <div className="topup-amount-grid">
                  {PRESET_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={
                        !form.customAmount &&
                        amount === value
                          ? "active"
                          : ""
                      }
                      onClick={() => chooseAmount(value)}
                    >
                      {formatCurrency(value, currency)}
                    </button>
                  ))}
                </div>

                <label className="topup-field">
                  <span>Custom amount</span>

                  <div className="topup-amount-input">
                    <span>$</span>

                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      value={form.customAmount}
                      onChange={updateCustomAmount}
                      placeholder="Enter amount"
                    />
                  </div>
                </label>

                {errors.amount && (
                  <p className="topup-error">
                    {errors.amount}
                  </p>
                )}
              </section>

              <section className="topup-summary">
                <div>
                  <span>Phone</span>
                  <strong>
                    {form.phone || "Not entered"}
                  </strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    {formatCurrency(
                      selectedAmount || 0,
                      currency
                    )}
                  </strong>
                </div>
              </section>

              {errors.submit && (
                <div className="topup-submit-error" role="alert">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                className="topup-submit"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Continue — ${formatCurrency(
                      selectedAmount || 0,
                      currency
                    )}`}
              </button>

              <p className="topup-secure">
                🔒 Secure checkout · Fast delivery
              </p>
            </form>
          </div>
        </section>

        <section className="topup-benefits">
          <div>
            <span>⚡</span>
            <h3>Fast delivery</h3>
            <p>
              Your mobile credit is processed as quickly as
              possible.
            </p>
          </div>

          <div>
            <span>🌎</span>
            <h3>Travel friendly</h3>
            <p>
              Convenient top-ups when you're away from home.
            </p>
          </div>

          <div>
            <span>🔒</span>
            <h3>Secure payments</h3>
            <p>
              Complete your purchase through a secure checkout.
            </p>
          </div>
        </section>

        <section className="topup-help">
          <h2>Before you top up</h2>

          <div className="topup-checklist">
            <p>✓ Make sure the phone number is correct.</p>
            <p>✓ Confirm the selected amount.</p>
            <p>✓ Check that the mobile operator is supported.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

/*
Suggested CSS:

.topup-page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f8fafc;
  color: #0f172a;
}

.topup-container {
  width: min(1080px, 100%);
  margin: 0 auto;
}

.topup-hero {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 64px;
  align-items: center;
}

.topup-visual {
  min-height: 540px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  background:
    radial-gradient(circle at 25% 20%, #22c55e, transparent 30%),
    linear-gradient(145deg, #052e16, #166534);
  overflow: hidden;
}

.topup-phone {
  width: 260px;
  height: 500px;
  padding: 10px;
  border: 6px solid #111827;
  border-radius: 38px;
  background: #111827;
  box-shadow: 0 30px 70px rgba(0, 0, 0, .35);
  transform: rotate(-5deg);
}

.topup-speaker {
  width: 70px;
  height: 6px;
  margin: 3px auto 10px;
  border-radius: 999px;
  background: #374151;
}

.topup-screen {
  height: calc(100% - 20px);
  padding: 22px;
  box-sizing: border-box;
  border-radius: 28px;
  background: linear-gradient(160deg, #ecfdf5, #bbf7d0);
}

.topup-signal {
  color: #166534;
  font-size: 9px;
  letter-spacing: 4px;
}

.topup-balance {
  display: grid;
  gap: 6px;
  margin-top: 100px;
  text-align: center;
}

.topup-balance small {
  color: #166534;
}

.topup-balance strong {
  color: #052e16;
  font-size: 38px;
}

.topup-signal-card {
  display: grid;
  gap: 4px;
  margin-top: 50px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255,255,255,.7);
}

.topup-signal-card span {
  color: #64748b;
  font-size: 11px;
}

.topup-signal-card strong {
  font-size: 15px;
}

.topup-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 800;
}

.topup-content h1 {
  margin: 14px 0;
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.05;
}

.topup-intro {
  margin-bottom: 32px;
  color: #64748b;
  line-height: 1.7;
}

.topup-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #e2e8f0;
}

.topup-section h2 {
  margin: 0 0 14px;
  font-size: 18px;
}

.topup-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topup-section-heading span {
  color: #64748b;
  font-size: 12px;
}

.topup-field {
  display: grid;
  gap: 7px;
  margin-top: 14px;
}

.topup-field > span {
  font-size: 14px;
  font-weight: 600;
}

.topup-field input {
  width: 100%;
  box-sizing: border-box;
  padding: 13px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  font: inherit;
  outline: none;
}

.topup-field input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, .08);
}

.topup-field small,
.topup-hint {
  color: #64748b;
  font-size: 12px;
}

.topup-field small,
.topup-error {
  color: #dc2626;
}

.topup-amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
}

.topup-amount-grid button {
  padding: 13px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  color: #0f172a;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.topup-amount-grid button:hover,
.topup-amount-grid button.active {
  border-color: #16a34a;
  background: #f0fdf4;
  color: #166534;
}

.topup-amount-input {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  overflow: hidden;
}

.topup-amount-input > span {
  padding-left: 14px;
  color: #64748b;
}

.topup-amount-input input {
  border: 0;
  box-shadow: none;
}

.topup-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.topup-summary > div {
  display: grid;
  gap: 5px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.topup-summary span {
  color: #64748b;
  font-size: 12px;
}

.topup-summary strong {
  font-size: 15px;
}

.topup-submit {
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

.topup-submit:hover {
  background: #000;
}

.topup-submit:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.topup-submit-error {
  margin-bottom: 14px;
  padding: 12px;
  border-radius: 9px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
}

.topup-secure {
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

.topup-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 70px;
}

.topup-benefits > div {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: white;
}

.topup-benefits span {
  font-size: 24px;
}

.topup-benefits h3 {
  margin: 12px 0 6px;
}

.topup-benefits p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.topup-help {
  margin-top: 50px;
  padding: 28px;
  border-radius: 18px;
  background: #0f172a;
  color: white;
}

.topup-help h2 {
  margin-top: 0;
}

.topup-checklist {
  display: grid;
  gap: 8px;
}

.topup-checklist p {
  margin: 0;
  color: #cbd5e1;
}

@media (max-width: 800px) {
  .topup-page {
    padding: 24px 14px;
  }

  .topup-hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .topup-visual {
    min-height: 400px;
  }

  .topup-phone {
    transform: scale(.8) rotate(-5deg);
  }
}

@media (max-width: 520px) {
  .topup-summary,
  .topup-benefits {
    grid-template-columns: 1fr;
  }

  .topup-amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
*/
