// Elements
const brewMethodSelect = document.getElementById("brew-method");
const espressoSection = document.getElementById("espresso-machine-section");

// Show/hide espresso machine section
brewMethodSelect.addEventListener("change", function () {
  if (this.value === "espresso") {
    espressoSection.style.display = "block";
  } else {
    espressoSection.style.display = "none";
  }
});

// Smart Brew Mapping Table
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

// Grinder numeric adjustments (clicks / burrs)
const grinderSettings = {
  "baratza-encore": { "espresso": 0, "v60": 18, "chemex": 20, "french-press": 25, "aeropress": 19, "moka-pot": 15, "turkish": 0, "balance-siphon": 20, "syphon": 20, "cold-brew": 30 },
  "baratza-sette-270": { "espresso": 4, "v60": 8, "chemex": 12, "french-press": 16, "aeropress": 10, "moka-pot": 6, "turkish": 0, "balance-siphon": 12, "syphon": 12, "cold-brew": 18 },
  "mazzer-mini": { "espresso": 4, "v60": 12, "chemex": 16, "french-press": 20, "aeropress": 14, "moka-pot": 6, "turkish": 0, "balance-siphon": 16, "syphon": 16, "cold-brew": 25 },
  "mazzer-super-jolly": { "espresso": 5, "v60": 13, "chemex": 17, "french-press": 21, "aeropress": 15, "moka-pot": 7, "turkish": 0, "balance-siphon": 17, "syphon": 17, "cold-brew": 26 },
  "fellow-ode": { "espresso": 0, "v60": 18, "chemex": 21, "french-press": 25, "aeropress": 20, "moka-pot": 0, "turkish": 0, "balance-siphon": 21, "syphon": 21, "cold-brew": 28 },
  // Add remaining top grinders here
};

// Submit button listener
document.getElementById("submit-btn").addEventListener("click", function () {
  const output = document.getElementById("output");

  // Collect all selections
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

  // Generate Smart Brew Recommendation
  let brewAdvice = "";
  if (selections.brewMethod && brewRecommendations[selections.brewMethod]) {
    const rec = brewRecommendations[selections.brewMethod];
    let grindOutput = rec.grind;

    if (selections.grinder && grinderSettings[selections.grinder] && grinderSettings[selections.grinder][selections.brewMethod] !== undefined) {
      grindOutput = grinderSettings[selections.grinder][selections.brewMethod] + (selections.brewMethod==="espresso"?" (fine burr clicks)":" (medium/fine scale)");
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

  // Display all results
  let html = "<h3>Your Brew Selection</h3>";
  for (const key in selections) {
    if (selections[key]) html += `<p><strong>${key}:</strong> ${selections[key]}</p>`;
  }

  html += brewAdvice;

  html += "<h3>Taste Feedback (SCA)</h3>";
  for (const key in scaFeedback) {
    if (scaFeedback[key]) html += `<p><strong>${key}:</strong> ${scaFeedback[key]}</p>`;
  }

  output.innerHTML = html;
});
