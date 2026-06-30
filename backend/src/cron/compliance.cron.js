import cron from "node-cron";
import { generateComplianceForAllBusinesses } from "../services/compliance.service.js";

// cron.schedule("5 0 * * *", async () => {
//   const today = new Date();
//   if (today.getDate() !== 1) return;
//   console.log("Generating monthly compliance...");
//   await generateComplianceForAllBusinesses();
//   console.log("Monthly compliance generated.");
// });

cron.schedule("0 0 1 * *", async () => {
  console.log("Generating monthly compliance...");
  await generateComplianceForAllBusinesses();
  console.log("Monthly compliance generated.");
});