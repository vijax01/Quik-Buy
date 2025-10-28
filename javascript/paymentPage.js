
const cart = JSON.parse(localStorage.getItem("cartData"));
console.log(cart)



// 5️⃣ Function to clear cart after successful order
function clearCart() {
  cart = [];
  localStorage.removeItem("cartData"); // remove from storage
}



let itemNames = "";
let quantity = 0;
let totalPrice = 0;
for (item of cart) {
    itemNames += `Item 1. ${item.name}<br>`;
    quantity += item.quantity;
    totalPrice += item.quantity * item.price;
}
document.querySelector(".product-list").innerHTML = itemNames;
document.querySelector(".total-price").innerHTML = "₹ " + totalPrice;
document.querySelector(".final-price").innerHTML = "₹ " + totalPrice;
document.querySelector(".total-quantity").innerHTML = "Qty: " + quantity;


let currentStep = 1;
const totalSteps = 3;
const sections = ['section-1', 'section-2', 'section-3'];
const messageBox = document.getElementById('message-box');

/**
 * Utility function to display messages (instead of alert/confirm).
 * @param {string} message - The message to display.
 * @param {boolean} isSuccess - True for success (green), false for error (red).
 */
function showMessage(message, isSuccess = false) {
    messageBox.textContent = message;
    messageBox.className = 'message-box'; // Reset classes
    if (isSuccess) {
        messageBox.classList.add('success');
    }
    messageBox.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

/**
 * Updates the UI to show the current step's content and progress indicator.
 */
function updateUI() {
    // 1. Update Step Indicator
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        stepElement.classList.remove('active', 'completed');

        if (i === currentStep) {
            stepElement.classList.add('active');
        } else if (i < currentStep) {
            stepElement.classList.add('completed');
        }
    }

    // 2. Update Section Visibility
    sections.forEach((id, index) => {
        const section = document.getElementById(id);
        section.style.display = (index + 1 === currentStep) ? 'block' : 'none';
    });

    // 3. Populate Review data if on Step 3
    if (currentStep === 3) {
        populateReview();
    }
}

/**
 * Validates all required fields in the current step's form.
 * @returns {boolean} - True if validation passes, false otherwise.
 */
function validateStep(step) {
    let formId;
    if (step === 1) formId = 'address-form';
    else if (step === 2) formId = 'payment-form';
    else return true; // Step 3 (Review) has no form validation

    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim() || !input.checkValidity()) {
            isValid = false;
            // Visually highlight invalid fields
            input.style.borderColor = 'red';
        } else {
            // FIX: Must use a string value for style properties, not CSS var() syntax
            input.style.borderColor = '#ced4da'; // This is the color from --border-color
        }
    });

    if (!isValid) {
        showMessage("Please fill in all required fields correctly.");
    }

    return isValid;
}

/**
 * Moves to the next step, only if the current step validates successfully.
 */
function nextStep() {
    // Validate the current step's form before moving forward
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        }
    }
}

/**
 * Moves to the previous step.
 */
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateUI();
        // Clear any lingering error messages
        messageBox.style.display = 'none';
    }
}

/**
 * Gathers data and populates the Review Order section (Step 3).
 */
function populateReview() {
    // Get Shipping Data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const city = document.getElementById('city').value;
    const zipcode = document.getElementById('zipcode').value;
    const country = document.getElementById('country').value;

    const fullAddress = `
                ${firstName} ${lastName}<br>
                ${address1}<br>
                ${address2 ? address2 + '<br>' : ''}
                ${city}, ${zipcode}<br>
                ${country}
            `;
    document.getElementById('review-address').innerHTML = fullAddress;

    // Get Payment Data
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    // Mask card number for display
    const maskedCardNumber = '**** **** **** ' + cardNumber.slice(-4);

    document.getElementById('review-card-name').textContent = cardName;
    document.getElementById('review-card-number').textContent = maskedCardNumber;
    document.getElementById('review-card-expiry').textContent = expiryDate;
    document.getElementById('review-card-cvv').textContent = cvv.length; // Show only length for security
}

/**
 * Finalizes the order submission.
 */
function placeOrder() {
    // Get the button and its container
    const placeOrderBtn = document.querySelector('.btn-place-order');
    const buttonGroup = document.getElementById('review-button-group');
    const backBtn = buttonGroup.querySelector('.btn-back');

    // Temporarily disable all buttons and show processing state
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    backBtn.disabled = true;

    setTimeout(() => {
        // 1. Final success message
        showMessage("Order successfully placed! Thank you for your purchase.", true);

        // 2. Clear out existing buttons in the button group
        buttonGroup.innerHTML = '';

        // 3. Create and add a disabled "ORDER PLACED" button
        const confirmedBtn = document.createElement('button');
        confirmedBtn.className = 'btn';
        confirmedBtn.textContent = 'ORDER PLACED';
        confirmedBtn.disabled = true;
        // Use the success color for visual confirmation
        confirmedBtn.style.backgroundColor = 'var(--success-color)';
        confirmedBtn.style.color = 'white';
        confirmedBtn.style.cursor = 'default';

        // 4. Create and add the 'Shop More' button
        const shopMoreBtn = document.createElement('button');
        shopMoreBtn.className = 'btn btn-next'; // Reusing btn-next styling for primary action
        shopMoreBtn.textContent = 'SHOP MORE';
        // Sets the redirection URL (use '/' or a specific path in a real app)
        shopMoreBtn.onclick = () => window.location.href = '/';

        // 5. Append the new buttons
        buttonGroup.appendChild(confirmedBtn);
        buttonGroup.appendChild(shopMoreBtn);

        // Log data (in a real app, this data would have been sent to a server)
        console.log("Order Data Sent successfully.");

        clearCart();
    }, 2000);
}

// Initialize the UI on page load
document.addEventListener('DOMContentLoaded', updateUI);