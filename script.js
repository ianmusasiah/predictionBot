// ========== DOM References ==========
const accountInput = document.getElementById("accountNames");
const totalTicketsInput = document.getElementById("totalTickets");
const targetPercentageInput = document.getElementById("targetPercentage");
const sameAmountCheckbox = document.getElementById("sameAmount");
const autoCalcBtn = document.getElementById("autoCalc");
const accountContainer = document.getElementById("accountContainer");
const resultsContainer = document.getElementById("resultsContainer");
const presetPercentageRadios = document.querySelectorAll(".preset-percentage");
const presetAmountButtons = document.querySelectorAll(".preset-amount");

let selectedPercentage = 70;
let selectedAmount = 100;

// ========== Preset Percentage Handling ==========
presetPercentageRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedPercentage = parseFloat(radio.dataset.percent);
    targetPercentageInput.value = selectedPercentage;
  });
});

// ========== Preset Amount Handling ==========
presetAmountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    presetAmountButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = parseFloat(btn.dataset.amount);
    totalTicketsInput.value = selectedAmount;
  });
});

// ========== Render Account Fields ==========
function renderAccounts() {
  const accounts = accountInput.value.split(",").map((a) => a.trim()).filter(Boolean);
  accountContainer.innerHTML = "";

  accounts.forEach((account, index) => {
    const div = document.createElement("div");
    div.className = "account-input";

    const nameLabel = document.createElement("label");
    nameLabel.textContent = account;

    const likelyCheckbox = document.createElement("input");
    likelyCheckbox.type = "checkbox";
    likelyCheckbox.className = "likely-check";
    likelyCheckbox.dataset.index = index;

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.className = "amount-field";
    amountInput.value = sameAmountCheckbox.checked ? selectedAmount : "";

    div.appendChild(nameLabel);
    div.appendChild(likelyCheckbox);
    div.appendChild(document.createTextNode(" ✅ More Likely to Win"));
    div.appendChild(amountInput);
    accountContainer.appendChild(div);
  });
}

accountInput.addEventListener("input", renderAccounts);
sameAmountCheckbox.addEventListener("change", renderAccounts);

// ========== Auto Calculate Based on Target ==========
autoCalcBtn.addEventListener("click", () => {
  const accounts = accountInput.value.split(",").map((a) => a.trim()).filter(Boolean);
  const totalTickets = parseFloat(totalTicketsInput.value);
  const targetPercent = parseFloat(targetPercentageInput.value);
  const totalTarget = Math.round((targetPercent / 100) * totalTickets);

  const amountFields = document.querySelectorAll(".amount-field");
  const likelyChecks = document.querySelectorAll(".likely-check");

  const likelyIndexes = Array.from(likelyChecks)
    .map((check, i) => (check.checked ? i : -1))
    .filter((i) => i !== -1);

  let totalWeight = 0;
  const weights = [];

  for (let i = 0; i < accounts.length; i++) {
    const weight = likelyIndexes.includes(i) ? 3 : 1;
    weights.push(weight);
    totalWeight += weight;
  }

  amountFields.forEach((field, i) => {
    const proportion = weights[i] / totalWeight;
    field.value = Math.round(totalTarget * proportion);
  });

  showResults(accounts, amountFields);
});

// ========== Show Results ==========
function showResults(accounts, amountFields) {
  let totalEntered = 0;
  const individualChances = [];
  const totalTickets = parseFloat(totalTicketsInput.value);

  amountFields.forEach((field, i) => {
    const val = parseFloat(field.value) || 0;
    totalEntered += val;
    const chance = totalTickets > 0 ? ((val / totalTickets) * 100) : 0;
    individualChances.push(
      `${accounts[i]}: ${chance.toFixed(2)}% chance (${Math.round(val)} tickets)`
    );
  });

  resultsContainer.innerHTML = `
    <div class="result-box colorful">
      <h3>🎲 Your Chances</h3>
      <p><strong>Total Entered:</strong> ${totalEntered}</p>
      <ul>
        ${individualChances.map((c) => `<li>🎯 ${c}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ========== Init ==========
renderAccounts();
