let streamingPayRatesData;
const calculationTypeSelect = document.getElementById('calculation-type');
const calculatorElement = document.getElementById("calculator");
const decimalPrecision = 2;
const earningsAmountSpan = document.getElementById("earnings-amount");
const earningsResultsDiv = document.getElementById("earnings-results");
const hiddenClass = "hidden";
const jsonPath = "/royalties-calculator/data/streaming_pay_rate.json";
const questionDiv = document.getElementById("question");
const resultsDiv = document.getElementById("results");
const targetAmountElement = document.getElementById("target-amount");

async function fetchStreamingPayRates() {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error("Network response was not ok");
    streamingPayRatesData = await response.json();
    createElementForStore(streamingPayRatesData);
    initializeCalculator();
    toggleCalculatorMode();
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

function createElementForStore(data) {
  resultsDiv.innerHTML = "";
  resultsDiv.className = "results-grid";

  data.forEach((store) => {
    const sanitizedStoreName = normalizeStoreName(store.Store);
    const storeDisplayName = store.Store === "Meta" ? "Instagram & Facebook" : store.Store;
    resultsDiv.insertAdjacentHTML(
      "beforeend",
      `<div class="store-box">
        <img src="/img/streaming_logos/${sanitizedStoreName}.png" alt="" class="store-logo${store.Store.toLowerCase() === "tidal" ? " invertible-image" : ""}">
        <div class="streams-needed">0</div>
        <input class="streams-for-store ${hiddenClass}" id="${sanitizedStoreName}-streams-needed" type="number" inputmode="numeric" value="0" aria-label="Streams from ${storeDisplayName}">
        <div class="store-name" aria-hidden="true">${storeDisplayName}</div>
       </div>`
    );

    const storeBoxElement = resultsDiv.lastElementChild;
    const inputElement = storeBoxElement.querySelector(`#${sanitizedStoreName}-streams-needed`);

    // Focus input on store-box click.
    storeBoxElement.addEventListener('click', () => {
      inputElement.focus();
      inputElement.select();
    });

    applyValidationToInput(inputElement);
    inputElement.addEventListener("input", () => {
      applyValidationToInput(inputElement);
    });
  });
}

function applyValidationToInput(inputElement) {
  const isValidInput = isValidNumber(inputElement.value);
  inputElement.style.borderBottom = isValidInput
    ? "2px solid var(--primary-color)"
    : "2px solid red";
  inputElement.setAttribute('aria-invalid', !isValidInput);
}


function isValidNumber(value) {
  return /^-?\d*\.?\d+(e\d+)?$/.test(value) && parseFloat(value) >= 0;
}

targetAmountElement.addEventListener("input", () => {
  applyValidationToInput(targetAmountElement);
});

targetAmountElement.addEventListener("click", () => {
  targetAmountElement.focus();
  targetAmountElement.select();
});

function initializeCalculator() {
  const inputs = getUserInputs();
  if (inputs) updateResults(streamingPayRatesData, inputs);
}

function getUserInputs() {
  const calculationType = calculationTypeSelect.value;
  const targetAmount = parseFloat(targetAmountElement.value);
  if (isNaN(targetAmount) || targetAmount < 0) {
    return null;
  }
  return { calculationType, targetAmount };
}

function updateResults(data, { calculationType, targetAmount }) {
  data.forEach((store) => {
    const sanitizedStoreName = normalizeStoreName(store.Store);
    const streamsNeeded = Math.ceil(
      targetAmount / store[calculationType]
    ).toLocaleString();
    const streamsNeededDiv = document.querySelector(
      `#${sanitizedStoreName}-streams-needed`
    ).previousElementSibling;
    streamsNeededDiv.textContent = streamsNeeded;
  });
}

function normalizeStoreName(storeName) {
  return storeName.toLowerCase().replace(/\s+/g, "_");
}

function toggleCalculatorMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const isCalculatingEarnings = mode === "CalculateEarnings";
  questionDiv.classList.toggle(hiddenClass, isCalculatingEarnings);
  earningsResultsDiv.classList.toggle(hiddenClass, !isCalculatingEarnings);
  document
    .querySelectorAll(".streams-needed")
    .forEach((div) => div.classList.toggle(hiddenClass, isCalculatingEarnings));
  const streamInputs = document
    .querySelectorAll(".streams-for-store")
    .forEach((input) => {
      input.classList.toggle(hiddenClass, !isCalculatingEarnings);
      const storeBox = input.closest('.store-box');
      if(storeBox) {
        if (isCalculatingEarnings) {
          storeBox.classList.add('clickable');
        } else {
          storeBox.classList.remove('clickable');
        }
      }
    });
}

function updateEarningsResults() {
  if (document.querySelector('input[name="mode"]:checked').value === "CalculateEarnings") {
    const earnings = calculateEarnings();
    const formattedEarnings = earnings.toFixed(decimalPrecision);
    const newEarnings = parseFloat(formattedEarnings).toLocaleString();
    earningsAmountSpan.textContent = `$${newEarnings}`;
  }
}

function calculateEarnings() {
  const calculationType = calculationTypeSelect.value;

  return Array.from(document.querySelectorAll(".streams-for-store"))
    .reduce((total, input) => {
      const streamCount = parseFloat(input.value);
      if (!isNaN(streamCount) && streamCount > 0) {
        const storeName = input.id.split("-")[0];
        const payPerStream = streamingPayRatesData.find(
          store => normalizeStoreName(store.Store) === storeName
        )[calculationType];
        return total + streamCount * payPerStream;
      }
      return total;
    }, 0);
}


function reorderServices() {
  const calculationType = calculationTypeSelect.value;
  const sortedData = [...streamingPayRatesData].sort((a, b) => b[calculationType] - a[calculationType]);
  const docFragment = document.createDocumentFragment();

  sortedData.forEach(store => {
    const sanitizedStoreName = normalizeStoreName(store.Store);
    const elementId = `${sanitizedStoreName}-streams-needed`;
    const storeBoxElement = document.getElementById(elementId).closest('.store-box');
    if (storeBoxElement) {
      docFragment.appendChild(storeBoxElement);
    }
  });

  resultsDiv.appendChild(docFragment);
}

calculatorElement.addEventListener("input", () => {
  if (streamingPayRatesData) {
    initializeCalculator();
    updateEarningsResults();
  }
});

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", () => {
    toggleCalculatorMode();
    updateEarningsResults();
  });
});

calculationTypeSelect.addEventListener("change", () => {
  reorderServices();
});

fetchStreamingPayRates();
