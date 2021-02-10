import { SqlQuery } from "./index";

async function main () {
	await SqlQuery.toggleSettings({
		host		: "localhost",
		user		: "root",
		database	: "adonis_lexxer",
		password	: "",
	});

	console.log(await SqlQuery.table("core_schema").where("id", 33).update({name: "Hi"}));

	await SqlQuery.close();
}

main();