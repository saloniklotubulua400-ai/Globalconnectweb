import { useId, useState } from "react";
import "./PhoneInput.css";

export default function PhoneInput({
  value,
  onChange,
  dialCode = "",
  flag = "",
  minDigits = 7,
  maxDigits = 15,
}) {
  const [touched, setTouched] = useState(false);
  const hintId = useId();
  const errorId = useId();

  const digitsOnly = value.replace(/\D/g, "");
  const isEmpty = digitsOnly.length === 0;
  const isValid = digitsOnly.length >= minDigits && digitsOnly.length <= maxDigits;
  const showError = touched && !isEmpty && !isValid;

  function handleChange(event) {
    const cleaned = event.target.value.replace(/[^\d\s]/g, "");
    onChange(cleaned);
  }

  return (
    <div className="phone-input-group">
      <label className="phone-label">
        Recipient phone number
      </label>

      <div className={`phone-input-container ${showError ? "error" : ""}`}>
        <div className="dial-code-badge">
          {flag && <span className="flag-icon">{flag}</span>}
          <span>+{dialCode || ""}</span>
        </div>

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="712 345 678"
          aria-invalid={showError}
          aria-describedby={showError ? errorId : hintId}
          className="phone-field"
        />

        {isValid && !isEmpty && (
          <div className="valid-checkmark" aria-hidden="true">
            ✓
          </div>
        )}
      </div>

      {showError ? (
        <p id={errorId} className="helper-text error">
          Enter a valid phone number ({minDigits}–{maxDigits} digits).
        </p>
      ) : (
        <p id={hintId} className="helper-text">
          Enter the recipient's number without the country code.
        </p>
      )}
    </div>
  );
}