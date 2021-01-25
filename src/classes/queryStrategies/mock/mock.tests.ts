// Packages
import test from "https://deno.land/x/acai_testing@1.0.8hotfix/mod.ts";

// Classes
import Query from './index.ts';

test.group("Test the implementation of the mock strategy inside a query", () => {

	// -------------------------------------------------
	// Test defintestion
	// -------------------------------------------------

	test("Test if test's not undefined", (expect) => {
		const query = new Query();

		expect(query).toBeDefined();
	});

	// -------------------------------------------------
	// Test query
	// -------------------------------------------------

	test('Test compostestion of a simple query', (expect) => {
		const query = new Query();
		query.where('id', 2);

		expect(query.toString()).toBe('id = 2');
	});

	test('Test compostestion of a simple different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2);

		expect(query.toString()).toBe('id != 2');
	});

	// -------------------------------------------------
	// Test and query
	// -------------------------------------------------

	test('Test compostestion of a simple and query', (expect) => {
		const query = new Query();
		query.where('id', 2).where('name', 'John');

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	test('Test compostestion of a array and query', (expect) => {
		const query = new Query();
		query.where([['id', 2], ['name', 'John']]);

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	test('Test compostestion of a simple and different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2).where('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	test('Test compostestion of a array and different query', (expect) => {
		const query = new Query();
		query.where([['id', '!=', 2], ['name', '!=', 'John']]);

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	// -------------------------------------------------
	// Test or query
	// -------------------------------------------------

	test('Test compostestion of a simple or query', (expect) => {
		const query = new Query();
		query.where('id', 2).orWhere('name', 'John');

		expect(query.toString()).toBe('id = 2 OR name = \'John\'');
	});

	test('Test compostestion of a simple or different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2).orWhere('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 OR name != \'John\'');
	});

	// -------------------------------------------------
	// Test general
	// -------------------------------------------------

	test('Test a simple select query', (expect) => {
		const query = new Query();
		query.store({});
		const result = query.get();

		expect(result).toBe([{}]);
	});

	test('Test a simple add query', (expect) => {
		const query = new Query();
		const result = query.store({
			id: 'yay',
			name: 'John Doe',
		});

		expect(result).toBe({id: 'yay', name: 'John Doe'});
	});

	test('Test a simple update query', (expect) => {
		const query = new Query();
		const result = query.update({
			id: 'yay',
			name: 'John Doe',
		});

		expect(result).toBe({id: 'yay', name: 'John Doe'});
	});

	test('Test a simple delete query', (expect) => {
		const query = new Query();
		const result = query.delete();

		expect(result).toBe(true);
	});
});