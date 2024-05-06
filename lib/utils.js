import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}
export function generateTotal(item) {
  const quantity = parseFloat(item.quantity);
  const price = parseFloat(item.price);
  const tax = parseFloat(item.tax === "" ? 0 : item.tax);

  // Check if any of the values are NaN, and return 0 if so
  if (isNaN(quantity) || isNaN(price) || isNaN(tax)) {
    return 0;
  }

  // Calculate total including tax
  const total = quantity * price * (1 + tax / 100);
  return total.toFixed(2); // Return total with 2 decimal places
}


export function getCurrencyIcon(currencyCode) {
  console.log(currencyCode)
  switch (currencyCode.toUpperCase()) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    case "CHF":
      return "CHF";
    case "CNY":
      return "¥";
    case "SEK":
      return "kr";
    case "NZD":
      return "NZ$";
    case "INR":
      return "₹";
    case "BRL":
      return "R$";
    case "RUB":
      return "₽";
    case "KRW":
      return "₩";
    case "SGD":
      return "S$";
    case "ZAR":
      return "R";
    case "BGN":
      return "лв";
    case "HKD":
      return "HK$";
    case "IDR":
      return "Rp";
    case "TRY":
      return "₺";
    case "MXN":
      return "Mex$";
    case "NOK":
      return "kr";
    case "DKK":
      return "kr";
    case "PLN":
      return "zł";
    case "THB":
      return "฿";
    case "PHP":
      return "₱";
    case "MYR":
      return "RM";
    case "HUF":
      return "Ft";
    case "CZK":
      return "Kč";
    case "ILS":
      return "₪";
    case "CLP":
      return "$";
    case "ARS":
      return "$";
    case "COP":
      return "$";
    case "TWD":
      return "NT$";
    case "VND":
      return "₫";
    case "UAH":
      return "₴";
    case "EGP":
      return "E£";
    case "AED":
      return "د.إ";
    case "NGN":
      return "₦";
    case "QAR":
      return "﷼";
    case "CRC":
      return "₡";
    case "PEN":
      return "S/";
    case "SAR":
      return "﷼";
    case "HRK":
      return "kn";
    case "RON":
      return "lei";
    case "BOB":
      return "Bs.";
    case "PYG":
      return "₲";
    case "LKR":
      return "Rs";
    case "UYU":
      return "$U";
    case "BDT":
      return "৳";
    default:
      return "";
  }
}
