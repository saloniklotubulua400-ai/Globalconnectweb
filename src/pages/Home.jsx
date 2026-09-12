import { useMemo, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import CountrySelector from "../components/CountrySelector";
import PhoneInput from "../components/PhoneInput";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GlobalCoverageSection from "../components/Globe";
import "./Home.css";

const COUNTRIES = [
  { code: "KE", flag: "🇰🇪", name: "Kenya", dialCode: "254", currency: "KES", rate: 129.5, operators: ["Safaricom", "Airtel", "Telkom"] },
  { code: "GH", flag: "🇬🇭", name: "Ghana", dialCode: "233", currency: "GHS", rate: 15.2, operators: ["MTN", "Telecel", "AirtelTigo"] },
  { code: "NG", flag: "🇳🇬", name: "Nigeria", dialCode: "234", currency: "NGN", rate: 1480.0, operators: ["MTN", "Airtel", "Glo", "9mobile"] },
  { code: "ZA", flag: "🇿🇦", name: "South Africa", dialCode: "27", currency: "ZAR", rate: 18.1, operators: ["Vodacom", "MTN", "Cell C", "Telkom"] },
  { code: "UG", flag: "🇺🇬", name: "Uganda", dialCode: "256", currency: "UGX", rate: 3670.0, operators: ["MTN", "Airtel"] },
  { code: "TZ", flag: "🇹🇿", name: "Tanzania", dialCode: "255", currency: "TZS", rate: 2650.0, operators: ["Vodacom", "Airtel", "Tigo", "Halotel"] },
  { code: "US", flag: "🇺🇸", name: "United States", dialCode: "1", currency: "USD", rate: 1.0, operators: ["AT&T", "T-Mobile", "Verizon"] },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dialCode: "44", currency: "GBP", rate: 0.78, operators: ["EE", "O2", "Vodafone", "Three"] },
];

const POPULAR_DESTINATIONS = [
  { code: "KE", name: "Kenya", flag: "🇰🇪", badge: "Instant M-Pesa", color: "from-emerald-500/10 to-teal-500/10" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", badge: "0% Service Fee", color: "from-green-500/10 to-emerald-500/10" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", badge: "MTN & Telecel", color: "from-amber-500/10 to-yellow-500/10" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", badge: "4G/5G Ready", color: "from-blue-500/10 to-indigo-500/10" },
];

const REVIEWS = [
  {
    id: 1,
    name: "Amina K.",
    country: "🇰🇪 Kenya",
    text: "Sent airtime to my mother in Nairobi. It arrived before I even closed the confirmation screen!",
    stars: 5,
    tag: "Verified Transfer",
  },
  {
    id: 2,
    name: "David O.",
    country: "🇳🇬 Nigeria",
    text: "Very smooth interface. Data bundles land instantly every single time without delay.",
    stars: 5,
    tag: "Verified Transfer",
  },
  {
    id: 3,
    name: "Kwame B.",
    country: "🇬🇭 Ghana",
    text: "Best conversion rates on WhatsApp top-up. Customer service resolved my question in 2 minutes.",
    stars: 5,
    tag: "Verified Transfer",
  },
];

const PAYMENT_METHODS = [
  "💳 Visa", "💳 Mastercard", "📱 M-Pesa", "📲 Apple Pay", "🅿️ PayPal", "🌐 Google Pay", "⚡ Bank Transfer"
];

const AMOUNT_PRESETS = ["5", "10", "20", "50"];

const SERVICES = [
  { id: "airtime", icon: "📱", label: "Airtime", sub: "Instant mobile credit" },
  { id: "data", icon: "📶", label: "Data Bundles", sub: "High-speed internet" },
];

const FAQS = [
  {
    q: "How fast is the delivery?",
    a: "Top-ups land directly on the destination number in less than 15 seconds after payment confirmation.",
  },
  {
    q: "Which operators do you support?",
    a: "We support over 800+ global telecom operators, including Safaricom, MTN, Airtel, Vodacom, and AT&T.",
  },
  {
    q: "Are there any hidden transaction fees?",
    a: "No hidden fees. What you see on the ticket checkout total is exactly what you get charged.",
  },
];

export default function Home() {
  const [country, setCountry] = useState("KE");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("airtime");
  const [amount, setAmount] = useState("10");
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === country) || COUNTRIES[0],
    [country]
  );

  const currency = selectedCountry.currency;
  const localValue = useMemo(() => {
    const num = Number(amount) || 0;
    return (num * selectedCountry.rate).toLocaleString(undefined, { maximumFractionDigits: 0 });
  }, [amount, selectedCountry]);

  const formatAmount = (value) => {
    if (!value) return "$0";
    return `$${value} USD`;
  };

  function handleQuickCountrySelect(code) {
    setCountry(code);
    setErrors((e) => ({ ...e, country: undefined }));
    document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (!country) nextErrors.country = "Select a destination country.";
    if (!phone.replace(/\D/g, "")) nextErrors.phone = "Enter a valid phone number.";
    if (!amount || Number(amount) <= 0) {
      nextErrors.amount = "Choose or enter an amount.";
    }

    setErrors(nextErrors);
    setConfirmedOrder(null);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById("topup")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setConfirmedOrder({
      country: selectedCountry.name,
      flag: selectedCountry.flag,
      phone,
      service,
      amount,
      localValue,
      currency,
    });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-amber-400 selection:text-[#0E1330]">
      <Navbar />

      {/* LIVE TICKER */}
      <div className="bg-[#0A0D21] py-2.5 px-4 text-xs font-mono text-slate-300 border-b border-white/10 flex items-center overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap mx-auto">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <strong className="text-white">Live Activity:</strong> $20 Airtime sent to 🇰🇪 Kenya (Safaricom)
          </span>
          <span className="text-slate-600">|</span>
          <span>$10 Data sent to 🇳🇬 Nigeria (MTN)</span>
          <span className="text-slate-600">|</span>
          <span>$50 Airtime sent to 🇬🇭 Ghana (AirtelTigo)</span>
          <span className="text-slate-600">|</span>
          <span>$15 Airtime sent to 🇿🇦 South Africa (Vodacom)</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0E1330] pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          
          {/* HERO LEFT COLUMN */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Trusted Global Recharge Network
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Send Instant Credit <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Worldwide in Seconds.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Recharge mobile numbers instantly with Airtime, Data bundles, and eSIMs across 160+ countries with guaranteed instant delivery and bank-grade security.
            </p>

            {/* LIVE SUPPORTED OPERATORS BADGES */}
            <div className="mt-8">
              <p className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-3">
                Supported Networks in {selectedCountry.name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCountry.operators.map((op) => (
                  <span key={op} className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 border border-white/10 backdrop-blur-sm">
                    ⚡ {op}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-md">
              <div>
                <dt className="font-mono text-2xl font-black text-white sm:text-3xl">160+</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Countries</dd>
              </div>
              <div>
                <dt className="font-mono text-2xl font-black text-white sm:text-3xl">800+</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Operators</dd>
              </div>
              <div>
                <dt className="font-mono text-2xl font-black text-emerald-400 sm:text-3xl">&lt;15s</dt>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">Delivery Speed</dd>
              </div>
            </dl>
          </div>

          {/* HERO RIGHT FORM CARD */}
          <div id="topup" className="w-full">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:max-w-none">
              <div className="flex items-center justify-between bg-[#0E1330] px-6 py-4 text-white">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Sender</p>
                  <p className="font-display text-base font-bold text-amber-300">Ellites Global</p>
                </div>
                <RoutePath filled={Boolean(selectedCountry)} />
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Recipient</p>
                  <p className="font-display text-base font-bold text-white">
                    {selectedCountry.flag} {selectedCountry.name}
                  </p>
                </div>
              </div>

              {/* LIVE EXCHANGE RATE PREVIEW BAR */}
              <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200/60 flex items-center justify-between text-xs font-mono font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Calculated Payout:
                </span>
                <span className="text-amber-700 font-black text-sm">
                  ≈ {localValue} {currency}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5" noValidate>
                {confirmedOrder && (
                  <div role="status" className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900 shadow-sm animate-fade-in">
                    <p className="font-black text-emerald-800 flex items-center gap-2">
                      <span>✓</span> Order Processed Successfully!
                    </p>
                    <p className="mt-1 font-mono text-xs text-emerald-700">
                      Sent {formatAmount(confirmedOrder.amount)} ({confirmedOrder.localValue} {confirmedOrder.currency}) to {confirmedOrder.flag} {confirmedOrder.phone}
                    </p>
                  </div>
                )}

                <div>
                  <FieldLabel id="country-label">1. Select Destination Country</FieldLabel>
                  <CountrySelector
                    id="country-label"
                    value={country}
                    onChange={(value) => {
                      setCountry(value);
                      setErrors((e) => ({ ...e, country: undefined }));
                    }}
                    countries={COUNTRIES}
                  />
                  {errors.country && <FieldError>{errors.country}</FieldError>}
                </div>

                <div>
                  <FieldLabel id="phone-label">2. Recipient Phone Number</FieldLabel>
                  <PhoneInput
                    id="phone-label"
                    value={phone}
                    onChange={(value) => {
                      setPhone(value);
                      setErrors((e) => ({ ...e, phone: undefined }));
                    }}
                    dialCode={selectedCountry?.dialCode}
                    flag={selectedCountry?.flag}
                  />
                  {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </div>

                <div>
                  <FieldLabel id="service-label">3. Select Product</FieldLabel>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="service-label">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        role="radio"
                        aria-checked={service === s.id}
                        onClick={() => setService(s.id)}
                        className={`rounded-2xl border p-3.5 text-left transition-all ${
                          service === s.id
                            ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="text-2xl">{s.icon}</div>
                        <div className="mt-2 text-sm font-bold text-slate-900">{s.label}</div>
                        <div className="text-[11px] text-slate-500">{s.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel id="amount-label">4. Select Top-Up Amount</FieldLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {AMOUNT_PRESETS.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          setAmount(item);
                          setIsCustomAmount(false);
                          setErrors((e) => ({ ...e, amount: undefined }));
                        }}
                        className={`rounded-xl border py-3 font-mono text-sm font-black transition-all ${
                          !isCustomAmount && amount === item
                            ? "border-[#0E1330] bg-[#0E1330] text-amber-300 shadow-md"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ${item}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="1"
                    placeholder="Or enter custom amount in USD"
                    value={isCustomAmount ? amount : ""}
                    onFocus={() => setIsCustomAmount(true)}
                    onChange={(e) => {
                      setIsCustomAmount(true);
                      setAmount(e.target.value);
                      setErrors((err) => ({ ...err, amount: undefined }));
                    }}
                    className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                  {errors.amount && <FieldError>{errors.amount}</FieldError>}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-amber-400 py-4 font-display text-base font-black tracking-wide text-[#0E1330] shadow-xl shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.99]"
                >
                  SEND TOP-UP NOW →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL COVERAGE GLOBE SECTION */}
      <GlobalCoverageSection />

      {/* TRUSTED PAYMENT METHODS MARQUEE */}
      <section className="bg-white py-6 border-b border-slate-200 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 text-center mb-3">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
            Securely pay with 20+ supported global payment channels
          </p>
        </div>
        <div className="flex items-center justify-around gap-8 whitespace-nowrap opacity-75 font-bold text-slate-600 text-sm overflow-x-auto py-2 px-4">
          {PAYMENT_METHODS.map((method, idx) => (
            <span key={idx} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
              {method}
            </span>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
                Popular Countries
              </p>
              <h2 className="text-3xl font-bold font-display text-slate-900 mt-1">
                Frequently Selected Destinations
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Tap any popular destination below to automatically set up the transfer parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.code}
                type="button"
                onClick={() => handleQuickCountrySelect(dest.code)}
                className={`group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br ${dest.color} p-5 transition-all hover:border-amber-400 hover:shadow-lg hover:-translate-y-1 text-left bg-white`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl shadow-sm">{dest.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-amber-600 transition">
                      {dest.name}
                    </h3>
                    <span className="inline-block mt-0.5 rounded-full bg-slate-900/5 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-600">
                      {dest.badge}
                    </span>
                  </div>
                </div>
                <span className="text-slate-300 group-hover:text-amber-500 font-bold text-xl transition">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
            Comprehensive Digital Catalog
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything your family & friends need.
          </h2>
          <p className="mt-3 text-slate-600">
            Send airtime, high-speed mobile bundles, or global eSIM packages instantly from one integrated dashboard.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            icon="📱"
            title="Mobile Airtime"
            description="Direct credit deposits for prepaid lines on over 800 global networks."
            color="blue"
            href="#topup"
          />
          <ServiceCard
            icon="📶"
            title="Internet Data"
            description="High-speed 4G/5G data packages sent straight to mobile numbers."
            color="green"
            href="#topup"
          />
          <ServiceCard
            icon="🌐"
            title="Travel eSIMs"
            description="Instant digital connectivity profiles for international travelers."
            color="purple"
          />
          <ServiceCard
            icon="🎁"
            title="Digital Vouchers"
            description="Instant retail and gaming gift card vouchers delivered online."
            color="orange"
          />
        </div>
      </section>

      {/* TRUST & SECURITY GUARANTEES */}
      <section className="bg-[#0E1330] text-white py-16 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10">
          <div className="grid gap-10 sm:grid-cols-3 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 text-3xl mb-4">
                🔒
              </div>
              <h3 className="font-bold text-lg">Bank-Grade Encryption</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                All transactions are processed using 256-bit SSL encrypted financial gateways.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 text-3xl mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-lg">Instant Delivery Guarantee</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Top-ups land directly on target phones within 15 seconds of payment authorization.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 text-3xl mb-4">
                🎧
              </div>
              <h3 className="font-bold text-lg">24/7 Dedicated Support</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Our support team is active round-the-clock via email and live WhatsApp chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
              Simple 3-Step Process
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900">
              How to Send Credit in Seconds
            </h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            <Step number="1" title="Select Country & Number">
              Enter the recipient's phone number. Our system automatically detects the operator network.
            </Step>
            <Step number="2" title="Choose Amount or Package">
              Pick your preferred airtime value or high-speed data package with transparent exchange rates.
            </Step>
            <Step number="3" title="Pay & Instant Receive">
              Pay securely using your preferred card or mobile wallet. Delivery is completed immediately.
            </Step>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS & SOCIAL PROOF */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
            Real Customer Feedback
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Trusted by Thousands of Families Worldwide
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((rev) => (
            <div key={rev.id} className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 text-lg">
                    {"★".repeat(rev.stars)}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                    {rev.tag}
                  </span>
                </div>
                <p className="text-slate-700 text-base leading-relaxed font-medium">"{rev.text}"</p>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{rev.name}</span>
                  <span className="text-xs text-slate-400">{rev.country}</span>
                </div>
                <span className="text-2xl">💬</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 text-base"
              >
                <span>{faq.q}</span>
                <span className="text-amber-500 font-mono text-xl font-black">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE APP PROMO */}
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 p-8 text-[#0E1330] shadow-xl sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="rounded-full bg-[#0E1330] px-3.5 py-1 text-xs font-extrabold text-amber-300 uppercase tracking-widest">
              Mobile App Coming Soon
            </span>
            <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight">
              Recharge Faster directly from your phone
            </h3>
            <p className="mt-2 text-slate-950 max-w-xl font-medium text-base">
              Save recurring contacts, set up automatic monthly top-ups, and get instant access to app-exclusive discount rates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <button className="rounded-xl bg-[#0E1330] px-6 py-4 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition shadow-lg">
              Download App Store
            </button>
            <button className="rounded-xl bg-[#0E1330] px-6 py-4 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition shadow-lg">
              Download Google Play
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#0E1330] py-16">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to top up a number now?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Instant delivery, zero stress, and complete peace of mind.
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("topup")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 rounded-2xl bg-amber-400 px-8 py-4 text-sm font-black text-[#0E1330] shadow-xl transition hover:bg-amber-300 active:scale-95"
          >
            START TRANSFER NOW →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FieldLabel({ children, id }) {
  return (
    <label id={id} className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-600">
      {children}
    </label>
  );
}

function FieldError({ children }) {
  return <p role="alert" className="mt-1.5 text-xs font-semibold text-red-500">{children}</p>;
}

function Step({ number, title, children }) {
  return (
    <div className="relative text-center p-6 rounded-3xl bg-slate-50 border border-slate-200/60">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0E1330] font-mono text-xl font-black text-amber-300 shadow-md">
        {number}
      </div>
      <h3 className="mt-5 font-display font-bold text-slate-900 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function RoutePath({ filled }) {
  return (
    <div className="flex flex-1 items-center px-4" aria-hidden="true">
      <span className="h-2 w-2 shrink-0 rounded-full bg-amber-300" />
      <span className={`mx-1 h-px flex-1 border-t-2 border-dashed ${filled ? "border-amber-300" : "border-slate-700"}`} />
      <span className="shrink-0 text-xs">✈</span>
      <span className={`mx-1 h-px flex-1 border-t-2 border-dashed ${filled ? "border-amber-300" : "border-slate-700"}`} />
      <span className="h-2 w-2 shrink-0 rounded-full bg-amber-300" />
    </div>
  );
}