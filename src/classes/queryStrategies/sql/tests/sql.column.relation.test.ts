// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql table relation methods", (context) => {
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

	context.afterEach(async () => {
		await Sql.table("test").dropTable();
	});

	// -------------------------------------------------
	// tests
	// -------------------------------------------------

	test("Test field basic constraint", async (assert) => {
		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			field: {
				type	: "string",
				length	: 36,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.length).toBe(36);
	});
});