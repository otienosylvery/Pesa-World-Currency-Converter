import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./CurrencyConverter"

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1"); // store as string for better formatting control
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);
  const [currencies, setCurrencies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  // ✅ Format number with commas
  const formatNumber = (value) => {
    if (!value) return "";
    const [intPart, decimalPart] = value.toString().split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  // ✅ Handle input change (allow only numbers, commas, decimals)
  const handleAmountChange = (e) => {
    let value = e.target.value;

    // Remove all commas first
    value = value.replace(/,/g, "");

    // Allow only digits and one decimal
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // ✅ Convert amount safely to number (remove commas)
  const getCleanAmount = () => {
    return parseFloat(amount.replace(/,/g, "")) || 0;
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/currencies");
        const data = await response.json();
        setCurrencies(data || {});
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const convert = async () => {
      const cleanAmount = getCleanAmount();

      if (!cleanAmount || cleanAmount <= 0 || fromCurrency === toCurrency) {
        setResult(cleanAmount ? cleanAmount.toFixed(2) : "");
        return;
      }

      setIsConverting(true);
      try {
        const url = `https://api.frankfurter.app/latest?amount=${cleanAmount}&from=${fromCurrency}&to=${toCurrency}`;
        const response = await fetch(url);
        const data = await response.json();
        setResult(data.rates[toCurrency].toFixed(2));
      } catch (error) {
        console.error("Error converting currency:", error);
        setResult("Error");
      } finally {
        setIsConverting(false);
      }
    };
    convert();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (isLoading) return <p>Loading currencies...</p>;

  const sortedCurrencyCodes = Object.keys(currencies).sort();

  return (
    <div
      className="converter"
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Pesa World Currency Converter</h2>

      {/* ✅ Display formatted value, but keep raw value internally */}
      <input
        type="text"
        value={formatNumber(amount)}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        style={{ padding: "8px", fontSize: "16px", width: "100%" }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        >
          {sortedCurrencyCodes.map((code) => (
            <option key={code} value={code}>
              {code} - {currencies[code]}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleSwap}
          style={{ padding: "8px 12px", fontSize: "16px" }}
        >
          ⇅ Swap
        </button>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{ flex: 1, padding: "8px", fontSize: "16px" }}
        >
          {sortedCurrencyCodes.map((code) => (
            <option key={code} value={code}>
              {code} - {currencies[code]}
            </option>
          ))}
        </select>
      </div>

      {isConverting ? (
        <div className="spinner" style={{ textAlign: "center" }}></div>
      ) : (
        result && (
          <h3 style={{ textAlign: "center" }}>
            {formatNumber(getCleanAmount())} {fromCurrency} = {formatNumber(result)} {toCurrency}
          </h3>
        )
      )}
    </div>
  );
};

export default CurrencyConverter;
