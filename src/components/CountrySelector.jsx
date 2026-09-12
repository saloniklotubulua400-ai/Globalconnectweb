import { useEffect, useMemo, useRef, useState } from "react";
import "./CountrySelector.css";

const COUNTRIES = [
  { code: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom" },
];

export default function CountrySelector({
  value,
  onChange,
  countries = COUNTRIES,
  label = "Country",
  placeholder = "Select country",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listboxId = useRef(
    `country-listbox-${Math.random().toString(36).slice(2, 9)}`
  ).current;

  const selected = useMemo(
    () => countries.find((c) => c.code === value) ?? null,
    [countries, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countries, query]);

  useEffect(() => {
    function handleClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!open || activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function openDropdown() {
    setOpen(true);
    setActiveIndex(
      Math.max(
        0,
        filtered.findIndex((c) => c.code === value)
      )
    );
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeDropdown() {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function selectCountry(country) {
    onChange(country.code);
    closeDropdown();
  }

  function handleKeyDown(e) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) selectCountry(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "Tab":
        closeDropdown();
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} className="country-selector">
      <label className="selector-label">{label}</label>

      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleKeyDown}
        className="selector-button"
      >
        <span className={selected ? "selected-value" : "placeholder-value"}>
          {selected ? (
            <>
              <span className="country-flag">{selected.flag}</span>
              {selected.name}
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className={`dropdown-arrow ${open ? "open" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="search-container">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search country..."
              className="search-input"
            />
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="country-list"
          >
            {filtered.length === 0 && (
              <li className="no-results">No countries match "{query}"</li>
            )}

            {filtered.map((country, index) => {
              const isSelected = country.code === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={country.code}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectCountry(country)}
                  className={`country-option ${isActive ? "active" : ""} ${
                    isSelected ? "selected" : ""
                  }`}
                >
                  <span className="country-flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                  <span className="country-code">{country.code}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}