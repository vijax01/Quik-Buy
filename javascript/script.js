function renderCart(cart) {
  const cartBody = document.getElementById("cart-body");
  cartBody.innerHTML = ""; // Clear previous content

  // 🛑 If cart is empty, exit early
  if (!cart || cart.length === 0) {
    return;
  }

  cart.forEach(item => {
    // Create row
    const tr = document.createElement("tr");

    // Remove button
    const tdRemove = document.createElement("td");
    tdRemove.innerHTML = `<span><i class="far fa-times-circle"></i></span>`;
    tr.appendChild(tdRemove);

    // Image
    const tdImage = document.createElement("td");
    tdImage.innerHTML = `<img src="${item.imageSource}" alt="${item.name}" width="50">`;
    tr.appendChild(tdImage);

    // Name
    const tdName = document.createElement("td");
    tdName.textContent = item.name;
    tr.appendChild(tdName);

    // Price
    const tdPrice = document.createElement("td");
    tdPrice.textContent = item.price.toLocaleString('en-IN');
    tr.appendChild(tdPrice);

    // Quantity input
    const tdQuantity = document.createElement("td");
    tdQuantity.innerHTML = `<input type="number" class="qty" value="${item.quantity}" min="1">`;
    tr.appendChild(tdQuantity);

    // Subtotal
    const tdSubtotal = document.createElement("td");
    tdSubtotal.textContent = (item.price * item.quantity).toLocaleString('en-IN');
    tr.appendChild(tdSubtotal);

    // Append row to table body
    cartBody.appendChild(tr);
  });
}





// 2️⃣ Function to save cart to localStorage
function saveCart() {
  localStorage.setItem("cartData", JSON.stringify(cart));
}





// 5️⃣ Function to clear cart after successful order
function clearCart() {
  cart = [];
  localStorage.removeItem("cartData"); // remove from storage
}





let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

document.querySelector("#login").addEventListener("click", () => {
  if (!isLoggedIn) {
    isLoggedIn = true;
    localStorage.setItem("isLoggedIn", true);
  }
  window.location.href = "./login.html";
});






if (localStorage.getItem("isLoggedIn") === "true") {
  document.querySelector("#login").classList.add("d-none");
  document.querySelector("#logout").classList.remove("d-none");
}





document.querySelector("#logout").addEventListener("click", () => {
  isLoggedIn = false;
  localStorage.setItem("isLoggedIn", false);
  window.location.href = "./";
})




// making the footer year dynamic 
document.getElementById("copyrightYear").innerHTML = (new Date()).getFullYear();





// 1️⃣ Load cart from localStorage (or create a new one if empty)
let cart = JSON.parse(localStorage.getItem("cartData")) || [];
renderCart(cart);





const navLinks = document.querySelectorAll(".navLinks");
navLinks.forEach((navLink) => {
  navLink.addEventListener("click", () => {
    navLinks.forEach((link) => link.classList.remove("active"));
    navLinks.forEach((link) => document.querySelector(`#${link.dataset.name}`).classList.add("d-none"));
    navLink.classList.add("active");
    document.querySelector(`#${navLink.dataset.name}`).classList.remove("d-none")
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});



document.querySelector("#navbar").children[3].addEventListener("click", () => {
  document.querySelector("#foot").scrollIntoView({
    behavior: "smooth"
  });
})





let cartCount = document.querySelector("#cart-count");
let count = parseInt(localStorage.getItem("itemCount") || "0", 10);
console.log("hey " + count);
if (count > 0) {
  cartCount.style.display = "inline-flex";
  cartCount.innerHTML = count;
  document.querySelector("#cart-items").classList.remove("d-none");
  document.querySelector("#empty").classList.add("d-none");
  let totalPrice = 0;
  for (item of cart) {
    totalPrice += item.price * item.quantity
  }
  document.querySelector(".amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');
  document.querySelector(".final-amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');
}





const addToCartButtons = document.querySelectorAll(".cart");
addToCartButtons.forEach((cartBtn) => {
  cartBtn.addEventListener("click", () => {
    cartCount.style.display = "inline-flex";
    document.querySelector("#cart-items").classList.remove("d-none");
    document.querySelector("#empty").classList.add("d-none");
    count++;
    cartCount.innerHTML = count;
    localStorage.setItem("itemCount", count);

    let parent = cartBtn.closest(".product-description");
    let name = parent.querySelector("h5").innerText;
    let price = parseInt(cartBtn.previousElementSibling.innerText.replace(/\D/g, ""));
    let product = cartBtn.closest(".product");
    let imageSource = product.querySelector("img").getAttribute("src");

    // Check if item is already in the cart
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      // If item exists, increase quantity
      existingItem.quantity += 1;
    } else {
      // If new item, push to cart with quantity 1
      cart.push({
        name: name,
        price: price,
        imageSource: imageSource,
        quantity: 1
      });
    }

    saveCart();

    let totalPrice = 0;
    for (item of cart) {
      totalPrice += item.price * item.quantity
    }
    document.querySelector(".amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');
    document.querySelector(".final-amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');

    // After updating cart array
    renderCart(cart);

  })
})





document.querySelector(".shop-btn").addEventListener("click", () => {
  document.querySelector("[data-name=home]").click();
  window.scrollTo({ top: 0, behavior: "smooth" });
})





const buyButtons = document.querySelectorAll(".buy-btn");
buyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.nextElementSibling.nextElementSibling.click();
    document.querySelector("[data-name=cart]").click();
  })
})





let button = document.querySelector(".checkout-btn");
button.addEventListener("click", () => {
  localStorage.setItem("cartData", JSON.stringify(cart))
  window.location.href = "./payment.html";
});





// event delegation method , used for dynamically added html elements 
document.getElementById("cart-body").addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-times-circle")) {
    const removeIcon = e.target; // the clicked <i> element
    const tableData = removeIcon.closest("td");

    // Example: get data from that row
    let qty = tableData.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.querySelector("input").value;
    count = parseInt(cartCount.innerText) - qty;
    localStorage.setItem("itemCount", count);
    document.querySelector("#cart-count").innerHTML = count;

    const nameToRemove = tableData.nextElementSibling.nextElementSibling.innerText;
    cart = cart.filter(item => item.name !== nameToRemove)
    saveCart();

    let totalPrice = 0;
    for (item of cart) {
      totalPrice += item.price * item.quantity
    }
    document.querySelector(".amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');
    document.querySelector(".final-amount").innerText = "₹ " + totalPrice.toLocaleString('en-IN');

    renderCart(cart);

    if (count === 0) {
      cartCount.style.display = "none";
      document.querySelector("#cart-items").classList.add("d-none");
      document.querySelector("#empty").classList.remove("d-none");
    }
  }
});