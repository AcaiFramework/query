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
		await Sql.table("base").dropTable();
	});

	// -------------------------------------------------
	// tests
	// -------------------------------------------------

	test("Test field basic constraint", async (assert) => {
		await Sql.table("base").createTable({
			id: {
				type: "int",
				primary: true,
			},
		});

		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			id_base: {
				type: "int",
				foreign: {
					table: "base",
				}
			}
		});

		const table = await Sql.table("test").getColumns();

		assert(table.id_base.foreign).toBeDefined();
		assert(table.id_base.foreign?.table).toBe("base");
		assert(table.id_base.foreign?.column).toBe("id");
	});

	test("Test field foreign key cascade on delete", async (assert) => {
		await Sql.table("base").createTable({
			id: {
				type: "int",
				primary: true,
			},
		});

		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			id_base: {
				type: "int",
				foreign: {
					table: "base",
					onDelete: "CASCADE"
				}
			}
		});

		const table = await Sql.table("test").getColumns();

		assert(table.id_base.foreign).toBeDefined();
		assert(table.id_base.foreign?.table).toBe("base");
		assert(table.id_base.foreign?.column).toBe("id");
		assert(table.id_base.foreign?.onDelete).toBe("CASCADE");
	});

	test("Test field foreign key cascade on update", async (assert) => {
		await Sql.table("base").createTable({
			id: {
				type: "int",
				primary: true,
			},
		});

		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			id_base: {
				type: "int",
				foreign: {
					table: "base",
					onUpdate: "CASCADE"
				}
			}
		});

		const table = await Sql.table("test").getColumns();

		assert(table.id_base.foreign).toBeDefined();
		assert(table.id_base.foreign?.table).toBe("base");
		assert(table.id_base.foreign?.column).toBe("id");
		assert(table.id_base.foreign?.onUpdate).toBe("CASCADE");
	});

	test("Test field foreign key cascade on update and delete", async (assert) => {
		await Sql.table("base").createTable({
			id: {
				type: "int",
				primary: true,
			},
		});

		await Sql.table("test").createTable({
			id: {
				type: "int",
				primary: true,
			},
			id_base: {
				type: "int",
				foreign: {
					table: "base",
					onUpdate: "CASCADE",
					onDelete: "CASCADE",
				}
			}
		});

		const table = await Sql.table("test").getColumns();

		assert(table.id_base.foreign).toBeDefined();
		assert(table.id_base.foreign?.table).toBe("base");
		assert(table.id_base.foreign?.column).toBe("id");
		assert(table.id_base.foreign?.onUpdate).toBe("CASCADE");
		assert(table.id_base.foreign?.onDelete).toBe("CASCADE");
	});
});