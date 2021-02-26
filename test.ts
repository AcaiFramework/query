// Packages
import test from "@acai/testing";

async function main () {
	await test.find("src/**/*.test.ts");
	await test.run();
}
  
main();