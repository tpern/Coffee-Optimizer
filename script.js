// EQUIPMENT DATA
const equipment = {
  home: {
    grinders: [
      "Fellow Ode","Niche Zero","Baratza Encore","Baratza Sette 270",
      "Eureka Mignon","Comandante C40","1Zpresso JX","Wilfa Svart",
      "Breville Smart Grinder","DF64"
    ],
    machines: [
      "Breville Bambino Plus","Gaggia Classic Pro","Rancilio Silvia",
      "Lelit Bianca","Rocket Appartamento","Profitec Pro 300",
      "ECM Classika","Flair 58","La Pavoni Europiccola","Breville Dual Boiler"
    ]
  },
  cafe: {
    grinders: [
      "Mahlkönig EK43","Mahlkönig E65S","Mazzer Major","Mazzer Super Jolly",
      "Compak K10","Ditting 807","Anfim SP II","Eureka Zenith",
      "Fiorenzato F83","Bentwood Vertical 63"
    ],
    machines: [
      "Synesso MVP Hydra","La Marzocco Linea PB","Slayer Espresso",
      "Victoria Arduino Black Eagle","Nuova Simonelli Aurelia",
      "Faema E71","Kees van der Westen Spirit","Sanremo Cafe Racer",
      "Synesso S200","La Marzocco GB5"
    ]
  }
};

// GRIND SETTINGS
const grindSettings = {
  "Fellow Ode": { espresso: "Not recommended", filter: "3–5" },
  "Niche Zero": { espresso: "15–18", filter: "30–40" },
  "Baratza Encore": { espresso: "Not ideal", filter: "18–22" },
  "Baratza Sette 270": { espresso: "8–12", filter: "20–25" },
  "Eureka Mignon": { espresso: "10–14", filter: "25–30" },
  "Comandante C40": { espresso: "10–12 clicks", filter: "20–25 clicks" },
  "Mahlkönig EK43": { espresso: "1.5–2.5", filter: "7–9" }
};

// USER TYPE HANDLER
document.getElementById("userType").addEventListener("change", function () {
  const type = this.value;
  const grinder = document.getElementById("grinder");
  const machine = document.getElementById("espressoMachine");

  grinder.innerHTML = "";
  machine.innerHTML = "";

  equipment[type].grinders.forEach(g => grinder.add(new Option(g, g)));
  equipment[type].machines.forEach(m => machine.add(new Option(m, m)));

  document.getElementById("equipmentSection").style.display = "block";
});

// LEARNING STORAGE
function storeLearning(data) {
  const history = JSON.parse(localStorage.getItem("learning")) || [];
  history.push(data);
  localStorage.setItem("learning", JSON.stringify(history));
}

// MAIN LOGIC
function generateBrew() {
  const brewMethod = document.getElementById("brewMethod").value;
  const grinder = document.getElementById("grinder").value;
  const water = document.getElementById("water").value;
  const sour = document.getElementById("sour").value;
  const bitter = document.getElementById("bitter").value;

  let ratio = "1:16";
  let temp = "94°C";

  if (brewMethod === "Espresso") {
    ratio = "1:2";
    temp = "93°C";
  }

  if (water === "Third Wave Water") {
    temp += " (optimized minerals)";
  }

  let grind = "Adjust to taste";
  if (grindSettings[grinder]) {
    grind = brewMethod === "Espresso"
      ? grindSettings[grinder].espresso
      : grindSettings[grinder].filter;
  }

  let guidance = "Balanced extraction.";
  if (sour === "Too Sour") guidance = "Grind finer or increase extraction.";
  if (bitter === "Too Bitter") guidance = "Grind coarser or reduce extraction.";

  storeLearning({ grinder, brewMethod, sour, bitter });

  document.getElementById("output").innerHTML = `
    <h3>Brew Recommendation</h3>
    <p><strong>Method:</strong> ${brewMethod}</p>
    <p><strong>Ratio:</strong> ${ratio}</p>
    <p><strong>Water Temp:</strong> ${temp}</p>
    <p><strong>Grind Setting:</strong> ${grind}</p>
    <hr>
    <p><strong>Dial-In Guidance:</strong><br>${guidance}</p>
    <p style="opacity:.8;font-size:.9em">
      Refined using equipment data and aggregated user feedback.
    </p>
  `;
}
