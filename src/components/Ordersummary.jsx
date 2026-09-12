import "./OrderSummary.css";

export default function OrderSummary({
  service = "Mobile Top Up",
  country = "Kenya",
  phone = "",
  operator = "",
  amount = 0,
  fee = 0,
  currency = "USD",
}) {
  const subtotal = Number(amount) || 0;
  const serviceFee = Number(fee) || 0;
  const total = subtotal + serviceFee;

  const formatMoney = (value) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  const hasPhone = phone.trim().length > 0;
  const hasOperator = operator.trim().length > 0;
  const hasAmount = subtotal > 0;

  return (
    <div className="order-summary-card">
      <h2 className="summary-title">Order Summary</h2>

      <div className="summary-content">
        {/* Service */}
        <div className="summary-row flex-between">
          <div>
            <p className="field-label">Service</p>
            <p className="field-value">{service}</p>
          </div>
          <span className="country-badge">{country}</span>
        </div>

        {/* Recipient */}
        <div className="summary-row">
          <p className="field-label">Recipient</p>
          <p className={`field-value ${!hasPhone ? "empty" : ""}`}>
            {hasPhone ? phone : "Not provided yet"}
          </p>
        </div>

        {/* Operator */}
        <div className="summary-row">
          <p className="field-label">Operator</p>
          <p className={`field-value ${!hasOperator ? "empty" : ""}`}>
            {hasOperator ? operator : "Not selected yet"}
          </p>
        </div>

        {/* Divider */}
        <div className="summary-divider" />

        {/* Amount */}
        <div className="summary-row flex-between text-sm">
          <span className="text-secondary">Service amount</span>
          <span className={`field-value ${!hasAmount ? "empty" : ""}`}>
            {formatMoney(subtotal)}
          </span>
        </div>

        {/* Fee */}
        <div className="summary-row flex-between text-sm">
          <span className="text-secondary">Service fee</span>
          <span className="field-value">{formatMoney(serviceFee)}</span>
        </div>

        {/* Total Box */}
        <div className="total-box">
          <div className="flex-between">
            <span className="total-label">Total</span>
            <span className="total-amount">{formatMoney(total)}</span>
          </div>

          {!hasAmount && (
            <p className="total-hint">Enter an amount to see the total</p>
          )}
        </div>
      </div>
    </div>
  );
}