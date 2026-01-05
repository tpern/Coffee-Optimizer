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

  // Espresso-first assumption for cafés
  if (isCafe) {
    brewMethodSelect.value = "espresso";
    brewMethodSelect.dispatchEvent(new Event("change"));
  }
});

// --------------------------
// Smart Brew Mapping Table
// --------------------------
const brewRecommendations = {
  "espresso": { dose:"18-20g", yield:"36-40g", time:"25-30s", grind:"fine" },
  "v60": { dose:"15-18g", yield:"250-300ml", time:"2:30-3:30 min", grind:"medium-fine" },
  "chemex": { dose:"20-25g", yield:"400-500ml", time:"3:30-4:30 min", grind:"medium-coarse" },
  "french-press": { dose:"30g", yield:"500ml", time:"4-5 min", grind:"coarse" },
  "aeropress": { dose:"16g", yield:"250ml", time:"1:30-2:00 min", grind:"medium" },
  "moka-pot": { dose:"15-20g", yield:"150-250ml", time:"3-5 min", grind:"fine" },
  "turkish": { dose:"10g", yield:"100ml", time:"2-3 min", grind:"extra-fine" },
  "balance-siphon": { dose:"20g", yield:"300ml", time:"3-4 min", grind:"medium" },
  "syphon": { dose:"20g", yield:"300ml", time:"3-4 min", grind:"medium" },
  "cold-brew": { dose:"100g", yield:"1L", time:"12-18 hr", grind:"coarse" }
};

// --------------------------
// Grinder Numeric Settings (actual ranges)
// --------------------------
const grinderSettings = {
  "baratza-encore": { "espresso": 0, "v60": 18, "chemex": 20, "french-press": 25, "aeropress": 19, "moka-pot": 15, "turkish": 0, "balance-siphon": 20, "syphon": 20, "cold-brew": 30 },
  "baratza-sette-270": { "espresso": 4, "v60": 8, "chemex": 12, "french-press": 16, "aeropress": 10, "moka-pot": 6, "turkish": 0, "balance-siphon": 12, "syphon": 12, "cold-brew": 18 },
  "mazzer-mini": { "espresso": 4, "v60": 12, "chemex": 16, "french-press": 20, "aeropress": 14, "moka-pot": 6, "turkish": 0, "balance-siphon": 16, "syphon": 16, "cold-brew": 25 },
  "mazzer-super-jolly": { "espresso": 5, "v60": 13, "chemex": 17, "french-press": 21, "aeropress": 15, "moka-pot": 7, "turkish": 0, "balance-siphon": 17, "syphon": 17, "cold-brew": 26 },
  "fellow-ode": { "espresso": 0, "v60": 5, "chemex": 7, "french-press": 11, "aeropress": 6, "moka-pot": 4, "turkish": 0, "balance-siphon": 8, "syphon": 8, "cold-brew": 11 }
  // Add remaining top grinders here
};

// --------------------------
// Submit Button Listener
// --------------------------
document.getElementById("submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");

  // --------------------------
  // Collect Coffee Selections
  // --------------------------
  const selections = {
    userType: document.getElementById("user-type").value,
    origin: document.getElementById("origin").value,
    altitude: document.getElementById("altitude").value,
    varietal: document.getElementById("varietal").value,
    roastDate: document.getElementById("roast-date").value,
    processing: document.getElementById("processing").value,
    roastLevel: document.getElementById("roast-level").value,
    brewMethod: document.getElementById("brew-method").value,
    espressoMachine: document.getElementById("espresso-machine").value,
    grinder: document.getElementById("grinder").value,
    waterType: document.getElementById("water-type").value
  };

  // --------------------------
  // Collect SCA Taste Feedback
  // --------------------------
  const scaFeedback = {
    aroma: document.getElementById("aroma").value,
    flavor: document.getElementById("flavor").value,
    aftertaste: document.getElementById("aftertaste").value,
    acidity: document.getElementById("acidity").value,
    body: document.getElementById("body").value,
    balance: document.getElementById("balance").value,
    sweetness: document.getElementById("sweetness").value,
    cleanCup: document.getElementById("clean-cup").value,
    uniformity: document.getElementById("uniformity").value,
    overall: document.getElementById("overall").value,
    comments: document.getElementById("taste-comments").value
  };

  // --------------------------
  // Generate Smart Brew Recommendation
  // --------------------------
  let brewAdvice = "";
  if (selections.brewMethod && brewRecommendations[selections.brewMethod]) {
    const rec = brewRecommendations[selections.brewMethod];
    let grindOutput = rec.grind;

    // Apply grinder-specific numeric ranges
    if (selections.grinder && grinderSettings[selections.grinder] && grinderSettings[selections.grinder][selections.brewMethod] !== undefined) {
      grindOutput = grinderSettings[selections.grinder][selections.brewMethod];
      grindOutput += selections.brewMethod === "espresso" ? " (fine burr clicks)" : " (grind scale)";
    }

    brewAdvice = `<h3>Smart Brew Recommendation</h3>
      <p><strong>Grind:</strong> ${grindOutput}</p>
      <p><strong>Dose:</strong> ${rec.dose}</p>
      <p><strong>Yield:</strong> ${rec.yield}</p>
      <p><strong>Time:</strong> ${rec.time}</p>`;

    if (selections.espressoMachine && selections.brewMethod === "espresso") {
      brewAdvice += `<p><strong>Espresso Machine:</strong> ${selections.espressoMachine}</p>`;
    }
  }

  // --------------------------
  // Generate "Why & How" Section
  // --------------------------
  let whyHowText = "";
  switch(selections.brewMethod) {
    case "v60":
      whyHowText = "V60 uses a medium-fine grind to control flow rate. Bloom for 30 seconds to release CO₂, then pour in concentric circles to ensure even extraction.";
      break;
    case "espresso":
      whyHowText = `Espresso uses a fine grind to slow extraction. Dose ${brewRecommendations["espresso"].dose}, tamp evenly, and pull the shot at 9 bar pressure for 25-30 seconds.`;
      break;
    case "chemex":
      whyHowText = "Chemex requires medium-coarse grind for slower filtration and clean cup clarity. Use consistent pouring to maintain water level.";
      break;
    case "french-press":
      whyHowText = "French press uses coarse grind for full-bodied extraction. Stir after adding water and steep for 4-5 minutes before pressing.";
      break;
    case "aeropress":
      whyHowText = "Aeropress allows for medium grind and short brew time. Adjust pressure and stir for consistent extraction.";
      break;
    case "moka-pot":
      whyHowText = "Moka pot requires fine grind to create proper pressure. Fill water just below the valve and heat evenly.";
      break;
    case "turkish":
      whyHowText = "Turkish coffee requires extra-fine grind. Use low heat and stir constantly to avoid boiling over.";
      break;
    case "balance-siphon":
      whyHowText = "Balance siphon uses medium grind. Ensure proper water temp and watch vapor pressure to control extraction.";
      break;
    case "syphon":
      whyHowText = "Syphon uses medium grind. Control heat carefully for consistent brew and clarity.";
      break;
    case "cold-brew":
      whyHowText = "Cold brew uses coarse grind for long extraction. Steep 12-18 hours in cold water for smooth flavor.";
      break;
    default:
      whyHowText = "Adjust grind, dose, and time according to your equipment for optimal extraction.";
  }

  // --------------------------
  // Display Coffee Selections & Brew Recommendation
  // --------------------------
  let html = "<h3>Your Brew Selection</h3>";
  for (const key in selections) {
    if (selections[key]) html += `<p><strong>${key}:</strong> ${selections[key]}</p>`;
  }
  html += brewAdvice;

  // --------------------------
  // Display Why & How
  // --------------------------
  html += `<div id="why-how"><h3>Why & How</h3><p>${whyHowText}</p></div>`;

  // --------------------------
  // Display Taste Feedback Separately (SCA)
  // --------------------------
  let feedbackHtml = "<h3>Taste Feedback (SCA)</h3>";
  for (const key in scaFeedback) {
    if (scaFeedback[key]) feedbackHtml += `<p><strong>${key}:</strong> ${scaFeedback[key]}</p>`;
  }

  output.innerHTML = html + feedbackHtml;

  // --------------------------
  // Future improvements:
  // - Adjust brew recommendation based on water type
  // - Adjust grind slightly based on origin, altitude, roast level, varietal
  // - Use backend to learn from taste feedback and improve suggestions over time
  // --------------------------
});
