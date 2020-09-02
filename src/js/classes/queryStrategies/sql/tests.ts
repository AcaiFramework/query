// Classes
import Query from './index';

describe("Test the implementation of the sql strategy inside a query", () => {

	// -------------------------------------------------
	// Test definition
	// -------------------------------------------------

	it("Test if it's not undefined", () => {
		const query = new Query;

		expect(query).toBeDefined();
	});

	// -------------------------------------------------
	// Test query
	// -------------------------------------------------

	it('Test composition of a simple query', () => {
		const query = new Query;
		query.where('id', 2);

		expect(query.toString()).toBe('id = 2');
	});

	it('Test composition of a simple different query', () => {
		const query = new Query;
		query.where('id', '!=', 2);

		expect(query.toString()).toBe('id != 2');
	});

	// -------------------------------------------------
	// Test and query
	// -------------------------------------------------

	it('Test composition of a simple and query', () => {
		const query = new Query;
		query.where('id', 2).where('name', 'John');

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	it('Test composition of a array and query', () => {
		const query = new Query;
		query.where([['id', 2], ['name', 'John']]);

		expect(query.toString()).toBe('id = 2 AND name = \'John\'');
	});

	it('Test composition of a simple and different query', () => {
		const query = new Query;
		query.where('id', '!=', 2).where('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	it('Test composition of a array and different query', () => {
		const query = new Query;
		query.where([['id', '!=', 2], ['name', '!=', 'John']]);

		expect(query.toString()).toBe('id != 2 AND name != \'John\'');
	});

	// -------------------------------------------------
	// Test or query
	// -------------------------------------------------

	it('Test composition of a simple or query', () => {
		const query = new Query;
		query.where('id', 2).orWhere('name', 'John');

		expect(query.toString()).toBe('id = 2 OR name = \'John\'');
	});

	it('Test composition of a simple or different query', () => {
		const query = new Query;
		query.where('id', '!=', 2).orWhere('name', '!=', 'John');

		expect(query.toString()).toBe('id != 2 OR name != \'John\'');
	});
});