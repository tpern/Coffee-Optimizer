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

  // Display all results
  let html = "<h3>Your Brew Selection</h3>";
  for (const key in selections) {
    if (selections[key]) html += `<p><strong>${key}:</strong> ${selections[key]}</p>`;
  }

  html += "<h3>Taste Feedback (SCA)</h3>";
  for (const key in scaFeedback) {
    if (scaFeedback[key]) html += `<p><strong>${key}:</strong> ${scaFeedback[key]}</p>`;
  }

  output.innerHTML = html;
});
