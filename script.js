document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const orderSummaryTab = document.getElementById("tab4");
  const orderSummaryContent = document.createElement("div");
  let selectedItems = [];

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    showTab(2); // Switch to the "Offerings" tab
  });

  function showTab(tabIndex) {
    tabs.forEach((tab) => (tab.style.display = "none"));
    tabs[tabIndex - 1].style.display = "block";
  }

  document.querySelectorAll(".grid-item").forEach((item) => {
    item.addEventListener("click", function () {
      showTab(3); // Switch to the "Catalogue Selection" tab
    });
  });

  const categoriesMapping = {
    "Customer On-Boarding": [
      "Customer Welcome",
      "Report Set-up",
      "Success Plan",
      "Handover"
    ],
    "Customer Success": ["Relationship Mgmt.", "Success Plan"],
    "Operational Excellence": ["Change Mgmt.", "SLA Mgmt."],
    "Termination Activities": ["Financial Closure", "Cessation"]
  };

  document.querySelectorAll(".catalogue-item").forEach((item) => {
    item.addEventListener("click", function () {
      const category = this.textContent.trim();
      populateSecondColumn(categoriesMapping[category]);
    });
  });

  document
    .getElementById("backToOfferings")
    .addEventListener("click", function (event) {
      event.preventDefault();
      showTab(2); // Switch back to the "Offerings" tab
    });

  document
    .getElementById("proceedToCheckout")
    .addEventListener("click", function (event) {
      event.preventDefault();
      showTab(4); // Switch to the "Order Summary" tab
      displayOrderSummary();
    });

  function populateSecondColumn(categories) {
    const newColumn = document.querySelector(".catalogue-column:nth-child(2)");
    newColumn.innerHTML = ""; // Clear existing content
    const costs = generateRandomCosts(categories.length);
    categories.forEach((item, index) => {
      const newItem = document.createElement("div");
      newItem.classList.add("catalogue-item");
      newItem.textContent = `${item} (${costs[index]})`;
      newItem.setAttribute("data-name", item);
      newColumn.appendChild(newItem);

      newItem.addEventListener("click", function () {
        newItem.classList.toggle("selected");
        updateSelectedItems(item, costs[index]);
      });
    });
  }

  function updateSelectedItems(item, cost) {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem.item === item
    );
    if (index !== -1) {
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push({ item, cost });
    }
    displayOrderSummary();
  }

  function displayOrderSummary() {
    orderSummaryContent.innerHTML = ""; // Clear existing content
    const totalCost = selectedItems.reduce((acc, selectedItem) => {
      const { item, cost } = selectedItem;
      orderSummaryContent.innerHTML += `
        <div>
          <input type="checkbox" id="${item}" checked>
          <label for="${item}">${item} (${cost})</label>
        </div>`;
      return acc + parseFloat(cost.substring(1)); // Remove $ sign and sum the costs
    }, 0);
    orderSummaryContent.innerHTML += `<div>Total Cost: $${totalCost.toFixed(
      2
    )}</div>`;
    orderSummaryContent.innerHTML += `<button id="placeOrderButton">Place Your Order</button>`;
    orderSummaryTab.appendChild(orderSummaryContent);

    // Add event listener to checkboxes
    document
      .querySelectorAll('#tab4 input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
          const item = this.id;
          const isChecked = this.checked;
          if (!isChecked) {
            selectedItems = selectedItems.filter(
              (selectedItem) => selectedItem.item !== item
            );
          }
          displayOrderSummary();
        });
      });

    // Add event listener to Place Your Order button
    document
      .getElementById("placeOrderButton")
      .addEventListener("click", placeOrder);
  }

  function placeOrder() {
    alert("Your order has been placed successfully!");
    showTab(2); // Navigate back to the "Offerings" tab after placing the order
  }

  function generateRandomCosts(length) {
    const costs = [];
    for (let i = 0; i < length; i++) {
      costs.push(`$${Math.floor(Math.random() * 500) + 100}`); // Random cost between $100 and $599
    }
    return costs;
  }
});
