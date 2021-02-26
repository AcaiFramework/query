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

	test("Test created table fields (id)", async (assert) => {
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

		assert(table.id).toBe({
			nullable: false,   
			primary: true,     
			default: undefined,
			type: 'int',       
			unique: false,     
			length: 255,
		});
	});

	test("Test created table fields (email)", async (assert) => {
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

		assert(table.email).toBe({
			nullable: false,   
			primary: false,    
			default: undefined,
			type: 'string',    
			unique: true,      
			length: 255
		});
	});

	test("Test created table fields (label)", async (assert) => {
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

		assert(table.label).toBe({
			nullable: false,   
			primary: false,    
			default: undefined,
			type: 'string',
			unique: false,
			length: 255,
		});
	});

	test("Test created table fields (description)", async (assert) => {
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
				type	: "text",
				nullable: true,
				default	: "",
			},
		});

		const table = await Sql.table("test").getColumns();

		console.log(table.description);

		assert(table.description).toBe({
			nullable: true,
			primary: false,
			default: "",
			type: 'text',
			unique: false,
			length: undefined,
		});
	});
});