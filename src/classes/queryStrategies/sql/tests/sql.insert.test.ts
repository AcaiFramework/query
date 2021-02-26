// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql insert query methods", (context) => {
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

	test("Test simple insert", async (assert) => {
		const fields = await Sql.table("test").insert({
			email		: "joe.doe@email.com",
			label		: "Joe Doe",
			description	: "Father of John Doe",
		});

		assert(fields).toBeDefined();
	});
});