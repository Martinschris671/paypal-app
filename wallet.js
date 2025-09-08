document.addEventListener("DOMContentLoaded", () => {
  // Modal Elements
  const backdrop = document.getElementById("modal-backdrop");
  const walletModal = document.getElementById("modal-add-to-wallet");
  const linkCardModal = document.getElementById("modal-link-card");
  const featureModal = document.getElementById("modal-feature-not-implemented"); // New modal

  // Button Elements
  const openWalletBtn = document.getElementById("open-wallet-modal-btn");
  const openLinkCardBtn = document.getElementById("open-link-card-btn");
  const openBankModalBtn = document.getElementById("open-bank-modal-btn"); // New button
  const linkCardBackBtn = document.getElementById("link-card-back-btn");
  const linkCardBtn = document.getElementById("link-card-btn"); // New button
  const allCloseBtns = document.querySelectorAll("[data-close-modal]");

  // Form Input Elements
  const cardNumberInput = document.getElementById("card-number");
  const cardExpiryInput = document.getElementById("card-expiry");
  const cardCvvInput = document.getElementById("card-cvv");

  // Error Message Elements
  const cardNumberError = document.getElementById("card-number-error");
  const cardExpiryError = document.getElementById("card-expiry-error");
  const cardCvvError = document.getElementById("card-cvv-error");

  // --- Modal Control Functions ---
  const showModal = (modalEl) => {
    backdrop.classList.add("visible");
    modalEl.classList.add("visible");
  };
  const hideModal = (modalEl) => {
    backdrop.classList.remove("visible");
    modalEl.classList.remove("visible");
  };

  // --- NEW Validation and Local Storage Logic ---
  const validateAndSaveCard = () => {
    let isValid = true;

    // Reset previous errors
    [cardNumberInput, cardExpiryInput, cardCvvInput].forEach((input) =>
      input.classList.remove("input-error")
    );
    [cardNumberError, cardExpiryError, cardCvvError].forEach((error) => {
      error.textContent = "";
      error.classList.remove("visible");
    });

    // 1. Validate Card Number
    const cardNumber = cardNumberInput.value.replace(/\s/g, ""); // Remove spaces
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      isValid = false;
      cardNumberInput.classList.add("input-error");
      cardNumberError.textContent =
        "Please enter a valid 16-digit card number.";
      cardNumberError.classList.add("visible");
    }

    // 2. Validate Expiry Date
    const cardExpiry = cardExpiryInput.value;
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(cardExpiry)) {
      isValid = false;
      cardExpiryInput.classList.add("input-error");
      cardExpiryError.textContent = "Please use MM/YY format.";
      cardExpiryError.classList.add("visible");
    }

    // 3. Validate CVV
    const cardCvv = cardCvvInput.value;
    if (cardCvv.length < 3 || cardCvv.length > 4 || !/^\d+$/.test(cardCvv)) {
      isValid = false;
      cardCvvInput.classList.add("input-error");
      cardCvvError.textContent = "Enter a valid 3 or 4-digit CVV.";
      cardCvvError.classList.add("visible");
    }

    // If all fields are valid, save to local storage
    if (isValid) {
      const cardDetails = {
        cardNumber: cardNumber.slice(-4), // Only store the last 4 digits for security
        cardExpiry: cardExpiry,
      };
      localStorage.setItem("linkedCardDetails", JSON.stringify(cardDetails));

      hideModal(linkCardModal); // Close modal on success
    }
  };

  // --- Event Listeners ---
  openWalletBtn.addEventListener("click", () => showModal(walletModal));
  openLinkCardBtn.addEventListener("click", () => {
    hideModal(walletModal);
    setTimeout(() => showModal(linkCardModal), 200);
  });

  // New listener for "Bank accounts"
  openBankModalBtn.addEventListener("click", () => {
    hideModal(walletModal);
    setTimeout(() => showModal(featureModal), 200);
  });

  allCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      const modalToClose = document.getElementById(modalId);
      if (modalToClose) hideModal(modalToClose);
    });
  });

  linkCardBackBtn.addEventListener("click", () => {
    hideModal(linkCardModal);
    setTimeout(() => showModal(walletModal), 200);
  });

  // New listener for the final "Link Card" button
  linkCardBtn.addEventListener("click", validateAndSaveCard);

  backdrop.addEventListener("click", () => {
    hideModal(walletModal);
    hideModal(linkCardModal);
    hideModal(featureModal); // Also hide the new modal
  });
});
