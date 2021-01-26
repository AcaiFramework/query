import { SqlQuery } from "./mod.ts";

await SqlQuery.toggleSettings({
	hostname: "127.0.0.1",
	username: "root",
	db: "adonis_lexxer",
	password: "",
});

console.log(await SqlQuery.table("core_schema").insert({name: "test", batch: 1}));