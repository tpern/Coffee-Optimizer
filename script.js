// =====================================================
// ELEMENTS
// =====================================================
const brewMethodSelect = document.getElementById("brew-method");
const espressoSection = document.getElementById("espresso-machine-section");
const grinderSelect = document.getElementById("grinder");
const espressoMachineSelect = document.getElementById("espresso-machine");
const userTypeSelect = document.getElementById("user-type");

// =====================================================
// MACHINE CAPABILITIES
// =====================================================
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

  if (requirements.pressureProfiling && machine.pressureProfiling !== true) {
    return {
      compatible: false,
      reason: "Machine does not support programmable pressure profiling"
    };
  }

  if (requirements.flowControl && machine.flowControl !== true) {
    return {
      compatible: false,
      reason: "Machine lacks flow control capability"
    };
  }

  if (requirements.preInfusion && !machine.preInfusion) {
    return {
      compatible: false,
      reason: "Machine does not support pre-infusion"
    };
  }

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
  espressoSection.style.display =
    this.value === "espresso" ? "block" : "none";
});
brewMethodSelect.dispatchEvent(new Event("change"));

// =====================================================
// USER TYPE LOGIC (HOME vs CAFE)
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

userTypeSelect.addEventListener("change", function () {
  const isCafe = this.value === "cafe";
  populateSelect(grinderSelect, isCafe ? CAFE_GRINDERS : HOME_GRINDERS);
  populateSelect(espressoMachineSelect, isCafe ? CAFE_ESPRESSO_MACHINES : []);

  if (isCafe) {
    brewMethodSelect.value = "espresso";
    brewMethodSelect.dispatchEvent(new Event("change"));
  }
});

// =====================================================
// PRESSURE PROFILE UI WIRING (GLOBAL, RUNS ONCE)
// =====================================================
const pressureProfileSelect = document.getElementById("pressure-profile");
const pressureProfileSection = document.getElementById("pressure-profile-section");
const pressureProfileWarning = document.getElementById("pressure-profile-warning");

function populatePressureProfiles() {
  if (!pressureProfileSelect) return;
  pressureProfileSelect.innerHTML =
    `<option value="">-- Choose pressure profile --</option>`;

  Object.entries(PRESSURE_PROFILES).forEach(([id, profile]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = profile.label;
    pressureProfileSelect.appendChild(opt);
  });
}

brewMethodSelect.addEventListener("change", function () {
  if (!pressureProfileSection) return;
  pressureProfileSection.style.display = "none";
  if (pressureProfileWarning) pressureProfileWarning.textContent = "";
});

espressoMachineSelect.addEventListener("change", function () {
  if (!pressureProfileSection) return;

  if (!this.value) {
    pressureProfileSection.style.display = "none";
    return;
  }

  populatePressureProfiles();
  pressureProfileSection.style.display = "block";
});

function updatePressureProfileFeedback() {
  if (!pressureProfileWarning) return;

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

if (pressureProfileSelect) {
  pressureProfileSelect.addEventListener(
    "change",
    updatePressureProfileFeedback
  );
}

if (espressoMachineSelect) {
  espressoMachineSelect.addEventListener(
    "change",
    updatePressureProfileFeedback
  );
}

// ==============================
// TEST EXPORTS (safe for browser)
// ==============================
if (typeof module !== "undefined") {
  module.exports = {
    PRESSURE_PROFILES,
    evaluatePressureProfile
  };
}

// =====================================================
// SUBMIT BUTTON — BREW LOGIC ONLY
// =====================================================
document.getElementById("submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");
  output.innerHTML = "";

  // (your existing brew, learning, and output logic continues here unchanged)
});
