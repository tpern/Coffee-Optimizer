// ------------------------
// Grinder Mapping Table
// ------------------------
const grinderMap = {
  "baratza_Encore": { espresso: "Fine (14-16)", v60: "Medium-Fine (20-22)", chemex: "Medium-Fine (20-22)", french_press: "Medium-Coarse (24-26)", aeropress: "Medium-Fine (18-20)", siphon: "Medium-Fine (20-22)", cold_brew: "Coarse (25-27)", moka_pot: "Fine (15-17)", batch_brew: "Medium-Fine (20-22)" },
  "baratza_S207": { espresso: "Fine (9-11)", v60: "Medium-Fine (15-17)", chemex: "Medium-Fine (15-17)", french_press: "Medium-Coarse (18-20)" },
  "baratza_Vario": { espresso: "Extra Fine (5-7)", v60: "Medium-Fine (12-14)", chemex: "Medium-Fine (12-14)", french_press: "Medium-Coarse (16-18)" },
  "fellow_Ottimo": { espresso: "Fine (8-10)", v60: "Medium-Fine (14-16)", french_press: "Medium (17-19)" },
  "mazzer_Super_Jolly": { espresso: "Extra Fine (1-3)", v60: "Medium-Fine (6-8)", french_press: "Medium-Coarse (9-11)" },
  "mazzer_minim": { espresso: "Extra Fine (1-3)", v60: "Medium-Fine (6-8)", french_press: "Medium-Coarse (9-11)" },
  "ek43": { espresso: "Extra Fine (1-2)", v60: "Medium (3-5)", french_press: "Medium-Coarse (6-7)" },
  "wilfa_SVart": { espresso: "Fine (5-7)", v60: "Medium-Fine (10-12)", french_press: "Medium-Coarse (13-15)" },
  "niche_zero": { espresso: "Fine (5-6)", v60: "Medium-Fine (10-11)", french_press: "Medium-Coarse (12-14)" },
  "liddell": { espresso: "Fine (6-8)", v60: "Medium-Fine (11-13)", french_press: "Medium-Coarse (14-16)" },
  "comandante_C40": { espresso: "Fine (7-9)", v60: "Medium-Fine (12-14)", press: "Medium-Coarse (15-17)" },
  "eureka_Mignon_Specialita": { espresso: "Fine (5-6)", v60: "Medium-Fine (10-12)", french_press: "Medium-Coarse (13-15)" },
  "rocket_R58_grinder": { espresso: "Extra Fine (1-3)", v60: "Medium-Fine (6-8)", french_press: "Medium-Coarse (9-11)" },
  "puteus": { espresso: "Fine (6-8)", v60: "Medium-Fine (11-13)", french_press: "Medium-Coarse (14-16)" },
  "breville_BCG820BSS": { espresso: "Fine (5-7)", v60: "Medium-Fine (10-12)", french_press: "Medium-Coarse (13-15)" },
  "rancilio_rocky": { espresso: "Fine (5-6)", v60: "Medium-Fine (10-12)", french_press: "Medium-Coarse (13-15)" },
  "baratza_preciso": { espresso: "Fine (6-8)", v60: "Medium-Fine (12-14)", french_press: "Medium-Coarse (15-17)" },
  "sbdx": { espresso: "Fine (5-6)", v60: "Medium-Fine (10-12)", french_press: "Medium-Coarse (13-15)" },
  "df64": { espresso: "Extra Fine (1-3)", v60: "Medium-Fine (6-8)", french_press: "Medium-Coarse (9-11)" },
  "other": { espresso: "Fine", v60: "Medium-Fine", french_press: "Medium-Coarse" }
};

// ------------------------
// Main Function
// ------------------------
function generateRecipe() {
  const roast = document.getElementById("roast").value;
  const process = document.getElementById("process").value;
  const method = document.getElementById("method").value;
  const water = document.getElementById("water").value;
  const hardness = document.getElementById("hardness").value;
  const grinder = document.getElementById("grinder").value;
  const sweetness = document.getElementById("sweetness").value;
  const acidity = document.getElementById("acidity").value;
  const body = document.getElementById("body").value;
  const flavor = document.getElementById("flavor").value;
  const notes = document.getElementById("notes").value;

  // Base calculations (simplified example)
  let temperature = 92; // default
  if (roast === "light") temperature += 2;
  if (roast === "dark") temperature -= 2;

  let ratio = "1:16"; // default
  if (method === "espresso") ratio = "1:2";
  if (method === "cold_brew") ratio = "1:8";

  let grindCategory = "Medium-Fine"; // default
  if (method === "espresso") grindCategory = "Fine";
  else if (method === "french_press") grindCategory = "Medium-Coarse";

  // Grinder adjustments
  let grind;
  if (grinderMap[grinder] && grinderMap[grinder][method]) {
    grind = grinderMap[grinder][method];
  } else {
    grind = grindCategory;
  }

  // Build brew object
  const brew = {
    roast, process, method, water, hardness, grinder,
    grind, temperature, ratio,
    feedback: { sweetness, acidity, body, flavor, notes },
    timestamp: Date.now()
  };

  // Save locally
  let storedBrews = JSON.parse(localStorage.getItem("brews") || "[]");
  storedBrews.push(brew);
  localStorage.setItem("brews", JSON.stringify(storedBrews));

  // Display result
  document.getElementById("result").innerText =
`=== Your Brew Recommendation ===
Roast: ${roast}
Process: ${process}
Brew Method: ${method}
Temperature: ${temperature}°C
Ratio: ${ratio}
Grind Recommendation: ${grind}
Grinder Used: ${grinder.replace("_", " ")}
Water: ${water.replace("_", " ")} (${hardness})`;

  const historyHtml = storedBrews.reverse().map(b => {
    return `
<div style="background: #fff; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #ddd;">
  <strong>${new Date(b.timestamp).toLocaleString()}</strong><br>
  Method: ${b.method} | Roast: ${b.roast}<br>
  Temp: ${b.temperature}°C | Ratio: ${b.ratio}<br>
  Grind: ${b.grind}<br>
  <em>Feedback: ${b.feedback.sweetness} sweetness, ${b.feedback.acidity} acidity, ${b.feedback.body} body</em>
</div>`;
  }).join("");

  document.getElementById("lastBrew").innerHTML = "<h3>Previous Sessions & Feedback</h3>" + historyHtml;
}
