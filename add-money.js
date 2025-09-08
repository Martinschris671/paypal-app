document.addEventListener("DOMContentLoaded", () => {
  let state = { currentBalance: 0, transactionHistory: [] };
  const MAX_AMOUNT = 99999.99;

  const elements = {
    amountInput: document.getElementById("amount-input"),
    balanceDisplay: document.getElementById("current-balance"),
    confirmBtn: document.getElementById("confirm-btn"),
    loadingOverlay: document.getElementById("loading-overlay"),
    successOverlay: document.getElementById("success-overlay"),
    successText: document.getElementById("success-text"),
    doneBtn: document.getElementById("done-btn"),
  };

  const storage = {
    getBalance: () =>
      parseFloat(localStorage.getItem("paypalBalance_v4") || "500.00"),
    saveBalance: (balance) =>
      localStorage.setItem("paypalBalance_v4", balance.toString()),
    getHistory: () =>
      JSON.parse(localStorage.getItem("paypalHistory_v4") || "[]"),
    saveHistory: (history) =>
      localStorage.setItem("paypalHistory_v4", JSON.stringify(history)),
  };

  const updateUI = () => {
    elements.balanceDisplay.textContent = `Balance: $${state.currentBalance.toLocaleString(
      "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;
    const amount =
      parseFloat(elements.amountInput.value.replace(/,/g, "")) || 0;
    elements.confirmBtn.disabled = amount <= 0;
  };

  const formatCurrency = (value) => {
    let sanitized = value.replace(/[^\d.]/g, "");
    let [integerPart, decimalPart] = sanitized.split(".");

    if (decimalPart !== undefined) sanitized = `${integerPart}.${decimalPart}`;
    if (parseFloat(sanitized) > MAX_AMOUNT) {
      integerPart = "99999";
      decimalPart = "99";
    }
    if (decimalPart && decimalPart.length > 2)
      decimalPart = decimalPart.substring(0, 2);

    const formattedInteger = parseInt(integerPart || "0").toLocaleString(
      "en-US"
    );
    return decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;
  };

  const handleTransaction = () => {
    const amount = parseFloat(elements.amountInput.value.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) return;

    elements.loadingOverlay.classList.add("visible");

    setTimeout(() => {
      const newBalance = state.currentBalance + amount;
      const newTransaction = {
        type: "add",
        amount,
        timestamp: new Date().toISOString(),
      };

      state.transactionHistory.push(newTransaction);
      state.currentBalance = newBalance;

      storage.saveBalance(state.currentBalance);
      storage.saveHistory(state.transactionHistory);

      const formattedAmount = `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      elements.successText.innerHTML = `You added <span>${formattedAmount}</span> to your balance`;

      elements.loadingOverlay.classList.remove("visible");
      elements.successOverlay.classList.add("visible");

      elements.amountInput.value = "";
      updateUI();
    }, 2000);
  };

  const initializePage = () => {
    state.currentBalance = storage.getBalance();
    state.transactionHistory = storage.getHistory();
    updateUI();
  };

  elements.amountInput.addEventListener("input", (e) => {
    const cursorPosition = e.target.selectionStart;
    const originalLength = e.target.value.length;
    const formatted = formatCurrency(e.target.value);
    e.target.value = formatted;
    const newLength = formatted.length;
    e.target.setSelectionRange(
      cursorPosition + (newLength - originalLength),
      cursorPosition + (newLength - originalLength)
    );
    updateUI();
  });

  elements.confirmBtn.addEventListener("click", handleTransaction);
  elements.doneBtn.addEventListener("click", () => {
    elements.successOverlay.classList.remove("visible");
  });

  initializePage();
});
