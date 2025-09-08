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
  const createPremiumCardHTML = (cardDetails) => {
    const cardImageUrl =
      "https://images.unsplash.com/photo-1582285846959-4ee89a4644a4?auto=format&fit=crop&w=400";
    return `
            <div class="card-container">
                <img class="card-image" src="${cardImageUrl}" alt="Premium Card Image" />
                <span class="card-overlay-text card-type-label">Debit</span>
                <div class="card-overlay-text card-details-bottom-left">
                    <span>&bull;&bull;&bull;&bull; ${cardDetails.cardNumberLast4}</span>
                </div>
                <div class="contactless-symbol">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.3 19.5002C17.4 17.2002 18 14.7002 18 12.0002C18 9.30024 17.4 6.70024 16.3 4.50024M12.7 17.8003C13.5 16.0003 14 14.0003 14 12.0003C14 10.0003 13.5 7.90034 12.7 6.10034M9.1001 16.1001C9.7001 14.8001 10.0001 13.4001 10.0001 12.0001C10.0001 10.6001 9.7001 9.10015 9.1001 7.90015M5.5 14.3003C5.8 13.6003 6 12.8003 6 12.0003C6 11.2003 5.8 10.3003 5.5 9.60034" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
      // ** BUG FIX IS HERE: cardDetails object is created inside this scope **
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
