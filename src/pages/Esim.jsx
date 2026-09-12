import React, { useMemo, useState } from "react";
import "./Esim.css";

const plans = [
  {
    id: "1gb",
    name: "1 GB",
    duration: "7 days",
    price: 4.99,
    description: "Best for short trips and light usage.",
  },
  {
    id: "5gb",
    name: "5 GB",
    duration: "15 days",
    price: 14.99,
    description: "Great for maps, messaging, and social media.",
  },
  {
    id: "10gb",
    name: "10 GB",
    duration: "30 days",
    price: 24.99,
    description: "Ideal for regular travel and streaming.",
    popular: true,
  },
  {
    id: "20gb",
    name: "20 GB",
    duration: "30 days",
    price: 39.99,
    description: "For heavy travelers and frequent hotspot use.",
  },
];

const features = [
  "Instant eSIM delivery",
  "No physical SIM required",
  "Easy activation",
  "4G/LTE connectivity",
  "Keep your existing SIM active",
];

export default function Esim({
  country = "United States",
  countryCode = "US",
  network = "4G/LTE",
  onBuy,
}) {
  const [selectedPlan, setSelectedPlan] = useState(plans[2]);
  const [quantity, setQuantity] = useState(1);
  const [showInstructions, setShowInstructions] = useState(false);

  const total = useMemo(
    () => selectedPlan.price * quantity,
    [selectedPlan, quantity]
  );

  const handleBuy = () => {
    const item = {
      id: `esim-${countryCode.toLowerCase()}-${selectedPlan.id}`,
      name: `${country} eSIM — ${selectedPlan.name}`,
      price: selectedPlan.price,
      quantity,
      image: `/images/esim-${countryCode.toLowerCase()}.jpg`,
      metadata: {
        country,
        countryCode,
        data: selectedPlan.name,
        duration: selectedPlan.duration,
        network,
      },
    };

    if (onBuy) {
      onBuy(item);
      return;
    }

    console.log("Add to cart:", item);
  };

  return (
    <main className="esim-page">
      <div className="esim-container">
        <section className="esim-hero">
          <div className="esim-visual">
            <div className="esim-sim-card">
              <span className="esim-sim-chip" />
              <span className="esim-logo">eSIM</span>
              <span className="esim-country">{country}</span>
            </div>
          </div>

          <div className="esim-content">
            <div className="esim-breadcrumb">
              Home / eSIM / {country}
            </div>

            <span className="esim-badge">INSTANT DELIVERY</span>

            <h1>{country} eSIM</h1>

            <p className="esim-description">
              Stay connected while traveling with a fast, reliable
              eSIM. No physical SIM card or store visit required.
            </p>

            <div className="esim-meta">
              <div>
                <span>Network</span>
                <strong>{network}</strong>
              </div>

              <div>
                <span>Activation</span>
                <strong>Instant</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>Email</strong>
              </div>
            </div>

            <div className="esim-plans">
              <h2>Choose your plan</h2>

              <div className="esim-plan-grid">
                {plans.map((plan) => {
                  const selected = selectedPlan.id === plan.id;

                  return (
                    <button
                      type="button"
                      key={plan.id}
                      className={`esim-plan ${
                        selected ? "selected" : ""
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                      aria-pressed={selected}
                    >
                      {plan.popular && (
                        <span className="esim-popular">
                          Most popular
                        </span>
                      )}

                      <span className="esim-plan-data">
                        {plan.name}
                      </span>

                      <span className="esim-plan-duration">
                        {plan.duration}
                      </span>

                      <strong className="esim-plan-price">
                        ${plan.price.toFixed(2)}
                      </strong>

                      <span className="esim-plan-description">
                        {plan.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="esim-order">
              <div className="esim-quantity">
                <span>Quantity</span>

                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => value + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="esim-total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              type="button"
              className="esim-buy"
              onClick={handleBuy}
            >
              Buy eSIM — ${total.toFixed(2)}
            </button>

            <p className="esim-secure">
              🔒 Secure checkout · Instant email delivery
            </p>
          </div>
        </section>

        <section className="esim-features">
          <h2>Everything you need to stay connected</h2>

          <div className="esim-feature-grid">
            {features.map((feature) => (
              <div className="esim-feature" key={feature}>
                <span className="esim-check">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="esim-how-it-works">
          <h2>How it works</h2>

          <div className="esim-steps">
            <div>
              <span>1</span>
              <h3>Choose a plan</h3>
              <p>
                Select the amount of data and validity that fits
                your trip.
              </p>
            </div>

            <div>
              <span>2</span>
              <h3>Receive your eSIM</h3>
              <p>
                Your eSIM installation details are delivered
                digitally after payment.
              </p>
            </div>

            <div>
              <span>3</span>
              <h3>Scan and activate</h3>
              <p>
                Scan the QR code on your compatible device and
                follow the setup instructions.
              </p>
            </div>
          </div>
        </section>

        <section className="esim-help">
          <button
            type="button"
            onClick={() =>
              setShowInstructions((visible) => !visible)
            }
            aria-expanded={showInstructions}
          >
            {showInstructions
              ? "Hide installation instructions"
              : "Show installation instructions"}
          </button>

          {showInstructions && (
            <div className="esim-instructions">
              <h2>Installation instructions</h2>

              <ol>
                <li>Make sure your device supports eSIM.</li>
                <li>Connect to Wi-Fi.</li>
                <li>Open your device's cellular settings.</li>
                <li>Add a new eSIM/mobile plan.</li>
                <li>Scan the QR code from your delivery email.</li>
                <li>Follow the activation prompts.</li>
              </ol>

              <p>
                Keep your original SIM enabled if you want to
                continue receiving calls and messages on your
                normal number.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/*
Suggested CSS:

.esim-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
  padding: 48px 20px;
}

.esim-container {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.esim-hero {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 64px;
  align-items: center;
}

.esim-visual {
  display: grid;
  place-items: center;
  min-height: 420px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 30% 20%, #6366f1, transparent 35%),
    linear-gradient(135deg, #111827, #312e81);
}

.esim-sim-card {
  width: min(300px, 70%);
  aspect-ratio: 1.58;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 18px;
  color: white;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 30px 60px rgba(0, 0, 0, .3);
  transform: rotate(-6deg);
}

.esim-sim-chip {
  width: 48px;
  height: 38px;
  border-radius: 7px;
  background: #facc15;
}

.esim-logo {
  align-self: flex-end;
  font-size: 24px;
  font-weight: 800;
}

.esim-country {
  font-size: 16px;
  font-weight: 600;
}

.esim-breadcrumb {
  margin-bottom: 20px;
  color: #64748b;
  font-size: 13px;
}

.esim-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .05em;
}

.esim-content h1 {
  margin: 14px 0 12px;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1;
}

.esim-description {
  max-width: 620px;
  color: #64748b;
  font-size: 17px;
  line-height: 1.7;
}

.esim-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 28px 0;
}

.esim-meta div {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
}

.esim-meta span,
.esim-meta strong {
  display: block;
}

.esim-meta span {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 12px;
}

.esim-meta strong {
  font-size: 14px;
}

.esim-plans h2 {
  margin-bottom: 12px;
  font-size: 18px;
}

.esim-plan-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.esim-plan {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  text-align: left;
  cursor: pointer;
}

.esim-plan:hover,
.esim-plan.selected {
  border-color: #6366f1;
}

.esim-plan.selected {
  background: #f5f3ff;
}

.esim-popular {
  position: absolute;
  top: -10px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #6366f1;
  color: white;
  font-size: 10px;
  font-weight: 700;
}

.esim-plan-data {
  font-size: 22px;
  font-weight: 800;
}

.esim-plan-duration,
.esim-plan-description {
  color: #64748b;
  font-size: 12px;
}

.esim-plan-price {
  margin: 12px 0 5px;
  font-size: 20px;
}

.esim-plan-description {
  line-height: 1.5;
}

.esim-order {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.esim-quantity,
.esim-total {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  overflow: hidden;
  background: white;
}

.quantity-control button,
.quantity-control span {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  background: white;
}

.quantity-control button {
  cursor: pointer;
  font-size: 18px;
}

.esim-total strong {
  font-size: 24px;
}

.esim-buy {
  width: 100%;
  margin-top: 18px;
  padding: 16px;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: white;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.esim-buy:hover {
  background: #000;
}

.esim-secure {
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

.esim-features,
.esim-how-it-works,
.esim-help {
  margin-top: 70px;
}

.esim-features h2,
.esim-how-it-works h2 {
  margin-bottom: 24px;
  text-align: center;
}

.esim-feature-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.esim-feature {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 14px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 13px;
}

.esim-check {
  color: #16a34a;
  font-size: 20px;
  font-weight: 800;
}

.esim-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.esim-steps > div {
  padding: 24px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
}

.esim-steps span {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  background: #6366f1;
  color: white;
  font-weight: 800;
}

.esim-steps p,
.esim-instructions p {
  color: #64748b;
  line-height: 1.6;
}

.esim-help {
  text-align: center;
}

.esim-help > button {
  padding: 12px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  cursor: pointer;
}

.esim-instructions {
  max-width: 700px;
  margin: 20px auto;
  padding: 24px;
  border-radius: 16px;
  background: white;
  text-align: left;
}

@media (max-width: 800px) {
  .esim-page {
    padding: 24px 14px;
  }

  .esim-hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .esim-feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .esim-steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .esim-plan-grid,
  .esim-meta,
  .esim-feature-grid {
    grid-template-columns: 1fr;
  }

  .esim-order {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }
}
*/
