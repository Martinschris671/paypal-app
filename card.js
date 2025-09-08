document.addEventListener("DOMContentLoaded", () => {
  //======================================================================
  // 1. GATHER ALL HTML ELEMENTS
  //======================================================================
  const cardNumberInput = document.getElementById("card-number");
  const cardExpiryInput = document.getElementById("card-expiry");
  const cardCvvInput = document.getElementById("card-cvv");
  const cardNumberError = document.getElementById("card-number-error");
  const cardExpiryError = document.getElementById("card-expiry-error");
  const cardCvvError = document.getElementById("card-cvv-error");

  // Dynamic Content Container
  const cardsContainer = document.getElementById("cards-container");

  //======================================================================
  // 2. DEFINE HELPER FUNCTIONS
  //======================================================================

  const resetForm = () => {
    if (cardNumberInput) cardNumberInput.value = "";
    if (cardExpiryInput) cardExpiryInput.value = "";
    if (cardCvvInput) cardCvvInput.value = "";
    [cardNumberInput, cardExpiryInput, cardCvvInput].forEach((input) => {
      if (input) input.classList.remove("input-error");
    });
    [cardNumberError, cardExpiryError, cardCvvError].forEach((error) => {
      if (error) error.textContent = "";
    });
  };

  const fields = [
    { input: cardNumberInput, error: cardNumberError },
    { input: cardExpiryInput, error: cardExpiryError },
    { input: cardCvvInput, error: cardCvvError },
  ];

  fields.forEach(({ input, error }) => {
    if (input) input.classList.remove("input-error");
    if (error) error.textContent = "";
  });

  const cardNumber = cardNumberInput.value.replace(/\s/g, "");
  const cardExpiry = cardExpiryInput.value;
  const cardCvv = cardCvvInput.value;

  if (!cardNumber || cardNumber.length !== 16 || !/^\d{16}$/.test(cardNumber)) {
    isValid = false;
    cardNumberInput.classList.add("input-error");
    cardNumberError.textContent = "Please enter a valid 16-digit card number.";
  }
  if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
    isValid = false;
    cardExpiryInput.classList.add("input-error");
    cardExpiryError.textContent = "Please use MM/YY format.";
  }
  if (!cardCvv || !/^\d{3,4}$/.test(cardCvv)) {
    isValid = false;
    cardCvvInput.classList.add("input-error");
    cardCvvError.textContent = "Enter a valid 3 or 4-digit CVV.";
  }

  // --- Input Formatting Listeners ---
  if (cardNumberInput)
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").substring(0, 16);
      e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
    });
  if (cardExpiryInput)
    cardExpiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
      e.target.value = value;
    });
  //======================================================================
  // 4. INITIALIZE THE VIEW ON PAGE LOAD
  //======================================================================
});
