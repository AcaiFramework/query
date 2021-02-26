// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql delete query methods", (context) => {
	// -------------------------------------------------
	// setup
	// -------------------------------------------------

	context.beforeAll(async () => {
		await Sql.toggleSettings({
			user		: "root",
			password	: "",
			database	: "acai_query",
		});
	});

	context.beforeEach(async () => {
		await Sql.table("test").createTable({
			id: {
				type			: "int",
				length			: 36,
				autoIncrement	: true,
				primary			: true,
			},
			email: {
				type	: "string",
				unique	: true,
				length	: 50,
			},
			label: {
				type: "string",
			},
			description: {
				type	: "string",
				nullable: true,
			},
		});

		await Sql.table("test").insert({email: "john.doe@email.com", 	label: "John Doe"});
		await Sql.table("test").insert({email: "mary.doe@email.com", 	label: "Mary Doe"});
		await Sql.table("test").insert({email: "junior.doe@email.com", 	label: "Junior Doe", description: "Son of John and Mary Doe"});
	});

	context.afterEach(async () => {
		await Sql.table("test").dropTable();
	});

	// -------------------------------------------------
	// tests
	// -------------------------------------------------

	test("Test single delete", async (assert) => {
		await Sql.table("test").where("id", 1).delete();

		const response = await Sql.table("test").where("id", 1).first();

		assert(response).toBeUndefined();
	});

	test("Test multiple delete", async (assert) => {
		await Sql.table("test").where("id", 1).orWhere("id", 2).delete();

		const response = await Sql.table("test").where("id", 1).orWhere("id", 2).get();

		assert(response.length).toBe(0);
	});

	test("Test delete without where", async (assert) => {
		await Sql.table("test").delete();

		const response = await Sql.table("test").get();

		assert(response.length).toBe(0);
	});
});