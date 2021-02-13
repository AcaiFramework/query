import { SqlQuery } from "./index";

async function main () {
	await SqlQuery.toggleSettings({
		host		: "localhost",
		user		: "root",
		database	: "adonis_lexxer",
		password	: "",
	});

	console.log(await SqlQuery.table("core_schema").paginate());

	await SqlQuery.close();
}

main();
