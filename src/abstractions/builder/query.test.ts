// Packages
import test from "https://deno.land/x/acai_testing@1.0.8hotfix/mod.ts";

// Abstractions
import AbstractQuery from './index.ts';

// Strategies
import sql from '../../classes/queryStrategies/sql/strategy.ts';

// Create concrete class based on sql
class Query extends AbstractQuery {
	protected queryType = sql;
}

test.group("Test abstract query methods", () => {

	// -------------------------------------------------
	// Test defintestion
	// -------------------------------------------------

	test("Test test's not undefined", (expect) => {
		// Instance test
		const query = new Query();

		expect(query).toBeDefined();
	});
	
	// -------------------------------------------------
	// test and queries
	// -------------------------------------------------

	test("Test compostestion of a simple and query", (expect) => {
		// Instance test
		const query = new Query;

		// build test
		query.where('id', 2);
		const raw = query.raw();

		expect(raw).toBeDefined();
		expect(query.raw()).toBe({
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

	test('Test compostestion of a simple and query', (expect) => {
		const query = new Query;
		query.where('id', 2).where('name', 'John');

		expect(query.raw()).toBe({
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

	test('Test compostestion of a array and query', (expect) => {
		const query = new Query;
		query.where([['id', 2], ['name', 'John']]);

		expect(query.raw()).toBe({
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

	test("Test compostestion of a simple and query", (expect) => {
		// Instance test
		const query = new Query;

		query.where('id', '!=', 2);

		expect(query.raw()).toBeDefined();
		expect(query.raw()).toBe({
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

	test('Test compostestion of a simple and query', (expect) => {
		const query = new Query;
		query.where('id', '!=', 2).where('name', '!=', 'John');

		expect(query.raw()).toBe({
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

	test('Test compostestion of a array and query', (expect) => {
		const query = new Query;
		query.where([['id', '!=', 2], ['name', '!=', 'John']]);

		expect(query.raw()).toBe({
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

	test('Test compostestion of a simple or different query', (expect) => {
		const query = new Query;
		query.where('id', 2).orWhere('name', 'John');

		expect(query.raw()).toBe({
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

	test('Test compostestion of a simple or different query', (expect) => {
		const query = new Query;
		query.where('id', '!=', 2).orWhere('name', '!=', 'John');

		expect(query.raw()).toBe({
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