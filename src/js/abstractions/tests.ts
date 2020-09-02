// Abstractions
import AbstractQuery from './index';

// Strategies
import sql from '../classes/queryStrategies/sql/strategy';

// Create concrete class based on sql
class Query extends AbstractQuery {
	protected queryType = sql;
}

describe("Test abstract query methods", () => {

	// -------------------------------------------------
	// Test definition
	// -------------------------------------------------

	it("Test it's not undefined", () => {
		// Instance it
		const query = new Query;

		expect(query).toBeDefined();
	});
	
	// -------------------------------------------------
	// test and queries
	// -------------------------------------------------

	it("Test composition of a simple and query", () => {
		// Instance it
		const query = new Query;

		query.where('id', 2);

		expect(query.raw()).toBeDefined();
		expect(query.raw()).toMatchObject({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '=', 2]
					]
				}
			]
		});
	});

	it('Test composition of a simple and query', () => {
		const query = new Query;
		query.where('id', 2).where('name', 'John');

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '=', 2],
						['name', '=', 'John']
					]
				}
			]
		});
	});

	it('Test composition of a array and query', () => {
		const query = new Query;
		query.where([['id', 2], ['name', 'John']]);

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '=', 2],
						['name', '=', 'John']
					]
				}
			]
		});
	});
	
	// -------------------------------------------------
	// test and different queries
	// -------------------------------------------------

	it("Test composition of a simple and query", () => {
		// Instance it
		const query = new Query;

		query.where('id', '!=', 2);

		expect(query.raw()).toBeDefined();
		expect(query.raw()).toMatchObject({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '!=', 2]
					]
				}
			]
		});
	});

	it('Test composition of a simple and query', () => {
		const query = new Query;
		query.where('id', '!=', 2).where('name', '!=', 'John');

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '!=', 2],
						['name', '!=', 'John']
					]
				}
			]
		});
	});

	it('Test composition of a array and query', () => {
		const query = new Query;
		query.where([['id', '!=', 2], ['name', '!=', 'John']]);

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '!=', 2],
						['name', '!=', 'John']
					]
				}
			]
		});
	});
	
	// -------------------------------------------------
	// test or queries
	// -------------------------------------------------

	it('Test composition of a simple or different query', () => {
		const query = new Query;
		query.where('id', 2).orWhere('name', 'John');

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '=', 2],
					]
				},
				{
					type: "or",
					logic: [
						['name', '=', 'John'],
					]
				},				
			]
		});
	});
	
	// -------------------------------------------------
	// test and different queries
	// -------------------------------------------------

	it('Test composition of a simple or different query', () => {
		const query = new Query;
		query.where('id', '!=', 2).orWhere('name', '!=', 'John');

		expect(query.raw()).toStrictEqual({
			type: "or",
			logic: [
				{
					type: "and",
					logic: [
						['id', '!=', 2],
					]
				},
				{
					type: "or",
					logic: [
						['name', '!=', 'John']
					]
				}
			]
		});
	});
});