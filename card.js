// Wait for the entire HTML document to be loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
  //======================================================================
  // 1. GATHER ALL HTML ELEMENTS
  //======================================================================
  // Modals & Overlays
  const backdrop = document.getElementById("modal-backdrop");
  const walletModal = document.getElementById("modal-add-to-wallet");
  const linkCardModal = document.getElementById("modal-link-card");
  const featureModal = document.getElementById("modal-feature-not-implemented");
  const successToast = document.getElementById("success-toast");

  // Buttons
  const openWalletBtn = document.getElementById("open-wallet-modal-btn");
  const openLinkCardBtn = document.getElementById("open-link-card-btn");
  const openBankModalBtn = document.getElementById("open-bank-modal-btn");
  const linkCardBackBtn = document.getElementById("link-card-back-btn");
  const linkCardBtn = document.getElementById("link-card-btn");
  const allCloseBtns = document.querySelectorAll("[data-close-modal]");

  // Form Inputs & Error Messages
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

  // --- Modal & UI Control ---
  const showModal = (modalEl) => {
    if (!modalEl) return;
    backdrop.classList.add("visible");
    modalEl.classList.add("visible");
  };
  const hideModal = (modalEl) => {
    if (!modalEl) return;
    backdrop.classList.remove("visible");
    modalEl.classList.remove("visible");
  };
  const showToast = (toastEl) => {
    if (!toastEl) return;
    toastEl.classList.add("visible");
    setTimeout(() => toastEl.classList.remove("visible"), 3000);
  };
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

  // --- Card HTML Generation ---
  // ** THIS IS THE ONLY FUNCTION THAT HAS BEEN MODIFIED **
  const createPremiumCardHTML = (cardDetails) => {
    // This function now returns the complete, realistic PayPal card HTML.
    return `
      <div class="card-container">
        <div class="paypal-logo">
          <svg viewBox="0 0 135.0 48.0" xmlns="http://www.w3.org/2000/svg">
            <path fill="#60cdff" d="M18.24 2.83C16.85 2.28 15.17 2 13.2 2H2v32.88h7.6V23.72h3.6c1.97 0 3.65-0.28 5.04-0.83c1.39-0.55 2.57-1.32 3.52-2.31a11.15 11.15 0 0 0 2.3-3.49c0.55-1.31 0.82-2.72 0.82-4.23c0-1.51-0.27-2.92-0.82-4.23c-0.55-1.31-1.32-2.47-2.3-3.49c-0.96-0.99-2.13-1.76-3.52-2.31zm-3.77 13.82c-0.56 0.21-1.33 0.31-2.35 0.31H9.6v-8.2h2.52c1.02 0 1.8 0.12 2.35 0.35c0.58 0.2 1.05 0.48 1.43 0.83c0.78 0.73 1.17 1.7 1.17 2.92s-0.39 2.19-1.17 2.92c-0.37 0.34-0.85 0.64-1.43 0.87zM88.17 2c1.97 0 3.65 0.28 5.04 0.83c1.39 0.55 2.56 1.32 3.52 2.31c0.98 1.02 1.75 2.18 2.3 3.49c0.55 1.31 0.82 2.72 0.82 4.23c0 1.51-0.27 2.92-0.82 4.23a11.15 11.15 0 0 1-2.3 3.49c-0.95 0.99-2.13 1.76-3.52 2.31c-1.39 0.55-3.07 0.83-5.04 0.83h-3.6v11.16h-7.6V2h11.2zm-1.09 14.96c1.02 0 1.79-0.1 2.35-0.31c0.58-0.23 1.06-0.53 1.43-0.87c0.78-0.73 1.17-1.7 1.17-2.92s-0.39-2.19-1.17-2.92c-0.38-0.35-0.85-0.63-1.43-0.83c-0.55-0.23-1.33-0.35-2.35-0.35h-2.52v8.2h2.52zM133 34.83V2h-7.47v32.83H133zm-10.22 0.06V13.1h-6.64v1.88a8.77 8.77 0 0 0-2.86-1.88c-1.07-0.47-2.23-0.7-3.47-0.7c-1.56 0-3.01 0.31-4.34 0.92a10.45 10.45 0 0 0-3.47 2.44c-0.99 1.05-1.77 2.29-2.35 3.71c-0.55 1.39-0.82 2.9-0.82 4.53c0 1.63 0.27 3.16 0.82 4.58c0.58 1.39 1.36 2.61 2.35 3.66c0.98 1.04 2.14 1.87 3.47 2.48c1.33 0.58 2.78 0.87 4.34 0.87c1.24 0 2.4-0.24 3.47-0.7a8.99 8.99 0 0 0 2.86-1.88v1.88h6.64zm-8.43-7.34c-0.87 0.94-1.98 1.4-3.34 1.4c-1.36 0-2.49-0.47-3.39-1.4c-0.86-0.92-1.3-2.12-1.3-3.57c0-1.45 0.43-2.64 1.3-3.57c0.9-0.94 2.04-1.4 3.39-1.4s2.47 0.47 3.34 1.4c0.9 0.92 1.35 2.12 1.35 3.57c0 1.45-0.45 2.64-1.35 3.57zM57.22 13.08h-8.25l10.07 17.84l-7.47 15.04h7.6l16.37-32.88H67.9l-4.99 10.46h-0.09l-5.6-10.46zM47.5 13.1v21.79h-6.64v-1.88c-0.84 0.82-1.8 1.44-2.86 1.88c-1.07 0.46-2.23 0.7-3.47 0.7c-1.56 0-3.01-0.29-4.34-0.87c-1.33-0.61-2.49-1.44-3.47-2.48c-0.98-1.05-1.77-2.27-2.35-3.66c-0.55-1.42-0.82-2.95-0.82-4.58s0.27-3.14 0.82-4.53c0.58-1.42 1.36-2.66 2.35-3.71a10.35 10.35 0 0 1 3.47-2.44c1.33-0.61 2.78-0.92 4.34-0.92c1.24 0 2.4 0.23 3.47 0.7c1.07 0.44 2.03 1.06 2.86 1.88V13.1h6.64zM35.73 28.95c1.36 0 2.47-0.46 3.35-1.4c0.9-0.93 1.35-2.12 1.35-3.57c0-1.45-0.45-2.65-1.35-3.57c-0.87-0.93-1.99-1.4-3.35-1.4s-2.49 0.46-3.39 1.4c-0.87 0.93-1.3 2.12-1.3 3.57c0 1.45 0.44 2.65 1.3 3.57c0.9 0.93 2.03 1.4 3.39 1.4z" />
          </svg>
        </div>
        <div class="card-element card-number">
            <span>.... ${cardDetails.cardNumberLast4}</span>
        </div>
        <div class="card-element card-info-right">
            <span class="debit-label">Debit</span>
            <div class="mastercard-logo">
                <svg viewBox="0 0 564.51 349.81" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#f79f1a" d="M564.51,174.9c0,96.6 -78.16,174.91 -174.58,174.91S215.36,271.5 215.36,174.9 293.52,0 389.93,0 564.51,78.31 564.51,174.9Z"/>
                    <path fill="#ea001b" d="M349.15,174.9c0,96.6 -78.16,174.91 -174.58,174.91S0,271.5 0,174.9 78.16,0 174.57,0 349.15,78.31 349.15,174.9Z"/>
                    <path fill="#ff5f01" d="M282.25,37.22a175.18,175.18 0,0 0,0 275.37,175.17 175.17,0 0,0 0,-275.37Z"/>
                </svg>
            </div>
        </div>
      </div>
    `;
  };

  // --- Main Logic Functions ---
  const renderCardView = () => {
    const savedCardDetails = JSON.parse(
      localStorage.getItem("linkedCardDetails")
    );
    if (savedCardDetails && cardsContainer) {
      cardsContainer.innerHTML = createPremiumCardHTML(savedCardDetails);
    }
  };

  const validateAndSaveCard = () => {
    if (!linkCardBtn || !cardNumberInput || !cardExpiryInput || !cardCvvInput)
      return;

    let isValid = true;
    linkCardBtn.disabled = true;

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

    if (
      !cardNumber ||
      cardNumber.length !== 16 ||
      !/^\d{16}$/.test(cardNumber)
    ) {
      isValid = false;
      cardNumberInput.classList.add("input-error");
      cardNumberError.textContent =
        "Please enter a valid 16-digit card number.";
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

    if (isValid) {
      const cardDetails = {
        cardNumberLast4: cardNumber.slice(-4),
        cardExpiry: cardExpiry,
      };
      localStorage.setItem("linkedCardDetails", JSON.stringify(cardDetails));

      showToast(successToast);
      hideModal(linkCardModal);
      resetForm();
      renderCardView();
    }

    linkCardBtn.disabled = false;
  };

  //======================================================================
  // 3. SET UP EVENT LISTENERS
  //======================================================================
  if (openWalletBtn)
    openWalletBtn.addEventListener("click", () => showModal(walletModal));
  if (openLinkCardBtn)
    openLinkCardBtn.addEventListener("click", () => {
      hideModal(walletModal);
      setTimeout(() => showModal(linkCardModal), 200);
    });
  if (openBankModalBtn)
    openBankModalBtn.addEventListener("click", () => {
      hideModal(walletModal);
      setTimeout(() => showModal(featureModal), 200);
    });
  if (linkCardBackBtn)
    linkCardBackBtn.addEventListener("click", () => {
      hideModal(linkCardModal);
      resetForm();
      setTimeout(() => showModal(walletModal), 200);
    });
  if (linkCardBtn) linkCardBtn.addEventListener("click", validateAndSaveCard);

  allCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close-modal");
      hideModal(document.getElementById(modalId));
    });
  });

  if (backdrop)
    backdrop.addEventListener("click", () => {
      hideModal(walletModal);
      hideModal(linkCardModal);
      hideModal(featureModal);
    });

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
  renderCardView();
});
