// Packages
import test from "@acai/testing";

async function main () {
	await test.find("**/*.test.ts");
	await test.run();
}
  
main();