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
  const signals = {};

  for (const key in scaWeights) {
    const raw = parseFloat(scaFeedback[key]);
    if (isNaN(raw)) continue;

    const normalized = normalizeScore(raw);
    const weighted = normalized * scaWeights[key];
    signals[key] = weighted;

    const mapping = extractionMapping[key];

    if (mapping === "under" && weighted < 0) {
      underScore += Math.abs(weighted);
    }

    if (mapping === "over" && weighted > 0) {
      overScore += weighted;
    }

    if (mapping === "both") {
      if (weighted < 0) underScore += Math.abs(weighted);
      if (weighted > 0) overScore += weighted;
    }
  }

  let extractionState = "balanced";
  if (underScore > overScore + 0.2) extractionState = "under";
  if (overScore > underScore + 0.2) extractionState = "over";

  const confidenceValue = Math.abs(underScore - overScore);

  return {
    extractionState,
    confidence: confidenceValue,                  // numeric (logic)
    confidenceDisplay: confidenceValue.toFixed(2), // formatted (UI)
    signals
  };
}

// --------------------------
// STEP 2: Recipe Adjustment Engine
// --------------------------

function adjustRecipe(extractionDiagnosis, selections) {
  if (extractionDiagnosis.extractionState === "balanced") {
    return `
      <h3>Adjustment for Next Brew</h3>
      <p>Your extraction appears balanced. No changes recommended.</p>
    `;
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
    <p><strong>Confidence:</strong> ${extractionDiagnosis.confidenceDisplay}</p>
  `;
}

// --------------------------
// STEP 3: Brew History & Learning Engine
// --------------------------
let brewHistory = [];

// --------------------------
// STEP 4: Learning & Personalization Engine
// --------------------------

// Stores learned offsets per grinder + brew method
// Example structure:
// {
//   "baratza-encore::espresso": {
//     grindOffset: -1,
//     timeOffset: +2,
//     samples: 4
//   }
// }

let learningModel = {};

// --------------------------
// STEP 4a: Learning Activation Gate
// --------------------------

// Minimum brews required before learning is applied
const MIN_SAMPLES_TO_LEARN = 3;

// Apply learning to base recommendations ONLY after enough samples
function applyLearning(selections, baseGrind, baseTimeSeconds) {
  const key = `${selections.grinder}::${selections.brewMethod}`;
  const learned = learningModel[key];

  // No learning exists yet
  if (!learned) {
    return {
      grind: baseGrind,
      time: baseTimeSeconds,
      learningApplied: false,
      reason: "No learning data yet"
    };
  }

  // Not enough samples to trust learning
  if (learned.samples < MIN_SAMPLES_TO_LEARN) {
    return {
      grind: baseGrind,
      time: baseTimeSeconds,
      learningApplied: false,
      reason: `Learning in progress (${learned.samples}/${MIN_SAMPLES_TO_LEARN})`
    };
  }

  // Learning is mature enough to apply
  return {
    grind: baseGrind + learned.grindOffset,
    time: baseTimeSeconds + learned.timeOffset,
    learningApplied: true,
    reason: "Learning applied"
  };
}


// --------------------------
// STEP 6 + 7: Confidence-Weighted Learning WITH Drift Control
// --------------------------

// Normalize confidence into a 0–1 learning strength
function normalizeConfidence(confidence) {
  const MAX_CONFIDENCE = 3;
  return Math.min(confidence / MAX_CONFIDENCE, 1);
}

// Hard safety limits (VERY IMPORTANT)
const MAX_GRIND_OFFSET = 4;   // clicks
const MAX_TIME_OFFSET = 12;   // seconds

// Update learning model after each brew (safe + bounded)
function updateLearningModel(selections, extractionDiagnosis) {
  const key = `${selections.grinder}::${selections.brewMethod}`;

  if (!learningModel[key]) {
    learningModel[key] = {
      grindOffset: 0,
      timeOffset: 0,
      samples: 0
    };
  }

  const model = learningModel[key];

  // Convert confidence into learning weight
  const learningStrength = normalizeConfidence(
    extractionDiagnosis.confidence
  );

  // Ignore ultra-low confidence noise
  if (learningStrength < 0.15) {
    model.samples += 1;
    return;
  }

  // Base step sizes (intentionally small)
  const GRIND_STEP = 0.5;
  const TIME_STEP = 1;

  if (extractionDiagnosis.extractionState === "under") {
    model.grindOffset -= GRIND_STEP * learningStrength;
    model.timeOffset += TIME_STEP * learningStrength;
  }

  if (extractionDiagnosis.extractionState === "over") {
    model.grindOffset += GRIND_STEP * learningStrength;
    model.timeOffset -= TIME_STEP * learningStrength;
  }

  // --------------------------
  // STEP 7: Drift Clamping
  // --------------------------

  model.grindOffset = Math.max(
    -MAX_GRIND_OFFSET,
    Math.min(MAX_GRIND_OFFSET, model.grindOffset)
  );

  model.timeOffset = Math.max(
    -MAX_TIME_OFFSET,
    Math.min(MAX_TIME_OFFSET, model.timeOffset)
  );

  model.samples += 1;
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
  
// --------------------------
// STEP 4: Store Brew & Learn
// --------------------------

brewHistory.push({
  selections,
  scaFeedback,
  extractionDiagnosis,
  timestamp: Date.now()
});
updateLearningModel(selections, extractionDiagnosis);

// --------------------------
// STEP 5: Apply Learning to Recommendation (Read-Only)
// --------------------------

// Example base values (you already calculate these conceptually)
let baseGrindValue = null;
let baseTimeSeconds = null;

// Convert brewRecommendations time → seconds (basic example)
if (brewRecommendations[selections.brewMethod]) {
  const baseTime = brewRecommendations[selections.brewMethod].time;

  if (baseTime.includes("s")) {
    baseTimeSeconds = parseInt(baseTime);
  } else if (baseTime.includes(":")) {
    const parts = baseTime.split(":");
    baseTimeSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
}

// Grinder numeric baseline if available
if (
  selections.grinder &&
  grinderSettings[selections.grinder] &&
  grinderSettings[selections.grinder][selections.brewMethod] !== undefined
) {
  baseGrindValue = grinderSettings[selections.grinder][selections.brewMethod];
}

// Apply learning (safe + gated)
let learningHtml = "";

if (baseGrindValue !== null && baseTimeSeconds !== null) {
  const learnedResult = applyLearning(
    selections,
    baseGrindValue,
    baseTimeSeconds
  );

  learningHtml = `
    <h3>Personalized Learning Layer</h3>
    <p><strong>Status:</strong> ${learnedResult.reason}</p>
    <p><strong>Base Grind:</strong> ${baseGrindValue}</p>
    <p><strong>Base Time:</strong> ${baseTimeSeconds}s</p>
    ${
      learnedResult.learningApplied
        ? `
          <p><strong>Learned Grind:</strong> ${learnedResult.grind}</p>
          <p><strong>Learned Time:</strong> ${learnedResult.time}s</p>
        `
        : `<p><em>Learning not yet applied</em></p>`
    }
  `;
}
  
  output.innerHTML += adjustmentAdvice;
output.innerHTML += learningHtml;


});
