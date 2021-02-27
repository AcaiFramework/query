// Packages
import test from "@acai/testing";

// Strategies
import Sql from '..';

test.group("Test sql table methods", (context) => {
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

	test("Test create table", async (assert) => {
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

		const table = await Sql.table("test").getColumns();

		assert(table).toBeDefined();
		assert(table.id).toBeDefined();
		assert(table.email).toBeDefined();
		assert(table.label).toBeDefined();
		assert(table.description).toBeDefined();
	});

	test("Test field length", async (assert) => {
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

	test("Test field auto increment", async (assert) => {
		await Sql.table("test").createTable({
			field: {
				type			: "int",
				autoIncrement	: true,
				primary			: true,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.autoIncrement).toBe(true);
	});

	test("Test field primary", async (assert) => {
		await Sql.table("test").createTable({
			field: {
				type	: "int",
				primary	: true,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.primary).toBe(true);
	});

	test("Test field unique", async (assert) => {
		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			field: {
				type	: "int",
				unique	: true,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.unique).toBe(true);
	});

	test("Test field nullable", async (assert) => {
		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			field: {
				type		: "int",
				nullable	: true,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.nullable).toBe(true);
	});

	test("Test field default value", async (assert) => {
		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			field: {
				type	: "int",
				default	: 10,
			},
		});

		const table = await Sql.table("test").getColumns();

		assert(table.field.default).toBe(10);
	});
});