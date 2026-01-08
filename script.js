// =====================================================
// ELEMENTS
// =====================================================
const brewMethodSelect = document.getElementById("brew-method");
const espressoSection = document.getElementById("espresso-machine-section");
const grinderSelect = document.getElementById("grinder");
const espressoMachineSelect = document.getElementById("espresso-machine");
const userTypeSelect = document.getElementById("user-type");

const MACHINE_CAPABILITIES = {
  "la-marzocco-linea-mini": {
    pressureProfiling: false,
    flowControl: false,
    preInfusion: "mechanical",
    controlType: "fixed"
  },
  "slayer-steam": {
    pressureProfiling: "manual",
    flowControl: true,
    preInfusion: true,
    controlType: "flow-led"
  },
  "synesso-mvp-hydra": {
    pressureProfiling: true,
    flowControl: false,
    preInfusion: true,
    controlType: "pressure-led"
  },
  "decent-de1": {
    pressureProfiling: true,
    flowControl: true,
    preInfusion: true,
    controlType: "programmable"
  }
};

// =====================================================
// PRESSURE PROFILE DEFINITIONS
// =====================================================
const PRESSURE_PROFILES = {
  classic_9bar: {
    label: "Classic 9 Bar",
    requires: { pressureProfiling: false }
  },
  gentle_preinfusion: {
    label: "Gentle Pre-Infusion → 9 Bar",
    requires: { preInfusion: true }
  },
  declining_pressure: {
    label: "Declining Pressure (9 → 6 bar)",
    requires: { pressureProfiling: true }
  },
  slayer_style_flow: {
    label: "Slayer-Style Flow Control",
    requires: { flowControl: true }
  },
  blooming_espresso: {
    label: "Blooming Espresso (Low pressure soak)",
    requires: { pressureProfiling: true, preInfusion: true }
  },
  lever_style_profile: {
    label: "Lever-Style Decline",
    requires: { pressureProfiling: true }
  }
};

// =====================================================
// PRESSURE PROFILE COMPATIBILITY ENGINE
// =====================================================
function evaluatePressureProfile(machineId, profileId) {
  const machine = MACHINE_CAPABILITIES[machineId];
  const profile = PRESSURE_PROFILES[profileId];

  if (!machine || !profile) {
    return { compatible: false, reason: "Unknown machine or profile" };
  }

  const requirements = profile.requires;

  // Check pressure profiling
  if (requirements.pressureProfiling && machine.pressureProfiling !== true) {
    return {
      compatible: false,
      reason: "Machine does not support programmable pressure profiling"
    };
  }

  // Check flow control
  if (requirements.flowControl && machine.flowControl !== true) {
    return {
      compatible: false,
      reason: "Machine lacks flow control capability"
    };
  }

  // Check pre-infusion
  if (requirements.preInfusion && !machine.preInfusion) {
    return {
      compatible: false,
      reason: "Machine does not support pre-infusion"
    };
  }

  // Soft compatibility warnings
  if (machine.pressureProfiling === "manual" && requirements.pressureProfiling) {
    return {
      compatible: true,
      warning: "Profile requires manual control during extraction"
    };
  }

  return { compatible: true };
}

// =====================================================
// SHOW / HIDE ESPRESSO MACHINE SECTION
// =====================================================
brewMethodSelect.addEventListener("change", function () {
  espressoSection.style.display = this.value === "espresso" ? "block" : "none";
});

brewMethodSelect.dispatchEvent(new Event("change"));

// =====================================================
// GRINDER & ESPRESSO MACHINE CATALOGS
// =====================================================

// ---------- HOME GRINDERS (30+) ----------
const HOME_GRINDERS = [
  "baratza-encore",
  "baratza-encore-esp",
  "baratza-sette-30",
  "baratza-sette-270",
  "baratza-virtuoso-plus",
  "fellow-ode",
  "fellow-opus",
  "eureka-mignon-manuale",
  "eureka-mignon-specialita",
  "eureka-mignon-silenzio",
  "breville-smart-grinder-pro",
  "breville-dose-control",
  "lagom-mini",
  "lagom-p64",
  "niche-zero",
  "df64",
  "df83",
  "timemore-sculptor-064",
  "timemore-sculptor-078",
  "comandante-c40",
  "1zpresso-jx",
  "1zpresso-jx-pro",
  "1zpresso-k-max",
  "kingrinder-k6",
  "hario-skerton-pro",
  "hario-mini-mill",
  "wilfa-uniform",
  "oxford-precision",
  "capresso-infinity"
];

// ---------- CAFE / PROFESSIONAL GRINDERS (30+) ----------
const CAFE_GRINDERS = [
  "mazzer-mini",
  "mazzer-super-jolly",
  "mazzer-major",
  "mazzer-robur",
  "mazzer-kony",
  "eureka-atom-65",
  "eureka-atom-75",
  "eureka-atom-pro",
  "mythos-one",
  "mythos-two",
  "ditting-804",
  "ditting-807",
  "ditting-1203",
  "mahlkonig-ek43",
  "mahlkonig-ek43s",
  "mahlkonig-k30",
  "mahlkonig-e65s",
  "mahlkonig-e80s",
  "compak-e10",
  "compak-f8",
  "compak-r120",
  "anfim-scody",
  "anfim-sp-ii",
  "anfim-luna",
  "anfim-pratica",
  "ceado-e37s",
  "ceado-e37z",
  "ceado-e92",
  "ceado-e37sd",
  "victoria-arduino-mythos"
];

// ---------- CAFE ESPRESSO MACHINES (30+) ----------
const CAFE_ESPRESSO_MACHINES = [
  "la-marzocco-linea-pb",
  "la-marzocco-strada",
  "la-marzocco-gs3",
  "la-marzocco-linea-classic",
  "synesso-mvp-hydra",
  "synesso-es1",
  "slayer-steam",
  "slayer-single-group",
  "victoria-arduino-black-eagle",
  "victoria-arduino-white-eagle",
  "nuova-simonelli-aurelia",
  "nuova-simonelli-appia",
  "sanremo-cafe-racer",
  "sanremo-opera",
  "sanremo-f18",
  "rocket-r9",
  "rocket-r58",
  "kvdw-speedster",
  "kvdw-spirit",
  "wega-polaris",
  "wega-atlas",
  "rancilio-classe-11",
  "rancilio-classe-9",
  "ascaia-baby-t",
  "ascaia-steel-uno",
  "ascaia-steel-duo",
  "la-cimbali-m100",
  "la-cimbali-m39",
  "faema-e71",
  "faema-emblema"
];

// =====================================================
// POPULATE DROPDOWNS
// =====================================================
function populateSelect(selectEl, values) {
  selectEl.innerHTML = `<option value="">-- Choose --</option>`;
  values.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v.replace(/-/g, " ").toUpperCase();
    selectEl.appendChild(opt);
  });
}

// =====================================================
// USER TYPE LOGIC (HOME vs CAFE)
// =====================================================
userTypeSelect.addEventListener("change", function () {
  const isCafe = this.value === "cafe";

  populateSelect(
    grinderSelect,
    isCafe ? CAFE_GRINDERS : HOME_GRINDERS
  );

  populateSelect(
    espressoMachineSelect,
    isCafe ? CAFE_ESPRESSO_MACHINES : []
  );

  if (isCafe) {
    brewMethodSelect.value = "espresso";
    brewMethodSelect.dispatchEvent(new Event("change"));
  }
});

// =====================================================
// SMART BREW MAPPING TABLE
// =====================================================
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

// ------------------------
// Grinder Numeric Settings
// ------------------------
const grinderSettings = {
  "baratza-encore": {
    espresso: 0,
    v60: 18,
    chemex: 20,
    "french-press": 25,
    aeropress: 19,
    "moka-pot": 15,
    turkish: 0,
    "balance-siphon": 20,
    syphon: 20,
    "cold-brew": 30
  },
  "baratza-sette-270": {
    espresso: 4,
    v60: 8,
    chemex: 12,
    "french-press": 16,
    aeropress: 10,
    "moka-pot": 6,
    turkish: 0,
    "balance-siphon": 12,
    syphon: 12,
    "cold-brew": 18
  },
  "mazzer-mini": {
    espresso: 4,
    v60: 12,
    chemex: 16,
    "french-press": 20,
    aeropress: 14,
    "moka-pot": 6,
    turkish: 0,
    "balance-siphon": 16,
    syphon: 16,
    "cold-brew": 25
  },
  "mazzer-super-jolly": {
    espresso: 5,
    v60: 13,
    chemex: 17,
    "french-press": 21,
    aeropress: 15,
    "moka-pot": 7,
    turkish: 0,
    "balance-siphon": 17,
    syphon: 17,
    "cold-brew": 26
  },
  "fellow-ode": {
    espresso: 0,
    v60: 5,
    chemex: 7,
    "french-press": 11,
    aeropress: 6,
    "moka-pot": 4,
    turkish: 0,
    "balance-siphon": 8,
    syphon: 8,
    "cold-brew": 11
  }
};

// ------------------------
// STEP 1: SCA → Extraction Diagnosis
// ------------------------
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
    confidence: confidenceValue,
    confidenceDisplay: confidenceValue.toFixed(2),
    signals
  };
}

// ------------------------
// STEP 2: Recipe Adjustment Engine
// ------------------------
function adjustRecipe(extractionDiagnosis, selections) {
  if (extractionDiagnosis.extractionState === "balanced") {
    return `<h3>Adjustment for Next Brew</h3>
<p>Your extraction appears balanced. No changes recommended.</p>`;
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

  return `<h3>Adjustment for Next Brew</h3>
<p><strong>Diagnosis:</strong> ${extractionDiagnosis.extractionState} extraction</p>
<p><strong>Grind Adjustment:</strong> ${grindAdvice}</p>
<p><strong>Time Adjustment:</strong> ${timeAdvice}</p>
<p><strong>Confidence:</strong> ${extractionDiagnosis.confidenceDisplay}</p>`;
}

// ------------------------
// STEP 3: Brew History & Learning Engine
// ------------------------
let brewHistory = [];

// ------------------------
// STEP 4: Learning & Personalization Engine
// ------------------------
let learningModel = {};

// ------------------------
// STEP 4a: Learning Activation Gate
// ------------------------
const MIN_SAMPLES_TO_LEARN = 3;

function applyLearning(selections, baseGrind, baseTimeSeconds) {
  const key = `${selections.grinder}::${selections.brewMethod}`;
  const learned = learningModel[key];

  if (!learned) {
    return {
      grind: baseGrind,
      time: baseTimeSeconds,
      learningApplied: false,
      reason: "No learning data yet"
    };
  }

  if (learned.samples < MIN_SAMPLES_TO_LEARN) {
    return {
      grind: baseGrind,
      time: baseTimeSeconds,
      learningApplied: false,
      reason: `Learning in progress (${learned.samples}/${MIN_SAMPLES_TO_LEARN})`
    };
  }

  return {
    grind: baseGrind + learned.grindOffset,
    time: baseTimeSeconds + learned.timeOffset,
    learningApplied: true,
    reason: "Learning applied"
  };
}

// ------------------------
// STEP 6 + 7: Confidence-Weighted Learning WITH Drift Control
// ------------------------
function normalizeConfidence(confidence) {
  const MAX_CONFIDENCE = 3;
  return Math.min(confidence / MAX_CONFIDENCE, 1);
}

const MAX_GRIND_OFFSET = 4;
const MAX_TIME_OFFSET = 12;

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

  const learningStrength = normalizeConfidence(extractionDiagnosis.confidence);

  if (learningStrength < 0.15) {
    model.samples += 1;
    return;
  }

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

// ------------------------
// STEP 8: Persistence Layer
// ------------------------
const STORAGE_KEYS = {
  history: "coffee_brew_history",
  learning: "coffee_learning_model"
};

(function loadPersistedData() {
  const savedHistory = localStorage.getItem(STORAGE_KEYS.history);
  const savedLearning = localStorage.getItem(STORAGE_KEYS.learning);

  if (savedHistory) {
    try {
      brewHistory = JSON.parse(savedHistory);
    } catch (e) {
      console.warn("Failed to load brew history");
    }
  }

  if (savedLearning) {
    try {
      learningModel = JSON.parse(savedLearning);
    } catch (e) {
      console.warn("Failed to load learning model");
    }
  }
})();

function persistLearningData() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(brewHistory));
  localStorage.setItem(STORAGE_KEYS.learning, JSON.stringify(learningModel));
}

// ------------------------
// STEP 9: Learning Reset & Control Layer
// ------------------------
function resetLearningFor(selections) {
  const key = `${selections.grinder}::${selections.brewMethod}`;
  if (learningModel[key]) {
    delete learningModel[key];
    persistLearningData();
    console.info(`Learning reset for ${key}`);
  }
}

function resetAllLearning() {
  learningModel = {};
  persistLearningData();
  console.info("All learning reset");
}

function resetBrewHistory() {
  brewHistory = [];
  persistLearningData();
  console.info("Brew history reset");
}

function resetEverything() {
  brewHistory = [];
  learningModel = {};
  persistLearningData();
  console.info("All data reset");
}

// ------------------------
// STEP 10: Debug / Inspector Output
// ------------------------
const DEBUG_MODE = true;

function renderDebugInspector() {
  if (!DEBUG_MODE) return;

  const inspector = document.getElementById("debug-inspector");
  if (!inspector) return;

  inspector.innerHTML = `<h3>⚙️ Debug Inspector</h3>
<h4>Learning Model</h4>
<pre>${JSON.stringify(learningModel, null, 2)}</pre>
<h4>Brew History (${brewHistory.length} entries)</h4>
<pre>${JSON.stringify(brewHistory, null, 2)}</pre>`;
}

// ------------------------
// STEP 11: Learning Portability (Export / Import)
// ------------------------
const EXPORT_VERSION = 1;

function exportLearningData() {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    brewHistory,
    learningModel
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "coffee-learning-backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.info("Learning data exported");
}

function importLearningData(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    try {
      const parsed = JSON.parse(event.target.result);

      if (
        typeof parsed !== "object" ||
        parsed.version !== EXPORT_VERSION ||
        !Array.isArray(parsed.brewHistory) ||
        typeof parsed.learningModel !== "object"
      ) {
        alert("Invalid or incompatible learning file");
        return;
      }

      brewHistory = parsed.brewHistory;
      learningModel = parsed.learningModel;

      persistLearningData();

      console.info("Learning data imported successfully");
      alert("Learning data imported successfully");
    } catch (err) {
      console.error("Import failed", err);
      alert("Failed to import learning data");
    }
  };

  reader.readAsText(file);
}

// ------------------------
// BUTTON 1: Get Initial Recipe (No Feedback Required)
// ------------------------
document.getElementById("submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");

  const selections = {
    userType: document.getElementById("user-type").value,
    brewMethod: document.getElementById("brew-method").value,
    grinder: document.getElementById("grinder").value
  };

  // Validate required fields
  if (!selections.brewMethod || !selections.grinder) {
    output.innerHTML = `<p style="color:#b91c1c;">Please select a brew method and grinder first.</p>`;
    return;
  }

  const brewRec = brewRecommendations[selections.brewMethod];
  
  let baseGrindValue = null;
  let baseTimeSeconds = null;

  if (brewRec) {
    const baseTime = brewRec.time;
    if (baseTime.includes("s")) {
      baseTimeSeconds = parseInt(baseTime);
    } else if (baseTime.includes(":")) {
      const parts = baseTime.split(":");
      baseTimeSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
  }

  if (
    selections.grinder &&
    grinderSettings[selections.grinder] &&
    grinderSettings[selections.grinder][selections.brewMethod] !== undefined
  ) {
    baseGrindValue = grinderSettings[selections.grinder][selections.brewMethod];
  }

  // Apply any existing learning
  let recipeHtml = `<h3>Initial Brew Recipe</h3>`;
  
  if (brewRec) {
    recipeHtml += `<p><strong>Dose:</strong> ${brewRec.dose}</p>
<p><strong>Yield:</strong> ${brewRec.yield}</p>
<p><strong>Time:</strong> ${brewRec.time}</p>
<p><strong>Grind:</strong> ${brewRec.grind}</p>`;
  }

  if (baseGrindValue !== null) {
    recipeHtml += `<p><strong>Grinder Setting:</strong> ${baseGrindValue}</p>`;
  }

  // Check if learning exists for this combo
  if (baseGrindValue !== null && baseTimeSeconds !== null) {
    const learnedResult = applyLearning(selections, baseGrindValue, baseTimeSeconds);
    
    if (learnedResult.learningApplied) {
      recipeHtml += `<h4 style="margin-top:1em;">🎯 Personalized Adjustments</h4>
<p><strong>Learned Grind:</strong> ${learnedResult.grind}</p>
<p><strong>Learned Time:</strong> ${learnedResult.time}s</p>
<p style="font-size:0.9em; color:#15803d;">Based on ${learningModel[`${selections.grinder}::${selections.brewMethod}`].samples} previous brews</p>`;
    } else {
      recipeHtml += `<p style="font-size:0.9em; color:#666; margin-top:1em;">${learnedResult.reason}</p>`;
    }
  }

  recipeHtml += `<p style="margin-top:1em; font-style:italic;">Brew this recipe, then rate it below to help improve future recommendations.</p>`;

  output.innerHTML = recipeHtml;
});

// ------------------------
// BUTTON 2: Submit Feedback & Learn
// ------------------------
document.getElementById("feedback-submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");

  const selections = {
    userType: document.getElementById("user-type").value,
    brewMethod: document.getElementById("brew-method").value,
    grinder: document.getElementById("grinder").value
  };

  // Validate required fields
  if (!selections.brewMethod || !selections.grinder) {
    output.innerHTML = `<p style="color:#b91c1c;">Please get an initial recipe first using the button above.</p>`;
    return;
  }

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

  brewHistory.push({
    selections,
    scaFeedback,
    extractionDiagnosis,
    timestamp: Date.now()
  });

  updateLearningModel(selections, extractionDiagnosis);

  persistLearningData();
  renderDebugInspector();

  let baseGrindValue = null;
  let baseTimeSeconds = null;

  if (brewRecommendations[selections.brewMethod]) {
    const baseTime = brewRecommendations[selections.brewMethod].time;
    if (baseTime.includes("s")) {
      baseTimeSeconds = parseInt(baseTime);
    } else if (baseTime.includes(":")) {
      const parts = baseTime.split(":");
      baseTimeSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
  }

  if (
    selections.grinder &&
    grinderSettings[selections.grinder] &&
    grinderSettings[selections.grinder][selections.brewMethod] !== undefined
  ) {
    baseGrindValue = grinderSettings[selections.grinder][selections.brewMethod];
  }

  let learningHtml = "";
  if (baseGrindValue !== null && baseTimeSeconds !== null) {
    const learnedResult = applyLearning(selections, baseGrindValue, baseTimeSeconds);

    learningHtml = `<h3>Personalized Learning Layer</h3>
<p><strong>Status:</strong> ${learnedResult.reason}</p>
<p><strong>Base Grind:</strong> ${baseGrindValue}</p>
<p><strong>Base Time:</strong> ${baseTimeSeconds}s</p>
${
  learnedResult.learningApplied
    ? `<p><strong>Learned Grind:</strong> ${learnedResult.grind}</p>
<p><strong>Learned Time:</strong> ${learnedResult.time}s</p>`
    : `<p><em>Learning not yet applied</em></p>`
}`;
  }

  output.innerHTML = adjustmentAdvice + learningHtml;
  
  // Scroll to output
  output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});


// =====================================================
// PRESSURE PROFILE UI WIRING
// =====================================================
const pressureProfileSelect = document.getElementById("pressure-profile");
const pressureProfileSection = document.getElementById("pressure-profile-section");
const pressureProfileWarning = document.getElementById("pressure-profile-warning");

function populatePressureProfiles() {
  if (!pressureProfileSelect) return;
  pressureProfileSelect.innerHTML = `<option value="">-- Choose pressure profile --</option>`;

  Object.entries(PRESSURE_PROFILES).forEach(([id, profile]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = profile.label;
    pressureProfileSelect.appendChild(opt);
  });
}

brewMethodSelect.addEventListener("change", function () {
  const isEspresso = this.value === "espresso";
  espressoSection.style.display = isEspresso ? "block" : "none";
  pressureProfileSection.style.display = "none";
  pressureProfileWarning.textContent = "";
});

espressoMachineSelect.addEventListener("change", function () {
  if (!this.value) {
    pressureProfileSection.style.display = "none";
    return;
  }

  populatePressureProfiles();
  pressureProfileSection.style.display = "block";
});

function updatePressureProfileFeedback() {
  const machineId = espressoMachineSelect.value;
  const profileId = pressureProfileSelect.value;

  pressureProfileWarning.textContent = "";
  pressureProfileWarning.style.color = "#444";

  if (!machineId || !profileId) return;

  const result = evaluatePressureProfile(machineId, profileId);

  if (!result.compatible) {
    pressureProfileWarning.textContent = `❌ ${result.reason}`;
    pressureProfileWarning.style.color = "#b91c1c";
    return;
  }

  if (result.warning) {
    pressureProfileWarning.textContent = `⚠️ ${result.warning}`;
    pressureProfileWarning.style.color = "#b45309";
    return;
  }

  pressureProfileWarning.textContent = "✅ Compatible with this machine";
  pressureProfileWarning.style.color = "#15803d";
}

pressureProfileSelect.addEventListener("change", updatePressureProfileFeedback);
espressoMachineSelect.addEventListener("change", updatePressureProfileFeedback);
