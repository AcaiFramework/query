// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql get query methods", (context) => {
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
	// tests - retrieval
	// -------------------------------------------------

	test("Test simple get without where clause", async (assert) => {
		const fields = await Sql.table("test").get();

		assert(fields).toBeDefined();
		assert(fields.length).toBe(3);
	});

	test("Test simple get with one where clause", async (assert) => {
		const fields = await Sql.table("test").where("id", 1).get();

		assert(fields).toBeDefined();
		assert(fields.length).toBe(1);
	});

	test("Test get first without where clause", async (assert) => {
		const fields = await Sql.table("test").first();

		assert(fields).toBeDefined();
	});

	test("Test paginate without where clause", async (assert) => {
		const fields = await Sql.table("test").paginate();

		assert(fields).toBeDefined();
		assert(fields.page).toBe(1);
		assert(fields.perPage).toBe(25);
		assert(fields.totalItems).toBe(3);
		assert(fields.data.length).toBe(3);
	});

	// -------------------------------------------------
	// tests - filters
	// -------------------------------------------------

	test("Test limit query", async (assert) => {
		const fields = await Sql.table("test").limit(1).get();

		assert(fields).toBeDefined();
		assert(fields.length).toBe(1);
	});

	test("Test offset query", async (assert) => {
		const fields = await Sql.table("test").limit(3, 1).get();

		assert(fields).toBeDefined();
		assert(fields[0].id).toBe(2);
	});

	test("Test return all fields", async (assert) => {
		const fields = await Sql.table("test").fields(["*"]).first();

		assert(fields).toBeDefined();
		assert(fields?.id).toBeDefined();
		assert(fields?.email).toBeDefined();
		assert(fields?.label).toBeDefined();
	});

	test("Test return only one field", async (assert) => {
		const fields = await Sql.table("test").fields(["id"]).first();

		assert(fields).toBeDefined();
		assert(fields?.id).toBeDefined();
		assert(fields?.email).toBeUndefined();
		assert(fields?.label).toBeUndefined();
	});

	test("Test order by id asc", async (assert) => {
		const fields = await Sql.table("test").orderBy("id").get();

		assert(fields).toBeDefined();
		assert(fields.length).toBe(3);
		assert(fields[0].id).toBe(1);
		assert(fields[1].id).toBe(2);
		assert(fields[2].id).toBe(3);
	});

	test("Test order by id desc", async (assert) => {
		const fields = await Sql.table("test").orderBy("id", "DESC").get();

		assert(fields).toBeDefined();
		assert(fields.length).toBe(3);
		assert(fields[0].id).toBe(3);
		assert(fields[1].id).toBe(2);
		assert(fields[2].id).toBe(1);
	});
});