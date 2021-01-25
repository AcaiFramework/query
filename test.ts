// Packages
import test from "https://deno.land/x/acai_testing@1.0.8hotfix/mod.ts";

await test.find(/\S\.(test|tests)\.(js|ts)$/);
await test.run();