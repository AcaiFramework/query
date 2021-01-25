// Packages
import test from "https://deno.land/x/acai_testing@1.0.8hotfix/mod.ts";

// Classes
import Query from './index.ts';

test.group("Test the implementation of the sql strategy inside a query", () => {

	// -------------------------------------------------
	// Test definition
	// -------------------------------------------------

	test("Test if test's not undefined", (expect) => {
		const query = new Query();

		expect(query).toBeDefined();
	});

	// -------------------------------------------------
	// Test query
	// -------------------------------------------------

	test('Test composition of a simple query', (expect) => {
		const query = new Query();
		query.where('id', 2);

		expect(query.toString()).toBe('id = 2');
	});

	test('Test composition of a simple different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2);

		expect(query.toString()).toBe('id != 2');
	});

	// -------------------------------------------------
	// Test and query
	// -------------------------------------------------

	test('Test composition of a simple and query', (expect) => {
		const query = new Query();
		query.where('id', 2).where('name', 'John');

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	test('Test composition of a array and query', (expect) => {
		const query = new Query();
		query.where([['id', 2], ['name', 'John']]);

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	test('Test composition of a simple and different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2).where('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	test('Test composition of a array and different query', (expect) => {
		const query = new Query();
		query.where([['id', '!=', 2], ['name', '!=', 'John']]);

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	// -------------------------------------------------
	// Test or query
	// -------------------------------------------------

	test('Test composition of a simple or query', (expect) => {
		const query = new Query();
		query.where('id', 2).orWhere('name', 'John');

		expect(query.toString()).toBe('id = 2 OR name = \'John\'');
	});

	test('Test composition of a simple or different query', (expect) => {
		const query = new Query();
		query.where('id', '!=', 2).orWhere('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 OR name != \'John\'');
	});
});