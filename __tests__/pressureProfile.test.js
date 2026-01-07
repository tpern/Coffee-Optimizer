const {
  PRESSURE_PROFILES,
  evaluatePressureProfile
} = require("../script");

test("pressure profiles exist", () => {
  expect(PRESSURE_PROFILES).toBeDefined();
});

test("classic 9 bar works on Linea Mini", () => {
  const result = evaluatePressureProfile(
    "la-marzocco-linea-mini",
    "classic_9bar"
  );

  expect(result.compatible).toBe(true);
});
