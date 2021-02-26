// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql query methods", (context) => {
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
			}
		});
	});

	context.afterEach(async () => {
		await Sql.table("test").dropTable();
	});

	// -------------------------------------------------
	// tests
	// -------------------------------------------------

	test("Test connection successful", async (assert) => {
		const fields = await Sql.table("test").getColumns();

		assert(fields).toBeDefined().toTypeOf("object");
		assert(fields.id).toBeDefined().toTypeOf("object");
	});
});