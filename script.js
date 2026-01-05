// --------------------------
// Elements
// --------------------------
const brewMethodSelect = document.getElementById("brew-method");
const espressoSection = document.getElementById("espresso-machine-section");

// Show/hide espresso machine section only if brew method = espresso
brewMethodSelect.addEventListener("change", function () {
  if (this.value === "espresso") {
    espressoSection.style.display = "block";
  } else {
    espressoSection.style.display = "none";
  }
});

// Initialize state on page load
brewMethodSelect.dispatchEvent(new Event("change"));

// --------------------------
// User Type Logic (Home vs Café)
// --------------------------
const userTypeSelect = document.getElementById("user-type");

userTypeSelect.addEventListener("change", function () {
  const isCafe = this.value === "cafe";
  if (isCafe) {
    brewMethodSelect.value = "espresso";
    brewMethodSelect.dispatchEvent(new Event("change"));
  }
});

// --------------------------
// Smart Brew Mapping Table
// --------------------------
const brewRecommendations = {
  espresso: { dose: "18-20g", yield: "36-40g", time: "25-30s", grind: "fine" },
  v60: { dose: "15-18g", yield: "250-300ml", time: "2:30-3:30 min", grind: "medium-fine" },
  chemex: { dose: "20-25g", yield: "400-500ml", time: "3:30-4:30 min", grind: "medium-coarse" },
  "french-press": { dose: "30g", yield: "500ml", time: "4-5 min", grind: "coarse" },
  aeropress: { dose: "16g", yield: "250ml", time: "1:30-2:00 min", grind: "medium" },
  "moka-pot": { dose: "15-20g", yield: "150-250ml", time: "3-5 min", grind: "fine" },
  turkish: { dose: "10g", yield: "100ml", time: "2-3 min", grind: "extra-fine" },
  "balance-siphon": { dose: "20g", yield: "300ml", time: "3-4 min", grind: "medium" },
  syphon: { dose: "20g", yield: "300ml", time: "3-4 min", grind: "medium" },
  "cold-brew": { dose: "100g", yield: "1L", time: "12-18 hr", grind: "coarse" }
};

// --------------------------
// Grinder Numeric Settings
// --------------------------
const grinderSettings = {
  "baratza-encore": { espresso: 0, v60: 18, chemex: 20, "french-press": 25, aeropress: 19, "moka-pot": 15, turkish: 0, "balance-siphon": 20, syphon: 20, "cold-brew": 30 },
  "baratza-sette-270": { espresso: 4, v60: 8, chemex: 12, "french-press": 16, aeropress: 10, "moka-pot": 6, turkish: 0, "balance-siphon": 12, syphon: 12, "cold-brew": 18 },
  "mazzer-mini": { espresso: 4, v60: 12, chemex: 16, "french-press": 20, aeropress: 14, "moka-pot": 6, turkish: 0, "balance-siphon": 16, syphon: 16, "cold-brew": 25 },
  "mazzer-super-jolly": { espresso: 5, v60: 13, chemex: 17, "french-press": 21, aeropress: 15, "moka-pot": 7, turkish: 0, "balance-siphon": 17, syphon: 17, "cold-brew": 26 },
  "fellow-ode": { espresso: 0, v60: 5, chemex: 7, "french-press": 11, aeropress: 6, "moka-pot": 4, turkish: 0, "balance-siphon": 8, syphon: 8, "cold-brew": 11 }
};

// --------------------------
// STEP 1: SCA → Extraction Diagnosis
// --------------------------
const scaWeights = {
  aroma: 0.5,
  flavor: 1.5,
  aftertaste: 1.2,
  acidity: 1.3,
  body: 1.0,
  balance: 1.5,
  sweetness: 1.4,
  overall: 1.0
};

const extractionMapping = {
  aroma: "both",
  flavor: "both",
  aftertaste: "both",
  acidity: "under",
  sweetness: "under",
  body: "both",
  balance: "both",
  overall: "both"
};

function normalizeScore(score) {
  return (score - 5) / 5;
}

function diagnoseExtraction(scaFeedback) {
  let underScore = 0;
  let overScore = 0;

  for (const key in scaWeights) {
    const raw = parseFloat(scaFeedback[key]);
    if (isNaN(raw)) continue;

    const weighted = normalizeScore(raw) * scaWeights[key];
    const mapping = extractionMapping[key];

    if (mapping === "under" && weighted < 0) underScore += Math.abs(weighted);
    if (mapping === "over" && weighted > 0) overScore += weighted;
    if (mapping === "both") {
      if (weighted < 0) underScore += Math.abs(weighted);
      if (weighted > 0) overScore += weighted;
    }
  }

  let extractionState = "balanced";
  if (underScore > overScore + 0.2) extractionState = "under";
  if (overScore > underScore + 0.2) extractionState = "over";

  return {
    extractionState,
    confidence: Math.abs(underScore - overScore).toFixed(2)
  };
}

// --------------------------
// STEP 2: Recipe Adjustment Engine
// --------------------------
function adjustRecipe(extractionDiagnosis, selections) {
  if (extractionDiagnosis.extractionState === "balanced") {
    return "Your extraction appears balanced. No changes recommended.";
  }

  let grindAdvice = "";
  let timeAdvice = "";

  if (extractionDiagnosis.extractionState === "under") {
    grindAdvice = "Go 1–2 clicks finer.";
    timeAdvice = "Increase brew time slightly (≈ +3 seconds).";
  }

  if (extractionDiagnosis.extractionState === "over") {
    grindAdvice = "Go 1–2 clicks coarser.";
    timeAdvice = "Reduce brew time slightly (≈ −3 seconds).";
  }

  return `
    <h3>Adjustment for Next Brew</h3>
    <p><strong>Diagnosis:</strong> ${extractionDiagnosis.extractionState} extraction</p>
    <p><strong>Grind Adjustment:</strong> ${grindAdvice}</p>
    <p><strong>Time Adjustment:</strong> ${timeAdvice}</p>
    <p><strong>Confidence:</strong> ${extractionDiagnosis.confidence}</p>
  `;
}

// --------------------------
// Submit Button Listener
// --------------------------
document.getElementById("submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");

  const selections = {
    userType: document.getElementById("user-type").value,
    brewMethod: document.getElementById("brew-method").value,
    grinder: document.getElementById("grinder").value
  };

  const scaFeedback = {
    aroma: document.getElementById("aroma").value,
    flavor: document.getElementById("flavor").value,
    aftertaste: document.getElementById("aftertaste").value,
    acidity: document.getElementById("acidity").value,
    body: document.getElementById("body").value,
    balance: document.getElementById("balance").value,
    sweetness: document.getElementById("sweetness").value,
    overall: document.getElementById("overall").value
  };

  const extractionDiagnosis = diagnoseExtraction(scaFeedback);
  const adjustmentAdvice = adjustRecipe(extractionDiagnosis, selections);

  output.innerHTML += adjustmentAdvice;
});
