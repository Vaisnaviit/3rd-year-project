document.addEventListener("DOMContentLoaded", () => {
  const cashPaymentBtn = document.getElementById("cash-payment");
  const upiPaymentBtn = document.getElementById("upi-payment");
  const upiSection = document.getElementById("upi-section");
  const confirmation = document.getElementById("confirmation");
  const upiForm = document.getElementById("upi-form");
  const upiIdInput = document.getElementById("upi-id");

  // Handle cash payment
  cashPaymentBtn.addEventListener("click", async () => {
    try {
      // Simulate the cash payment process (no backend request)
      confirmation.textContent = "Thank you for ordering. Please go to the counter to complete your payment.";
      confirmation.classList.remove("hidden");
      upiSection.classList.add("hidden");
    } catch (error) {
      console.error(error);
      alert('An error occurred while processing cash payment. Please try again.');
    }
  });

  // Handle UPI payment
  upiPaymentBtn.addEventListener("click", () => {
    upiSection.classList.remove("hidden");
    confirmation.classList.add("hidden");
  });

  // Submit UPI form
  upiForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const upiId = upiIdInput.value.trim();
    if (!upiId) {
      alert('Please enter a valid UPI ID');
      return;
    }

    try {
      const response = await fetch('/api/payment/upi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: getUserId(),
          upiId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process UPI payment');
      }

      const data = await response.json();
      confirmation.textContent = data.message;
      confirmation.classList.remove("hidden");
      upiSection.classList.add("hidden");
    } catch (error) {
      console.error(error);
      alert(error.message || 'An error occurred while processing UPI payment. Please try again.');
    }
  });

  // Simulate getting a unique user ID (could be fetched from a login system)
  function getUserId() {
    return 'user-' + Math.random().toString(36).substr(2, 9); // Example unique user ID
  }
});
