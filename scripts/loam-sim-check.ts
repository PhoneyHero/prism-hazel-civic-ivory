import { runEcologySelfCheck } from "../src/game/selfcheck.ts";

const errors = runEcologySelfCheck();
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("loam ecology self-check ok");
